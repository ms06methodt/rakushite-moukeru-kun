@echo off
title Rakushite Moukeru Kun - Bitcoin Auto Fund
cd /d E:\アプリ開発\俺用ビットコイン儲けマシン\rakushite-moukeru-kun
echo ========================================================
echo   [Rakushite Moukeru Kun] Starting Cyber Trading Engine...
echo ========================================================
echo.
echo Opening browser: http://localhost:8081
start http://localhost:8081
echo.
call npm.cmd run web
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error occurred during startup.
    pause
)
