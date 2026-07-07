$ProjectRoot = Split-Path -Parent $PSScriptRoot

$env:TEMP = Join-Path $ProjectRoot ".tmp"
$env:TMP = Join-Path $ProjectRoot ".tmp"
$env:PIP_CACHE_DIR = Join-Path $ProjectRoot ".pip-cache"
$env:TORCH_HOME = Join-Path $ProjectRoot ".torch-cache"
$env:YOLO_CONFIG_DIR = Join-Path $ProjectRoot ".ultralytics"
$env:ULTRALYTICS_CONFIG_DIR = Join-Path $ProjectRoot ".ultralytics"
$env:MPLCONFIGDIR = Join-Path $ProjectRoot ".matplotlib"
$env:PYTHONPYCACHEPREFIX = Join-Path $ProjectRoot ".pycache"
$env:XDG_CACHE_HOME = Join-Path $ProjectRoot ".cache"
$env:HF_HOME = Join-Path $ProjectRoot ".hf-cache"

. (Join-Path $ProjectRoot ".venv\Scripts\Activate.ps1")

Write-Host "D-drive AI environment activated."
