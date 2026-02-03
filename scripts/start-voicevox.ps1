# VOICEVOX Docker サーバー起動スクリプト (PowerShell)
# 使用方法: .\scripts\start-voicevox.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VOICEVOX Docker Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Docker が起動しているか確認
$dockerRunning = docker info 2>$null
if (-not $dockerRunning) {
    Write-Host "Error: Docker が起動していません。Docker Desktop を起動してください。" -ForegroundColor Red
    exit 1
}

# プロジェクトルートに移動
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

Write-Host "Starting VOICEVOX server..." -ForegroundColor Yellow

# Docker Compose で起動
docker-compose up -d voicevox

# 起動待機
Write-Host "Waiting for VOICEVOX to start..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:50021/version" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "VOICEVOX Server Ready!" -ForegroundColor Green
            Write-Host "URL: http://localhost:50021" -ForegroundColor Green
            Write-Host "Version: $($response.Content)" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "停止するには: docker-compose down" -ForegroundColor Cyan
            exit 0
        }
    } catch {
        # 接続エラーは無視して再試行
    }

    $attempt++
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Error: VOICEVOX の起動がタイムアウトしました" -ForegroundColor Red
Write-Host "docker logs voicevox-engine でログを確認してください" -ForegroundColor Yellow
exit 1
