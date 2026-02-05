import { z } from "zod";

// キャラクターの定義
export const CharacterSchema = z.enum(["zundamon", "metan", "tsumugi"]);
export type Character = z.infer<typeof CharacterSchema>;

// 感情の定義（立ち絵の差分用）
export const EmotionSchema = z.enum(["normal", "happy", "angry", "sad", "surprised", "smug", "serious"]);
export type Emotion = z.infer<typeof EmotionSchema>;

// キャラクターID
export const CharIdSchema = z.enum(["zundamon", "metan", "tsumugi", "none"]);
export type CharId = z.infer<typeof CharIdSchema>;

// 画面上のポジション定義
export const LayoutSchema = z.object({
    left: CharIdSchema,   // 画面左側に誰がいるか
    center: CharIdSchema, // 画面中央に誰がいるか
    right: CharIdSchema,  // 画面右側に誰がいるか
});
export type Layout = z.infer<typeof LayoutSchema>;

// 台本1行の定義
export const DialogueItemSchema = z.object({
    character: CharacterSchema,
    text: z.string().describe("キャラクターが話すセリフ。ずんだもんは語尾に『のだ』をつけること。"),
    thoughtProcess: z.string().describe("なぜその感情を選んだのかの理由。'死'や'危険'の話題ならsad/fear、'成功'や'自慢'ならhappy/smugなど、文脈と言語的トーンを分析して記述する。"),
    emotion: EmotionSchema,

    // 背景画像の指定
    backgroundPrompt: z.string().optional()
        .describe("シーンの雰囲気に合わせた背景画像の生成プロンプト（例：'深海の神秘的な青いグラデーション, 4k, 抽象的'）"),
    backgroundImage: z.string().optional()
        .describe("生成された背景画像のパス（例：'/assets/bg/scene_001_bg.png'）"),

    // 挿入画像（雑学の証拠画像など）の指定
    insertImagePrompt: z.string().optional()
        .describe("解説内容を補足する具体的な画像の生成プロンプト（例：'ロブスターが脱皮する様子の科学的なイラスト, 詳細'）。Google検索のグラウンディングが必要な場合はその旨を含めること。"),
    insertImage: z.string().optional()
        .describe("生成された挿入画像のパス（例：'/assets/inserts/scene_001_insert.png'）"),

    durationSec: z.number().describe("このセリフを読み上げるのにかかるおおよその秒数"),
    layout: LayoutSchema.describe("このセリフの時点でのキャラクター配置"),
    activeSpeaker: CharIdSchema.describe("現在話しているキャラクター（強調表示用）"),
    highlightWords: z.array(z.string()).optional().describe("強調表示するキーワード（キネティック・タイポグラフィ用）"),
});
export type DialogueItem = z.infer<typeof DialogueItemSchema>;

// 動画全体の台本データ
export const ScriptSchema = z.array(DialogueItemSchema);
export type Script = z.infer<typeof ScriptSchema>;

// BGMのムード定義（AIが選べる選択肢）
export const MoodSchema = z.enum([
    "playful",   // 楽しい、ずんだもんのボケなど
    "serious",   // シリアス、重要な事実解説
    "mysterious",// 不思議、宇宙ネタなど
    "relaxing",  // リラックス、エンディングなど
    "energetic"  // エネルギッシュ、オープニング
]);
export type Mood = z.infer<typeof MoodSchema>;


// 構成セクションの定義 (10分動画の黄金比率用)
export const SectionTypeSchema = z.enum([
    'hook',       // 0-30s: 強い掴み
    'intro',      // 30-60s: 導入
    'body_main',  // 本編 (2.5分)
    'break',      // ブレイク (30s)
    'outro'       // 結び
]);
export type SectionType = z.infer<typeof SectionTypeSchema>;

// ビジュアル強度の定義
export type VisualIntensity = 'low' | 'medium' | 'high';

// 構成ルール（AIに守らせるガイドライン）
export const StructureRules = {
    totalDuration: 600, // 10分
    sections: [
        { type: 'hook' as const, duration: 30, visualIntensity: 'high' as const },
        { type: 'intro' as const, duration: 30, visualIntensity: 'medium' as const },
        { type: 'body_main' as const, duration: 150, visualIntensity: 'medium' as const }, // Body 1 (1:00-3:30)
        { type: 'break' as const, duration: 30, visualIntensity: 'low' as const },         // Reset (3:30-4:00)
        { type: 'body_main' as const, duration: 150, visualIntensity: 'medium' as const }, // Body 2 (4:00-6:30)
        { type: 'break' as const, duration: 30, visualIntensity: 'low' as const },         // Reset (6:30-7:00)
        { type: 'body_main' as const, duration: 120, visualIntensity: 'medium' as const }, // Body 3 (7:00-9:00)
        { type: 'outro' as const, duration: 60, visualIntensity: 'high' as const }         // Outro (9:00-10:00)
    ]
};

// 構成セグメントの定義 (Legacy support, mapped to SectionType)
export const SegmentSchema = z.enum([
    "hook",
    "tempo",   // -> body_main
    "break",
    "deep_dive"// -> body_main
]);
export type Segment = z.infer<typeof SegmentSchema>;

export const VisualStyleSchema = z.enum(['default', 'split', 'bento']);
export type VisualStyle = z.infer<typeof VisualStyleSchema>;

export const BentoItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(), // Text content for now
    colSpan: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
    rowSpan: z.union([z.literal(1), z.literal(2)]).optional(),
});

export const VisualContentSchema = z.object({
    imageUrl: z.string().optional(),
    bentoItems: z.array(BentoItemSchema).optional(),
});
export type VisualContent = z.infer<typeof VisualContentSchema>;

export const ChapterSchema = z.object({
    title: z.string(),
    mood: MoodSchema.describe("このチャプターの雰囲気に合ったBGMタイプ"),
    segment: SectionTypeSchema.optional().describe("このチャプターの役割（構成セグメント）"),
    visualStyle: VisualStyleSchema.optional().describe("画面レイアウト (default/split/bento)"),
    visualContent: VisualContentSchema.optional().describe("レイアウト用の追加コンテンツ"),
    items: z.array(DialogueItemSchema),
});
export type Chapter = z.infer<typeof ChapterSchema>;

