# WAV Audio Converter (24kHz → 44.1kHz)
# Requires ffmpeg to be installed

$ErrorActionPreference = "Continue"

# Refresh environment to get updated PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$voicesDir = Join-Path (Join-Path (Join-Path $PSScriptRoot "..") "public") "voices"
$voicesDir = (Resolve-Path $voicesDir).Path

Write-Host ("=" * 50)
Write-Host "WAV Audio Converter (24kHz -> 44.1kHz)"
Write-Host ("=" * 50)

# Find ffmpeg
$ffmpegPath = $null
try {
    $ffmpegPath = (Get-Command ffmpeg -ErrorAction Stop).Source
} catch {
    Write-Host "ffmpeg not found in PATH, searching..."

    # Search common locations
    $found = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\*\*\bin\ffmpeg.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $ffmpegPath = $found.FullName
    }
}

if (-not $ffmpegPath) {
    Write-Host "Error: ffmpeg not found" -ForegroundColor Red
    exit 1
}

Write-Host "ffmpeg found: $ffmpegPath" -ForegroundColor Green

$wavFiles = Get-ChildItem -Path $voicesDir -Filter "*.wav"
Write-Host "`nConverting $($wavFiles.Count) WAV files...`n"

foreach ($file in $wavFiles) {
    $inputPath = $file.FullName
    $tempPath = Join-Path $voicesDir ("temp_" + $file.Name)

    Write-Host "Converting: $($file.Name)"

    # Run ffmpeg and wait for completion
    $process = Start-Process -FilePath $ffmpegPath -ArgumentList "-y", "-i", "`"$inputPath`"", "-ar", "44100", "`"$tempPath`"" -Wait -PassThru -NoNewWindow -RedirectStandardError "NUL"

    if ($process.ExitCode -eq 0 -and (Test-Path $tempPath)) {
        Remove-Item $inputPath -Force
        Rename-Item $tempPath -NewName $file.Name
        Write-Host "  Done" -ForegroundColor Green
    } else {
        Write-Host "  Error: ffmpeg failed with exit code $($process.ExitCode)" -ForegroundColor Red
        if (Test-Path $tempPath) {
            Remove-Item $tempPath -Force
        }
    }
}

Write-Host "`nConversion complete!"
