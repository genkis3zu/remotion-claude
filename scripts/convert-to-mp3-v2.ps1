# WAV to MP3 Converter (High Compatibility)
# Uses CBR 128kbps for maximum compatibility

$ErrorActionPreference = "Continue"

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$voicesDir = Join-Path (Join-Path (Join-Path $PSScriptRoot "..") "public") "voices"
$voicesDir = (Resolve-Path $voicesDir).Path

Write-Host ("=" * 50)
Write-Host "WAV to MP3 Converter (High Compatibility)"
Write-Host ("=" * 50)

$ffmpegPath = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\*\*\bin\ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $ffmpegPath) {
    Write-Host "Error: ffmpeg not found" -ForegroundColor Red
    exit 1
}
$ffmpegPath = $ffmpegPath.FullName
Write-Host "ffmpeg found: $ffmpegPath" -ForegroundColor Green

$wavFiles = Get-ChildItem -Path $voicesDir -Filter "*.wav"
Write-Host "`nConverting $($wavFiles.Count) WAV files to MP3 (CBR 128kbps)...`n"

foreach ($file in $wavFiles) {
    $inputPath = $file.FullName
    $mp3Name = [System.IO.Path]::ChangeExtension($file.Name, ".mp3")
    $outputPath = Join-Path $voicesDir $mp3Name

    # Remove existing MP3 if exists
    if (Test-Path $outputPath) {
        Remove-Item $outputPath -Force
    }

    Write-Host "Converting: $($file.Name) -> $mp3Name"

    # CBR 128kbps, stereo (more compatible), 44100Hz
    $process = Start-Process -FilePath $ffmpegPath -ArgumentList "-y", "-i", "`"$inputPath`"", "-acodec", "libmp3lame", "-b:a", "128k", "-ac", "2", "-ar", "44100", "`"$outputPath`"" -Wait -PassThru -NoNewWindow -RedirectStandardError "NUL"

    if ($process.ExitCode -eq 0 -and (Test-Path $outputPath)) {
        Write-Host "  Done" -ForegroundColor Green
    } else {
        Write-Host "  Error: ffmpeg failed" -ForegroundColor Red
    }
}

Write-Host "`nConversion complete!"
