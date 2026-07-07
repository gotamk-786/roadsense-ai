$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $ProjectRoot "scripts\activate_d_drive_env.ps1")
python -c "import ultralytics, cv2, torch; print('ultralytics', ultralytics.__version__); print('opencv', cv2.__version__); print('torch', torch.__version__); print('cuda', torch.cuda.is_available())"
