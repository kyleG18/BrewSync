import admin from "firebase-admin";

let initialized = false;

function initFirebaseAdmin() {
  if (initialized || admin.apps.length > 0) {
    initialized = true;
    return true;
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      initialized = true;
      return true;
    }

    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        })
      });
      initialized = true;
      return true;
    }
  } catch (err) {
    console.error("Firebase Admin initialization error:", err.message);
  }

  return false;
}

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: "Authentication token is required." });
  }

  const ready = initFirebaseAdmin();
  if (!ready) {
    return res.status(503).json({
      error: "Firebase Admin is not configured on the server."
    });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    let role = "staff";

    try {
      const userDoc = await admin.firestore().collection("users").doc(decoded.uid).get();
      if (userDoc.exists && userDoc.data()?.role) {
        role = userDoc.data().role;
      }
    } catch (_) {
      // default to staff if Firestore lookup is unavailable
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name || "",
      role
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(" or ")}.`
      });
    }
    next();
  };
}
