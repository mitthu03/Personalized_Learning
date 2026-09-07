$ErrorActionPreference = "Stop"

$projectRoot = $PSScriptRoot
$python = Get-Command python -ErrorAction SilentlyContinue

if (-not $python) {
    throw "Python was not found on PATH. Install Python 3.11+ and try again."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm was not found on PATH. Install Node.js and try again."
}

$fastApiPath = Join-Path $projectRoot "backend\fastapi_ai"
$djangoPath = Join-Path $projectRoot "backend\django_core"
$frontendPath = Join-Path $projectRoot "frontend"

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$fastApiPath'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001"
)

python (Join-Path $djangoPath "manage.py") migrate

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$djangoPath'; python manage.py runserver 0.0.0.0:8000"
)

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$frontendPath'; npx vite --host 0.0.0.0"
)

Write-Host "Services started:"
Write-Host "  Frontend: http://localhost:5173/"
Write-Host "  Django API: http://localhost:8000/api/"
Write-Host "  FastAPI docs: http://localhost:8001/docs"
