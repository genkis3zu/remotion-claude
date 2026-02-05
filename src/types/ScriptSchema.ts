import { z } from "zod";

export const ScriptItemSchema = z.object({
    character: z.enum(["zundamon", "metan", "tsumugi"]),
    emotion: z.enum(["normal", "happy", "angry", "sad", "surprised"]),
    text: z.string(),
    durationSec: z.number(), // 文字数から概算、またはVoicevox生成時に確定
});

export const ChapterSchema = z.object({
    title: z.string(),
    items: z.array(ScriptItemSchema),
});

export type Chapter = z.infer<typeof ChapterSchema>;
export type ScriptItem = z.infer<typeof ScriptItemSchema>;
