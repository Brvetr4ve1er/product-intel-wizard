

@echo off
echo Starting PKOS Intelligence Dashboard...
netstat -ano | findstr :8000 > nul
if %errorlevel% neq 0 (
    start /b python server.py
    timeout /t 2 /nobreak > nul
)
start http://localhost:8000
exit
