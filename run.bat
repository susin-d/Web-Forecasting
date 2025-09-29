@echo off
echo Starting Weather Forecasting Application...
echo.

echo Starting Backend Server...
start "Backend" cmd /c "cd backend && mvn spring-boot:run"

echo Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

echo Starting Frontend Server...
start  cmd /c "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (servers will continue running)
pause > nul