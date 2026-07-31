@echo off
setlocal enabledelayedexpansion
set PORT=3200

cd /d "%~dp0"

if "%~1"=="__hidden__" goto :run

REM Relaunch this same script with a hidden console window, then exit
REM immediately so the visible window disappears while the server keeps
REM running in the background. All output goes to dev-server.log instead.
REM
REM The self-path is passed through an environment variable (not embedded
REM as literal text in the generated .vbs) because this system's cmd.exe
REM writes files using the console's active code page (chcp reports 65001
REM here), while cscript.exe always reads .vbs files using the system's
REM default ANSI code page regardless of that setting -- embedding the
REM Chinese project path directly as text got silently corrupted and the
REM relaunch failed. Environment variables are stored as UTF-16 by Windows
REM and read back correctly via WshShell.Environment(), sidestepping the
REM mismatch entirely.
set "SELF=%~f0"
set "VBS=%TEMP%\expectaly-rent-launch-%RANDOM%.vbs"
> "%VBS%" echo Set WshShell = CreateObject("WScript.Shell")
>> "%VBS%" echo WshShell.Run WshShell.Environment("PROCESS")("SELF") ^& " __hidden__", 0, False
cscript //nologo "%VBS%" >nul 2>&1
del "%VBS%" >nul 2>&1
exit /b 0

:run
set "LOG=%~dp0dev-server.log"

where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found. Please install Node.js and make sure it was added to PATH ^(https://nodejs.org/^). > "%LOG%"
    exit /b 1
)

echo ============================================ > "%LOG%"
echo  Expectaly Rent - Dev Server ^(hidden mode^) >> "%LOG%"
echo ============================================ >> "%LOG%"
echo Started at %DATE% %TIME% >> "%LOG%"
echo. >> "%LOG%"

echo [1/3] Stopping any process already listening on port %PORT% ... >> "%LOG%"
set FOUND=0
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
    set FOUND=1
    echo   Killing PID %%P >> "%LOG%"
    taskkill /F /PID %%P >nul 2>&1
)
if "!FOUND!"=="0" echo   No process was using port %PORT%. >> "%LOG%"

echo. >> "%LOG%"
echo [2/3] This machine can be reached at: >> "%LOG%"
echo   http://localhost:%PORT% >> "%LOG%"
for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } | Select-Object -ExpandProperty IPAddress"`) do (
    echo   http://%%A:%PORT% >> "%LOG%"
)

echo. >> "%LOG%"
echo [3/3] Starting dev server on 0.0.0.0:%PORT% ^(no window; check this log or stop-dev.bat^) ... >> "%LOG%"
echo. >> "%LOG%"

call npm run dev -- -p %PORT% -H 0.0.0.0 >> "%LOG%" 2>&1

echo. >> "%LOG%"
echo Server stopped at %DATE% %TIME% >> "%LOG%"
endlocal
