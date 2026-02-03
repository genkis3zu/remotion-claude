# Glossary / Naming Rules

## Git & Deployment
- main ブランチ：`main` 固定
- commit 規約：Conventional Commits（feat/fix/perf/chore...）
- ドキュメント：PLAN / CHANGELOG / SESSION_SUMMARY
- PR ラベル例：perf, docs, guardrail, hotfix

## Remotion 用語

| 用語 | 説明 |
|------|------|
| Composition | ビデオの定義単位。id, component, duration, fps, 解像度を指定 |
| Frame | ビデオの1コマ。30fps なら 1秒 = 30フレーム |
| useCurrentFrame | 現在のフレーム番号を取得するフック |
| useVideoConfig | fps, width, height, durationInFrames を取得するフック |
| interpolate | フレーム番号を別の値にマッピングする関数 |
| spring | 物理ベースのアニメーション関数 |
| Sequence | 指定フレームから子コンポーネントを表示するコンテナ |
| Series | 順番に表示するコンテナ（Sequence の連続版） |
| AbsoluteFill | 親を埋める絶対配置コンテナ |
| registerRoot | エントリーポイントで Remotion に Root コンポーネントを登録 |
| Remotion Studio | 開発用プレビュー環境 (npm run dev) |

## Zod 用語

| 用語 | 説明 |
|------|------|
| schema | props の型定義と検証ルール |
| zColor | Remotion 提供の色検証用 Zod 型 |
| defaultProps | Composition のデフォルト props |

## アニメーション関連

| 用語 | 説明 |
|------|------|
| extrapolateLeft/Right | 範囲外の値の扱い（clamp, extend, identity） |
| damping | spring のバウンス抑制（高い = 抑制強） |
| stiffness | spring の速度（高い = 速い） |
| mass | spring の重さ（高い = 遅い） |
| premountFor | Sequence で事前にコンポーネントをロードするフレーム数 |

## ファイル構造

| パス | 説明 |
|------|------|
| testvideo/src/index.ts | エントリーポイント |
| testvideo/src/Root.tsx | Composition 登録 |
| testvideo/remotion.config.ts | Remotion CLI 設定 |
| .guardrails/ | AI エージェント用ルール |
| .agents/skills/ | Remotion ベストプラクティス |

## メトリクス略称

| 略称 | 説明 |
|------|------|
| fps | Frames Per Second |
| duration | 総フレーム数 (durationInFrames) |
| render time | レンダリング所要時間 |
| file size | 出力ファイルサイズ |
