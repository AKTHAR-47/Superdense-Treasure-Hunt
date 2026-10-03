@echo off
echo ===================================================================
echo   ENTANGLED: The Shadow Labyrinth (Superdense Coding Adventure)
echo ===================================================================
echo Starting local web server and opening browser...
echo.
timeout /t 1 >nul
start "" "http://localhost:8000/index.html"
python -m http.server 8000
pause
