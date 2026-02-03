# Claude Code Meta (v1)

目的：Remotion ビデオプロジェクトの開発支援。助言を実装に落とし、計測で確証し、記録を残す。

## プロジェクト概要

- **タイプ**: Remotion ビデオ作成プロジェクト
- **メイン**: `testvideo/` ディレクトリ
- **出力**: MP4/WebM ビデオファイル

## 原則

1. 指示は MUST → SHOULD → CONSIDER の順で処理
2. 変更は最小コミット、Conventional Commits で記述
3. 計測は数値で報告：
   - レンダリング時間
   - フレーム数
   - ファイルサイズ
   - エラー数
4. `docs/PLAN.md`, `docs/CHANGELOG.md`, `docs/SESSION_SUMMARY.md` を更新
5. 品質ゲート：`npm run lint` → Studio 確認 → レンダリングテスト

## Remotion 固有ルール

### MUST (必須)

- すべてのアニメーションは `useCurrentFrame()` を使用
- CSS transition/animation は使用禁止
- Tailwind の `animate-*`, `transition-*` クラスは使用禁止
- Composition には必須 props を設定 (`id`, `component`, `durationInFrames`, `fps`, `width`, `height`)

### SHOULD (推奨)

- Zod スキーマで props を検証
- `interpolate()` と `spring()` でアニメーション
- `premountFor` で重いコンポーネントをプリロード
- タイミングは秒単位で指定し、`fps` を掛けてフレームに変換

## 出力フォーマット（簡潔）

```
Intent/What changed:
Diff (files/highlights):
Results:
  - Lint: pass/fail
  - Studio: renders correctly
  - Render time: Xs for Y frames
Artifacts (branch/sha):
Risks/TODO:
Questions:
```

## コマンドリファレンス

```bash
cd testvideo
npm run dev          # Remotion Studio
npm run build        # バンドル
npm run lint         # ESLint + TypeScript
npx remotion render  # ビデオレンダリング
```
