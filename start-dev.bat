@echo off
echo Starting BrewSync Backend and Frontend...
start "BrewSync Backend (Port 5000)" cmd /k "cd /d %~dp0 && npm run start:backend"
start "BrewSync Frontend (Port 5173)" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo ==============================================
echo  BrewSync is starting up!
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo ==============================================
pause
