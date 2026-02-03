# Guardrail System Policy (v1.0) - Remotion Video Project

## 目的

このディレクトリは、AI エージェント（ClaudeCode / Codex）が安定して高品質な開発運用を行うための
行動原則・出力基準・検証手順を明文化したガードレール群を管理するものです。

本ドキュメント群は「AI用プロンプト」ではなく「チーム全体の行動規範」です。
人間とAIが共通の土台で開発を行うことを目的とします。

---

## プロジェクト概要

**Remotion Video Creation Project**
- React ベースのビデオ作成フレームワーク
- メインコード: `testvideo/src/`
- 出力形式: MP4, WebM

---

## 構成

| ファイル | 目的 |
|----------|------|
| `role.md` | エージェント定義（Commander/ClaudeCode/Codex）※唯一のロール定義 |
| `codex_meta.md` | 助言・設計・レビュー側のルール |
| `claude_meta.md` | 実装・検証・報告側のルール |
| `meta_relay.md` | コンテキスト引き継ぎプロトコル |
| `checklist.md` | 各タスクでAIが再読すべきチェックリスト |
| `system_architecture.md` | システムアーキテクチャ（Tech Stack, ディレクトリ構造） |
| `ui_architecture.md` | UI/アニメーション設計原則 |
| `glossary.md` | 用語や命名規約（AIの誤解防止用） |
| `config.yaml` | 設定ファイル（パス、閾値、品質ゲート） |
| `README.md` | 本運用ポリシー |

> **Note**: `AGENTS.md` は作成しない。エージェント定義は `role.md` に集約されている。

---

## Remotion 固有ルール

### 必須 (MUST)

1. **すべてのアニメーションは `useCurrentFrame()` を使用**
   - CSS transition/animation は禁止
   - Tailwind の `animate-*`, `transition-*` クラスは禁止

2. **Composition には必須 props を設定**
   - `id`, `component`, `durationInFrames`, `fps`, `width`, `height`

3. **品質ゲート**
   - `npm run lint` pass
   - Remotion Studio でレンダリング確認
   - `npx remotion render` 成功

---

## 運用手順

### 1. 新しいルールを追加・変更する場合
1. `feature/guardrail-update-*` ブランチを作成
2. 該当ファイルを編集
3. Pull Request タイトルを `docs(guardrail): update checklist vX.Y` 形式で作成
4. レビューで確認：
   - 変更の目的・影響範囲・後方互換性
   - checklist との整合性
5. 承認後、`main` にマージ

### 2. AIがルールを破った場合
1. `SESSION_SUMMARY.md` に記録
2. 次回助言時に `.guardrails/checklist.md` の該当項目を明示的に再読させる
3. 再発防止が必要な場合はルール改訂の提案を出し、PR化

### 3. 定期レビュー
- **頻度**：毎月またはフェーズ区切りごとに1回
- **目的**：
  - checklist の過剰化／形骸化を防ぐ
  - ルールが現場に合っているかを評価
  - メトリクス（エラー率、レンダリング失敗率）に基づき改善

---

## 品質ゲート

```bash
cd testvideo

# 1. Lint (必須)
npm run lint

# 2. Studio 確認 (手動)
npm run dev

# 3. レンダリングテスト (手動)
npx remotion render HelloWorld out/test.mp4
```

---

## 運用の理念

> 「ルールは縛りではなく、再現性のための構造である」

ガードレールはAIの自由を奪うものではなく、**品質と再現性を保ったまま進化するための足場**です。
破ってもいいが、理由と結果を記録すること。それが次の改善材料になる。
