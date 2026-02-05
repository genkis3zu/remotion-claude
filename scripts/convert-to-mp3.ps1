# WAV to MP3 Converter
# Converts voice files to MP3 format for better compatibility

$ErrorActionPreference = "Continue"

# Refresh environment
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$voicesDir = Join-Path (Join-Path (Join-Path $PSScriptRoot "..") "public") "voices"
$voicesDir = (Resolve-Path $voicesDir).Path

Write-Host ("=" * 50)
Write-Host "WAV to MP3 Converter"
Write-Host ("=" * 50)

# Find ffmpeg
$ffmpegPath = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\*\*\bin\ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $ffmpegPath) {
    Write-Host "Error: ffmpeg not found" -ForegroundColor Red
    exit 1
}
$ffmpegPath = $ffmpegPath.FullName
Write-Host "ffmpeg found: $ffmpegPath" -ForegroundColor Green

$wavFiles = Get-ChildItem -Path $voicesDir -Filter "*.wav"
Write-Host "`nConverting $($wavFiles.Count) WAV files to MP3...`n"

foreach ($file in $wavFiles) {
    $inputPath = $file.FullName
    $outputPath = [System.IO.Path]::ChangeExtension($inputPath, ".mp3")

    Write-Host "Converting: $($file.Name) -> $([System.IO.Path]::GetFileName($outputPath))"

    $process = Start-Process -FilePath $ffmpegPath -ArgumentList "-y", "-i", "`"$inputPath`"", "-acodec", "libmp3lame", "-q:a", "2", "`"$outputPath`"" -Wait -PassThru -NoNewWindow -RedirectStandardError "NUL"

    if ($process.ExitCode -eq 0 -and (Test-Path $outputPath)) {
        Write-Host "  Done" -ForegroundColor Green
    } else {
        Write-Host "  Error: ffmpeg failed" -ForegroundColor Red
    }
}

Write-Host "`nConversion complete!"
Write-Host "Don't forget to update script.ts to use .mp3 files!"
