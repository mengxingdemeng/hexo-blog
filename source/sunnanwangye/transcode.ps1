
image.pngparam(
  [string]$InputFile = "舞蹈.mp4",
  [string]$OutputFile = "舞蹈_fixed.mp4",
  [string]$FfmpegPath = "C:\ffmpeg\bin\ffmpeg.exe",
  [switch]$OverwriteOriginal
)

$ErrorActionPreference = "Stop"

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Err($msg)  { Write-Host "[ERR]  $msg" -ForegroundColor Red }

# 1) 检查 ffmpeg
$ffmpegCmd = $null
if (Test-Path $FfmpegPath) {
  $ffmpegCmd = $FfmpegPath
  Write-Info "Using ffmpeg at: $FfmpegPath"
} else {
  $cmd = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if ($cmd) {
    $ffmpegCmd = $cmd.Source
    Write-Info "Using ffmpeg in PATH: $ffmpegCmd"
  } else {
    Write-Err "ffmpeg.exe not found. Put ffmpeg at C:\ffmpeg\bin\ffmpeg.exe or pass -FfmpegPath."
    exit 1
  }
}

# 2) 检查输入文件
if (-not (Test-Path $InputFile)) {
  Write-Err "Input file not found: $InputFile"
  exit 1
}
Write-Info "Input : $InputFile"
Write-Info "Output: $OutputFile"

# 3) 执行转码（浏览器友好：H.264 + AAC）
$args = @(
  "-y",
  "-i", $InputFile,
  "-c:v", "libx264",
  "-pix_fmt", "yuv420p",
  "-profile:v", "high",
  "-level", "4.1",
  "-preset", "medium",
  "-crf", "22",
  "-c:a", "aac",
  "-b:a", "128k",
  "-movflags", "+faststart",
  $OutputFile
)

Write-Info "Start transcoding..."
& $ffmpegCmd @args

if ($LASTEXITCODE -ne 0) {
  Write-Err "Transcode failed with exit code: $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Ok "Done: $OutputFile"

# 4) 可选：覆盖原文件
if ($OverwriteOriginal) {
  Copy-Item -Path $OutputFile -Destination $InputFile -Force
  Write-Ok "Overwritten original file: $InputFile"
}

