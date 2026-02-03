# Guardrail Checklist (Remotion Video Project)

このチェックリストは、AI エージェントが各タスクの前後に確認すべき共通基準である。
タスク遂行時はこの項目に従って作業し、必要なら出力内に証跡を含めること。

---

# 1. Context（文脈の正しさ）

- [ ] Context Block が冒頭に存在しているか
- [ ] BasedOn の対象（前回出力 / ファイル）が正しいか確認
- [ ] Objective が明確で1行になっているか
- [ ] 前のサイクルと矛盾がないか

---

# 2. Remotion Animation Rules (CRITICAL)

- [ ] **すべてのアニメーションが `useCurrentFrame()` を使用しているか**
- [ ] CSS transition / animation を使用していないか
- [ ] Tailwind の `animate-*`, `transition-*` クラスを使用していないか
- [ ] `interpolate()` または `spring()` でアニメーションしているか
- [ ] タイミングは秒 × `fps` でフレームに変換しているか

---

# 3. Composition Structure

- [ ] Composition に必須 props があるか
  - `id`: 一意な識別子
  - `component`: React コンポーネント
  - `durationInFrames`: フレーム数
  - `fps`: フレームレート
  - `width`, `height`: 解像度
- [ ] Zod スキーマで props を定義・検証しているか
- [ ] `defaultProps` が設定されているか

---

# 4. Sequencing

- [ ] `<Sequence>` の `from` が正しいフレームを指定しているか
- [ ] 重いコンポーネントに `premountFor` を設定しているか
- [ ] Sequence 内の `useCurrentFrame()` がローカルフレームであることを理解しているか

---

# 5. Implementation（ClaudeCode 向け）

- [ ] Task をサブタスク化し、実装可能な形に落とし込んだか
- [ ] Diff（何を変えたか）が分かる形で提示されているか
- [ ] Metrics を提示したか
  - レンダリング時間
  - フレーム数
  - エラー数
- [ ] Docs（PLAN / CHANGELOG など）を更新したか
- [ ] 不要な変更・独断の仕様変更をしていないか

---

# 6. Quality Gates

- [ ] `npm run lint` が pass しているか
- [ ] Remotion Studio でエラーなくレンダリングできるか
- [ ] `npx remotion render` が正常完了するか

---

# 7. Git（コミット・ブランチ運用）

- [ ] 不要なコミットを量産していないか
- [ ] 意味のある粒度でコミットをまとめたか
- [ ] コミットメッセージが分かりやすいか（Conventional Commits 推奨）
- [ ] ブランチ命名規則に従っているか
- [ ] main / production へ直接 push していないか

---

# 8. Docs（ドキュメント更新）

- [ ] 今回の作業で影響したファイル・仕様が docs に反映されているか
- [ ] PLAN.md に「なぜこれをやっているか」が整理されたか
- [ ] CHANGELOG.md に変更点を記録したか
- [ ] ドキュメント間で矛盾が発生していないか

---

# 9. Risk（リスク管理）

- [ ] パフォーマンス・UX の観点でリスクが明示されたか
- [ ] レンダリング時間が許容範囲内か
- [ ] 次サイクルで解消すべきリスクが明示されているか

---

# 10. Completion（サイクル完了条件）

- [ ] すべての Quality Gates が pass
- [ ] 必要なドキュメント更新が済んだ
- [ ] 次サイクルのタスクが明確化された
- [ ] ビデオが意図通りにレンダリングされることを確認した
