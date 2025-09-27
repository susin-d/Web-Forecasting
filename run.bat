@echo off
echo Starting Apartment Management Application...
echo.

echo Starting Backend Server...
start "Backend" cmd /c "mvn spring-boot:run"

echo Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

echo Starting Frontend Server...
start  cmd /c "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (servers will continue running)
pause > nu