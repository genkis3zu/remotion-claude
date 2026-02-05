
import json
import os

# Output path
OUTPUT_PATH = "src/data/full_script.json"

# Schema structure helpers
def create_item(character, text, emotion, duration, layout, active_speaker, thought_process, background_prompt=None, insert_image_prompt=None, highlight_words=None):
    item = {
        "character": character,
        "text": text,
        "emotion": emotion,
        "durationSec": duration,
        "layout": layout,
        "activeSpeaker": active_speaker,
        "thoughtProcess": thought_process
    }
    if background_prompt:
        item["backgroundPrompt"] = background_prompt
    if insert_image_prompt:
        item["insertImagePrompt"] = insert_image_prompt
    if highlight_words:
        item["highlightWords"] = highlight_words
    return item

def create_chapter(title, mood, segment, items, visual_style="default"):
    return {
        "title": title,
        "mood": mood,
        "segment": segment,
        "visualStyle": visual_style,
        "items": items
    }

# Standard Layouts
LAYOUT_ZM = {"left": "zundamon", "center": "none", "right": "metan"}
LAYOUT_ZMT = {"left": "zundamon", "center": "tsumugi", "right": "metan"}
LAYOUT_T_ONLY = {"left": "none", "center": "tsumugi", "right": "none"}

# --- SCRIPT CONTENT ---

chapters = []

# 1. HOOK (0-45s)
items_hook = []
items_hook.append(create_item(
    "zundamon", 
    "みんな聞いてくれなのだ！ブラックホールに落ちるとスパゲッティになれるらしいのだ！", 
    "happy", 5.0, LAYOUT_ZM, "zundamon",
    "スパゲッティ＝美味しい、という短絡的な思考で、ブラックホールに行けば食べ放題だと勘違いして興奮している。",
    background_prompt="宇宙のブラックホール, 4k, 渦巻く光, ダーク",
    highlight_words=["スパゲッティ", "ブラックホール"]
))
items_hook.append(create_item(
    "metan", 
    "…それは『スパゲッティ化現象』のことかしら。体が引き延ばされて死ぬのよ。", 
    "normal", 4.0, LAYOUT_ZM, "metan",
    "ずんだもんの無知に呆れつつ、冷静に事実（死）を突きつけている。哀れみを含む。",
    insert_image_prompt="ブラックホールに吸い込まれて細長く引き伸ばされる宇宙飛行士のイラスト, 科学的図解"
))
items_hook.append(create_item(
    "zundamon", 
    "えええ！？死ぬのは嫌なのだ！ボクはただ美味しいパスタになりたかっただけなのだ！", 
    "surprised", 5.0, LAYOUT_ZM, "zundamon",
    "死ぬと聞いて驚愕し、自分の食い意地が招いた危機（妄想）に動揺している。",
    highlight_words=["死ぬ", "嫌なのだ"]
))
items_hook.append(create_item(
    "tsumugi", 
    "あはは！ずんだもんはそのままでも枝豆ペーストじゃん！とりあえず今日は宇宙と日常のヤバい雑学、いってみよー！埼玉！", 
    "happy", 6.0, LAYOUT_ZMT, "tsumugi",
    "場の空気を明るくするためにツッコミを入れつつ、勢いよくタイトルコールへ繋げている。",
    background_prompt="明るいスタジオセット, ポップ, 放送局風",
    highlight_words=["宇宙", "日常", "雑学"]
))

chapters.append(create_chapter("Hook", "energetic", "hook", items_hook, "default"))


# 2. INTRO (45s - 1m30s)
items_intro = []
items_intro.append(create_item(
    "metan",
    "今回は『宇宙の果て』から『日常の隙間』まで、アナタの脳みそを刺激する選りすぐりの雑学を紹介するわよ。",
    "smug", 6.0, LAYOUT_ZMT, "metan",
    "解説役としての自信と余裕を見せている。視聴者の知的好奇心を煽る。",
    background_prompt="宇宙と日常風景がコラージュされた背景, ミステリアスかつポップ"
))
items_intro.append(create_item(
    "zundamon",
    "脳みそを刺激されるのは怖いけど、賢くなればお小遣いアップなのだ？",
    "normal", 5.0, LAYOUT_ZMT, "zundamon",
    "知識への興味はなく、打算（金）だけで動こうとしている。"
))
items_intro.append(create_item(
    "tsumugi",
    "ずんだもん、世の中そんなに甘くないし。でも、今日のネタは明日学校や職場で話せるやつばっかだし、最後まで見ないと損する埼玉！",
    "happy", 6.0, LAYOUT_ZMT, "tsumugi", 
    "視聴者に対して『見ないと損』という損失回避性を刺激しつつ、親しみやすくアピール。"
))

chapters.append(create_chapter("Intro", "energetic", "intro", items_intro))


# 3. BODY 1 (1m30s - 3m30s)
items_body1 = []
items_body1.append(create_item(
    "zundamon",
    "まずは宇宙の話なのだ。宇宙って無重力だから、フワフワして楽しそうなのだ。",
    "happy", 5.0, LAYOUT_ZM, "zundamon",
    "宇宙への憧れ。平和なイメージ。",
    background_prompt="国際宇宙ステーションから見た地球, 4k, 美しい"
))
items_body1.append(create_item(
    "metan",
    "優雅に見えるけど、実は『宇宙に行くと焼けたステーキの匂いがする』って知ってた？",
    "normal", 5.0, LAYOUT_ZM, "metan",
    "意外な事実を投げかけて興味を惹く。",
    highlight_words=["焼けたステーキ", "匂い"]
))
items_body1.append(create_item(
    "zundamon",
    "ステーキ！？宇宙人はBBQ好きなのだ！？ボクも混ぜてほしいのだ！",
    "surprised", 5.0, LAYOUT_ZM, "zundamon",
    "食べ物の話題に即座に反応し、宇宙人＝BBQ仲間という謎の解釈をしている。",
    background_prompt="宇宙空間でBBQをする宇宙人のイラスト, コミカル"
))
items_body1.append(create_item(
    "metan",
    "違うわよ。船外活動から戻った宇宙服から、金属の溶接や焼けた肉のような匂いがするの。多環芳香族炭化水素などが原因と言われているわ。",
    "normal", 8.0, LAYOUT_ZM, "metan",
    "科学的な根拠をさらっと解説して知識を披露。",
    insert_image_prompt="宇宙飛行士が船外活動をしている写真, リアル, 高解像度"
))
items_body1.append(create_item(
    "tsumugi",
    "へー！なんか意外！あーしは宇宙に行くと身長が伸びるって聞いたことあるけど？",
    "happy", 6.0, LAYOUT_ZMT, "tsumugi",
    "話題を転換しつつ、自分の知識を確認している。",
    background_prompt="宇宙空間に浮遊する人体図, 背骨が伸びる様子",
    # Fixed argument duplication (removed active_speaker kwarg)
))
items_body1.append(create_item(
    "metan",
    "正解よ。重力がないから背骨の椎間板が広がって、身長が数センチ伸びるの。でも地球に帰ると元に戻るわ。",
    "normal", 7.0, LAYOUT_ZMT, "metan",
    "肯定しつつ、オチ（元に戻る）をつけて現実を教える。",
    insert_image_prompt="背骨の椎間板が広がる様子の図解, 医療系イラスト"
))
items_body1.append(create_item(
    "zundamon",
    "ぬぬっ！ボクも宇宙に行けば高身長イケメンになれるチャンスがあったのに、戻っちゃうなんて詐欺なのだ…",
    "sad", 6.0, LAYOUT_ZMT, "zundamon",
    "身長コンプレックスが刺激され、ぬか喜びに終わったことに落胆している。"
))
items_body1.append(create_item(
    "metan",
    "最後は少し怖い話。太陽にも寿命があるの。約50億年後には膨張して『赤色巨星』になり、地球を飲み込むかもしれないわ。",
    "serious", 8.0, LAYOUT_ZM, "metan",
    "声のトーンを落とし、スケールの大きな恐怖を演出。",
    background_prompt="赤色巨星と化した巨大な太陽が地球に迫る様子, 終末的, 4k",
    highlight_words=["50億年後", "赤色巨星", "地球を飲み込む"]
))
items_body1.append(create_item(
    "zundamon",
    "ご、50億年後！？明日の宿題とか悩んでる場合じゃないのだ！今すぐ全財産でお菓子を買ってくるのだ！",
    "surprised", 7.0, LAYOUT_ZM, "zundamon",
    "遠い未来の話を自分事として捉え、極端な行動（現実現実逃避）に走ろうとしている（パニック）。"
))

chapters.append(create_chapter("Body1_Space", "mysterious", "body_main", items_body1, "default"))


# 4. BREAK 1 (3m30s - 4m00s)
items_break1 = []
items_break1.append(create_item(
    "tsumugi",
    "はいはーい！ここで『つむぎの素朴なギモン』のコーナー！",
    "happy", 4.0, LAYOUT_T_ONLY, "tsumugi",
    "画面を独占し、明るくコーナー転換。",
    background_prompt="パステルカラーの可愛い部屋, 配信画面風",
    highlight_words=["つむぎの", "素朴なギモン"]
))
items_break1.append(create_item(
    "tsumugi",
    "宇宙ってさ、太陽があるのになんで暗いの？昼間の空みたいに明るくないの不思議じゃない？",
    "normal", 6.0, LAYOUT_T_ONLY, "tsumugi",
    "視聴者が一度は思ったことがありそうな疑問を代弁する。",
    insert_image_prompt="宇宙空間に太陽が輝いているが背景は真っ暗な写真"
))
items_break1.append(create_item(
    "metan",
    "（声のみ）それはね、光を散乱させる『空気』がないからよ。地球の空が青いのは空気が太陽光を散らしているから。宇宙はスカスカだからね。",
    "normal", 8.0, LAYOUT_T_ONLY, "metan",
    "画面外からの天の声として解説。優しく教えるトーン。"
))
items_break1.append(create_item(
    "tsumugi",
    "なるほど〜！空気読めないやつじゃなくて、空気がないやつだったんだね！スッキリ埼玉！",
    "happy", 6.0, LAYOUT_T_ONLY, "tsumugi",
    "納得しつつ、独特な言い回しで締める。",
    highlight_words=["スッキリ埼玉"]
))

chapters.append(create_chapter("Break1_Tsumugi", "relaxing", "break", items_break1))


# 5. BODY 2 (4m00s - 6m30s)
items_body2 = []
items_body2.append(create_item(
    "zundamon",
    "宇宙の話は怖かったから、もっと身近な話がいいのだ。ガムでも噛んで落ち着くのだ。",
    "normal", 6.0, LAYOUT_ZM, "zundamon",
    "話題を日常に戻す。リラックスしようとしている。",
    background_prompt="カフェのテラス席, 温かいイラスト調"
))
items_body2.append(create_item(
    "metan",
    "あら偶然。実は『ガムを噛むと集中力がアップする』って研究結果があるのよ。スポーツ選手が噛んでいるのもそのためね。",
    "normal", 7.0, LAYOUT_ZM, "metan",
    "ずんだもんの行動を肯定しつつ、知識を被せる。",
    insert_image_prompt="ガムを噛んで集中している野球選手のイラスト"
))
items_body2.append(create_item(
    "tsumugi",
    "集中したい時はコーヒーもいいよね！匂いだけでリラックス効果あるっていうし。",
    "happy", 5.0, LAYOUT_ZMT, "tsumugi",
    "関連話題（リラックス/集中）を提示。",
    insert_image_prompt="湯気の立つコーヒーカップの温かいイラスト"
))
items_body2.append(create_item(
    "metan",
    "そうね。コーヒー豆の香りには脳のアルファ波を増やす効果があるわ。飲む前から効果があるなんてお得よね。",
    "normal", 6.0, LAYOUT_ZMT, "metan",
    "つむぎの知識を補強。",
    highlight_words=["アルファ波", "リラックス"]
))
items_body2.append(create_item(
    "zundamon",
    "へぇ〜。じゃあボクも、毎日ベッドメイキングしてから二度寝すれば成功者になれるのだ？",
    "smug", 6.0, LAYOUT_ZMT, "zundamon",
    "『ベッドメイキング＝成功の習慣』という知識を曲解し、二度寝を正当化しようとしている。",
    background_prompt="豪華なベッドで眠るずんだもんのイラスト"
))
items_body2.append(create_item(
    "metan",
    "二度寝したら意味ないでしょ！でも『ベッドメイキングをする人は年収が高い傾向がある』というのは本当よ。小さな達成感が自信に繋がるの。",
    "angry", 7.0, LAYOUT_ZMT, "metan",
    "前半は強めのツッコミ、後半は解説。感情の切り替え。"
))
items_body2.append(create_item(
    "zundamon",
    "ふん！ボクはドアをバターン！って閉める音で、みんなにボクの存在感をアピールしてるから自信満々なのだ！",
    "smug", 7.0, LAYOUT_ZMT, "zundamon",
    "さらに間違った方向（ドアをうるさく閉める）で自信を示そうとする迷惑行為。"
))
items_body2.append(create_item(
    "metan",
    "それは逆効果よ。ドアを乱暴に閉める人は、実は『自己顕示欲』が強くて『精神的に不安定』な傾向があるの。静かに閉める人の方が信頼されるわよ。",
    "normal", 8.0, LAYOUT_ZMT, "metan",
    "心理学的観点からずんだもんをバッサリ論破。",
    highlight_words=["自己顕示欲", "精神的に不安定"]
))

chapters.append(create_chapter("Body2_Daily", "playful", "body_main", items_body2))


# 6. BREAK 2 (6m30s - 7m00s)
items_break2 = []
items_break2.append(create_item(
    "zundamon",
    "うわあああ！ボクは不安定じゃないのだ！ボクは神なのだ！崇めるのだー！！（暴走）",
    "angry", 5.0, LAYOUT_ZM, "zundamon",
    "図星を突かれて逆ギレし、暴れ回って誤魔化そうとしている。",
    background_prompt="集中線が走る漫画風の背景, 混沌",
    highlight_words=["うわあああ！", "神なのだ！"]
))
items_break2.append(create_item(
    "metan",
    "うるさいわね…（ボスッ）",
    "normal", 3.0, LAYOUT_ZM, "metan",
    "冷静に物理攻撃（ハリセン等）を加える音。",
    insert_image_prompt="ハリセンで叩かれるずんだもんのコミカルなイラスト"
))
items_break2.append(create_item(
    "zundamon",
    "あべしっ！！",
    "surprised", 2.0, LAYOUT_ZM, "zundamon",
    "やられた声。"
))
items_break2.append(create_item(
    "tsumugi",
    "…はい、ということでね。ずんだもんが星になったところで、最後はまた宇宙の深い話に戻りまーす。",
    "happy", 6.0, LAYOUT_ZMT, "tsumugi",
    "カオスな状況をスルーして、淡々と進行に戻す。ドライな対応。"
))

chapters.append(create_chapter("Break2_Chaos", "energetic", "break", items_break2))


# 7. BODY 3 (7m00s - 9m00s)
items_body3 = []
items_body3.append(create_item(
    "metan",
    "気を取り直して。宇宙には『絶対零度』に近い場所があるの。ブーメラン星雲はマイナス272℃よ。",
    "serious", 7.0, LAYOUT_ZM, "metan",
    "真面目なトーンに戻り、極限の世界を解説。",
    background_prompt="ブーメラン星雲の実際の画像またはリアルな再現, 青白く輝く, 4k",
    highlight_words=["マイナス272℃", "ブーメラン星雲"]
))
items_body3.append(create_item(
    "zundamon",
    "ひえぇ…冷凍庫より寒いのだ。バナナで釘が打てるどころか、ボクが釘になっちゃうのだ。",
    "sad", 6.0, LAYOUT_ZM, "zundamon",
    "寒さを想像して震えている。"
))
items_body3.append(create_item(
    "metan",
    "次は山ね。火星にある『オリンポス山』は標高約25,000メートル。エベレストの3倍近くある太陽系最大の山よ。",
    "normal", 7.0, LAYOUT_ZM, "metan",
    "スケールの大きさを強調。",
    insert_image_prompt="火星のオリンポス山とエベレストの比較図, リアル"
))
items_body3.append(create_item(
    "tsumugi",
    "デカすぎ！登るのに何日かかるんだろ…てか、火星って1日は何時間なの？",
    "surprised", 5.0, LAYOUT_ZMT, "tsumugi",
    "素朴な疑問を投げかける。",
    # Fixed argument duplication (removed active_speaker kwarg)
))
items_body3.append(create_item(
    "metan",
    "いい質問ね。火星の1日は『24時間40分』。地球とほぼ同じなのよ。だから将来、人類が移住しやすいと言われているの。",
    "happy", 7.0, LAYOUT_ZMT, "metan",
    "的確な質問を褒めつつ解説。",
    highlight_words=["24時間40分", "移住"]
))
items_body3.append(create_item(
    "metan",
    "最後は『孤独な惑星（ローグ・プラネット）』の話。どの恒星系にも属さず、暗闇の宇宙を永遠に一人で彷徨う惑星があるの。",
    "serious", 8.0, LAYOUT_ZM, "metan",
    "少し詩的で哀愁漂うトーン。孤独さを強調。",
    background_prompt="恒星のない真っ暗な宇宙に浮かぶ孤立した惑星, 寂しい, 4k",
    highlight_words=["孤独な惑星", "ローグ・プラネット"]
))
items_body3.append(create_item(
    "zundamon",
    "ず〜っとひとりぼっちなのだ…？それは、いくらボクでも寂しくて泣いちゃうのだ…。",
    "sad", 6.0, LAYOUT_ZM, "zundamon",
    "孤独な惑星に感情移入してしんみりしている。"
))
items_body3.append(create_item(
    "tsumugi",
    "でもさ、誰にも縛られずに自由ってことじゃん？ちょっと憧れるかも。",
    "normal", 5.0, LAYOUT_ZMT, "tsumugi",
    "別の視点（自由）を提示して、重くなりすぎないようにする。"
))

chapters.append(create_chapter("Body3_Deep", "serious", "body_main", items_body3))


# 8. OUTRO (9m00s - 10m00s)
items_outro = []
items_outro.append(create_item(
    "metan",
    "さて、今日の雑学の旅はどうだったかしら？宇宙の果てからベッドルームまで、世界は不思議で満ちているわね。",
    "happy", 6.0, LAYOUT_ZMT, "metan",
    "エンディングの挨拶。穏やかな笑顔。",
    background_prompt="美しい星空と都市の夜景が融合した背景, 感動的"
))
items_outro.append(create_item(
    "zundamon",
    "ボクはやっぱり、温かいベッドで寝て、美味しいものを食べる日常が最高なのだ。",
    "happy", 5.0, LAYOUT_ZMT, "zundamon",
    "非日常（宇宙）を知ったからこそ、日常の幸せを再確認している。"
))
items_outro.append(create_item(
    "tsumugi",
    "だね！みんなの感想もコメントで教えてね！チャンネル登録と高評価もしないと、ずんだもんが夜中にドアガチャするよ！埼玉！",
    "happy", 7.0, LAYOUT_ZMT, "tsumugi",
    "視聴者へのアクション喚起。少し脅しを入れつつジョークにする。",
    highlight_words=["チャンネル登録", "高評価", "ドアガチャ"]
))
items_outro.append(create_item(
    "zundamon",
    "しないのだ！…でも、登録してくれたら夢に出てあげてもいいのだ！それじゃあ、また次回なのだ！",
    "smug", 6.0, LAYOUT_ZMT, "zundamon",
    "ツンデレな挨拶で締める。",
    highlight_words=["また次回"]
))

chapters.append(create_chapter("Outro", "relaxing", "outro", items_outro))


# Save to file
with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
    json.dump(chapters, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {OUTPUT_PATH}")
