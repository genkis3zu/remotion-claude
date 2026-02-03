#!/bin/bash
# VOICEVOX Docker サーバー起動スクリプト (Bash)
# 使用方法: ./scripts/start-voicevox.sh

set -e

echo "========================================"
echo "VOICEVOX Docker Server"
echo "========================================"

# Docker が起動しているか確認
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker が起動していません。Docker を起動してください。"
    exit 1
fi

# プロジェクトルートに移動
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo "Starting VOICEVOX server..."

# Docker Compose で起動
docker-compose up -d voicevox

# 起動待機
echo "Waiting for VOICEVOX to start..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:50021/version > /dev/null 2>&1; then
        VERSION=$(curl -s http://localhost:50021/version)
        echo ""
        echo "========================================"
        echo "VOICEVOX Server Ready!"
        echo "URL: http://localhost:50021"
        echo "Version: $VERSION"
        echo "========================================"
        echo ""
        echo "停止するには: docker-compose down"
        exit 0
    fi

    ATTEMPT=$((ATTEMPT + 1))
    printf "."
    sleep 2
done

echo ""
echo "Error: VOICEVOX の起動がタイムアウトしました"
echo "docker logs voicevox-engine でログを確認してください"
exit 1
