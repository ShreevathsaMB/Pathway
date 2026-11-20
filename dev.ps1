# Starts the Pathway Django backend and Vite frontend together in this one window.
# Press Ctrl+C to stop both.
#
#   powershell -ExecutionPolicy Bypass -File .\dev.ps1
#
# Use this instead of running two terminals by hand.

$ErrorActionPreference = 'Stop'

$root        = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir  = Join-Path $root 'pathway-backend'
$frontendDir = Join-Path $root 'pathway-frontend'
$python      = Join-Path $backendDir 'venv\Scripts\python.exe'

if (-not (Test-Path $python)) {
    Write-Host "Python venv not found at $python" -ForegroundColor Red
    Write-Host 'Create it with:  python -m venv venv  then  pip install -r requirements.txt' -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path (Join-Path $frontendDir 'node_modules'))) {
    Write-Host 'node_modules is missing - run "npm install" in pathway-frontend first.' -ForegroundColor Red
    exit 1
}

# A leftover server on either port will make the new one silently serve stale code,
# so refuse to start until the port is free.
foreach ($port in 8000, 5173) {
    $listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($listener) {
        $owner = ($listener.OwningProcess | Sort-Object -Unique) -join ', '
        Write-Host "Port $port is already in use by PID $owner." -ForegroundColor Yellow
        Write-Host "Stop it first:  Stop-Process -Id $owner -Force" -ForegroundColor Yellow
        exit 1
    }
}

$django = $null
$vite   = $null

try {
    Write-Host 'Starting Django backend  -> http://localhost:8000' -ForegroundColor Cyan
    $django = Start-Process -FilePath $python `
        -ArgumentList 'manage.py', 'runserver', '127.0.0.1:8000' `
        -WorkingDirectory $backendDir -PassThru -NoNewWindow

    Write-Host 'Starting Vite frontend  -> http://localhost:5173' -ForegroundColor Cyan
    $vite = Start-Process -FilePath 'npm.cmd' `
        -ArgumentList 'run', 'dev' `
        -WorkingDirectory $frontendDir -PassThru -NoNewWindow

    Write-Host ''
    Write-Host '  App    http://localhost:5173' -ForegroundColor Green
    Write-Host '  API    http://localhost:8000' -ForegroundColor Green
    Write-Host '  Admin  http://localhost:8000/admin/login/?next=/admin/' -ForegroundColor Green
    Write-Host ''
    Write-Host 'Ctrl+C stops both servers.' -ForegroundColor DarkGray

    Wait-Process -Id $vite.Id
}
finally {
    foreach ($proc in @($vite, $django)) {
        if ($proc -and -not $proc.HasExited) {
            # /T kills the auto-reloader child process too
            & taskkill /PID $proc.Id /T /F 2>&1 | Out-Null
        }
    }

    # Safety net: the reloader can outlive its parent, so sweep anything still
    # running runserver for *this* checkout only.
    Get-CimInstance Win32_Process -Filter "name='python.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -like '*manage.py runserver*' -and $_.CommandLine -like "*$backendDir*" } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

    Write-Host 'Stopped.' -ForegroundColor DarkGray
}
