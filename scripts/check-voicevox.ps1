# VOICEVOX 接続確認スクリプト
# 使用方法: .\scripts\check-voicevox.ps1

Write-Host "VOICEVOX 接続確認中..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:50021/version" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ VOICEVOX に接続できました" -ForegroundColor Green
    Write-Host "   Version: $($response.Content)" -ForegroundColor Cyan

    # スピーカー一覧を取得
    $speakers = Invoke-RestMethod -Uri "http://localhost:50021/speakers" -Method Get
    Write-Host ""
    Write-Host "利用可能なキャラクター:" -ForegroundColor Yellow
    foreach ($speaker in $speakers) {
        Write-Host "  - $($speaker.name)" -ForegroundColor White
        foreach ($style in $speaker.styles) {
            Write-Host "      ID: $($style.id) - $($style.name)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ VOICEVOX に接続できません" -ForegroundColor Red
    Write-Host ""
    Write-Host "以下を確認してください:" -ForegroundColor Yellow
    Write-Host "  1. Docker Desktop が起動しているか" -ForegroundColor White
    Write-Host "  2. VOICEVOX コンテナが起動しているか: docker-compose up -d" -ForegroundColor White
    Write-Host "  3. ポート 50021 が空いているか" -ForegroundColor White
    exit 1
}
