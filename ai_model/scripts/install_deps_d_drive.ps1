$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$VenvPath = Join-Path $ProjectRoot ".venv"
$TmpPath = Join-Path $ProjectRoot ".tmp"
$PipCache = Join-Path $ProjectRoot ".pip-cache"
$TorchHome = Join-Path $ProjectRoot ".torch-cache"
$UltralyticsHome = Join-Path $ProjectRoot ".ultralytics"
$MatplotlibConfig = Join-Path $ProjectRoot ".matplotlib"
$PyCache = Join-Path $ProjectRoot ".pycache"

New-Item -ItemType Directory -Force -Path $TmpPath, $PipCache, $TorchHome, $UltralyticsHome, $MatplotlibConfig, $PyCache | Out-Null

$env:TEMP = $TmpPath
$env:TMP = $TmpPath
$env:PIP_CACHE_DIR = $PipCache
$env:TORCH_HOME = $TorchHome
$env:YOLO_CONFIG_DIR = $UltralyticsHome
$env:ULTRALYTICS_CONFIG_DIR = $UltralyticsHome
$env:MPLCONFIGDIR = $MatplotlibConfig
$env:PYTHONPYCACHEPREFIX = $PyCache
$env:XDG_CACHE_HOME = Join-Path $ProjectRoot ".cache"
$env:HF_HOME = Join-Path $ProjectRoot ".hf-cache"

if (!(Test-Path -LiteralPath (Join-Path $VenvPath "Scripts\python.exe"))) {
  python -m venv $VenvPath
}

$Python = Join-Path $VenvPath "Scripts\python.exe"
$PipIni = Join-Path $VenvPath "pip.ini"
@"
[global]
cache-dir = $PipCache
timeout = 120
retries = 5
"@ | Set-Content -LiteralPath $PipIni -Encoding ASCII

& $Python -m pip install --upgrade pip --cache-dir $PipCache
& $Python -m pip install --no-compile --cache-dir $PipCache -r (Join-Path $ProjectRoot "requirements.txt")

Write-Host "AI dependencies installed in: $VenvPath"
Write-Host "Pip cache: $PipCache"
Write-Host "Temp files: $TmpPath"

