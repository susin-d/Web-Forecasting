@echo off
echo Installing dependencies for Weather Forecasting Application...
echo.

echo Installing backend dependencies...
cd backend
mvn clean install -DskipTests
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Installation completed.
pause