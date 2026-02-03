# VOICEVOX スピーカー一覧取得
$speakers = Invoke-RestMethod -Uri 'http://localhost:50021/speakers'
foreach($s in $speakers[0..9]) {
    Write-Host $s.name -ForegroundColor Cyan
    foreach($st in $s.styles) {
        Write-Host "  ID $($st.id): $($st.name)"
    }
}
