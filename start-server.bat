@echo off
chcp 65001 >nul
cd /d "%~dp0"
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*' -and $_.PrefixOrigin -ne 'WellKnown' } ^| Sort-Object InterfaceMetric ^| Select-Object -First 1).IPAddress"') do set LANIP=%%i
echo ============================================================
echo   เว็บสื่อการสอน Computer Programming กำลังเปิด...
echo.
echo   บนเครื่องนี้   :  http://localhost:8741
echo   บนมือถือ/แท็บเล็ต (Wi-Fi วงเดียวกัน):
echo                    http://%LANIP%:8741
echo.
echo   ปิดเซิร์ฟเวอร์: กด Ctrl+C หรือปิดหน้าต่างนี้
echo ============================================================
python -m http.server 8741
