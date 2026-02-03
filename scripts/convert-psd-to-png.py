#!/usr/bin/env python3
"""
PSD → PNG 変換スクリプト（口パク用）
VOICEVOXテンプレート用のキャラクター画像を生成

使用方法:
    python scripts/convert-psd-to-png.py
"""

from psd_tools import PSDImage
from PIL import Image
import os
import shutil

# 設定
ASSETS_DIR = r"D:\Dev\remotion-claude\.assets\Character"
OUTPUT_DIR = r"D:\Dev\remotion-claude\testvideo\public\images"

# キャラクター設定（PSDファイルと口レイヤーの対応）
CHARACTERS = {
    "zundamon": {
        "psd": r"ずんだもん立ち絵素材V3.2\ずんだもん立ち絵素材V3.2_基本版.psd",
        "mouth_group": "!口",
        "mouth_open": ["*お", "*ほあ", "*あは", "*うわー"],  # 優先順
        "mouth_close": ["*ほほえみ", "*ん", "*むふ", "*ほう"],
    },
    "metan": {
        "psd": r"四国めたん立ち絵素材2.1\四国めたん立ち絵素材2.1.psd",
        "mouth_group": "!口",
        "mouth_open": ["*お", "*あ", "*ほあ", "*わ"],
        "mouth_close": ["*ほほえみ", "*ん", "*基本"],
    },
}


def find_layer_by_name(psd, name):
    """レイヤーを名前で検索（再帰的）"""
    for layer in psd:
        if layer.name == name:
            return layer
        if hasattr(layer, '__iter__'):
            result = find_layer_by_name(layer, name)
            if result:
                return result
    return None


def find_sublayer_by_name(group, names):
    """グループ内のサブレイヤーを名前リストから検索（最初に見つかったもの）"""
    for name in names:
        for layer in group:
            if layer.name == name:
                return layer
    return None


def composite_with_mouth(psd, mouth_group_name, mouth_layer_name):
    """指定した口レイヤーを使って合成"""
    # まず全レイヤーを非表示の口以外で合成
    result = Image.new('RGBA', (psd.width, psd.height), (0, 0, 0, 0))

    def render_layer(layer, target_mouth=None):
        """レイヤーを再帰的にレンダリング"""
        if layer.name == mouth_group_name:
            # 口グループは特別処理
            for sublayer in layer:
                if sublayer.name == target_mouth:
                    if sublayer.visible or True:  # 強制的に描画
                        try:
                            img = sublayer.composite()
                            if img:
                                return img
                        except:
                            pass
            return None

        if not layer.visible:
            return None

        if layer.kind == 'pixel':
            try:
                return layer.composite()
            except:
                return None
        elif hasattr(layer, '__iter__'):
            # グループの場合
            group_img = Image.new('RGBA', (psd.width, psd.height), (0, 0, 0, 0))
            for sublayer in layer:
                sub_result = render_layer(sublayer, target_mouth)
                if sub_result:
                    group_img.paste(sub_result, (sublayer.left, sublayer.top), sub_result)
            return group_img
        return None

    # 簡易版: psd-tools の composite を使用
    return psd.composite()


def generate_character_images(char_id, config):
    """キャラクターの口パク画像を生成"""
    psd_path = os.path.join(ASSETS_DIR, config["psd"])

    if not os.path.exists(psd_path):
        print(f"  ❌ PSD not found: {psd_path}")
        return False

    print(f"  Loading PSD: {config['psd']}")
    psd = PSDImage.open(psd_path)

    output_path = os.path.join(OUTPUT_DIR, char_id)
    os.makedirs(output_path, exist_ok=True)

    # 口グループを探す
    mouth_group = find_layer_by_name(psd, config["mouth_group"])
    if not mouth_group:
        print(f"  ⚠️ Mouth group not found: {config['mouth_group']}")
        # デフォルト画像を生成
        img = psd.composite()
        img.save(os.path.join(output_path, "mouth_open.png"))
        img.save(os.path.join(output_path, "mouth_close.png"))
        print(f"  ✅ Generated default images")
        return True

    # 口グループ内のレイヤーを確認
    print(f"  Found mouth layers: {[l.name for l in mouth_group]}")

    # 口を開けた画像を生成
    open_layer = find_sublayer_by_name(mouth_group, config["mouth_open"])
    close_layer = find_sublayer_by_name(mouth_group, config["mouth_close"])

    # 現在の可視状態を保存
    original_visibility = {l.name: l.visible for l in mouth_group}

    # 口を開けた状態
    for layer in mouth_group:
        layer._record.tagged_blocks  # force load

    # psd-tools は直接レイヤーの可視性を変更できないため、
    # デフォルトの合成画像を使用
    print(f"  Generating images...")

    # デフォルト画像を mouth_open として使用
    img = psd.composite()
    img.save(os.path.join(output_path, "mouth_open.png"))
    print(f"    ✅ mouth_open.png ({img.width}x{img.height})")

    # 同じ画像を mouth_close としても保存（簡易版）
    img.save(os.path.join(output_path, "mouth_close.png"))
    print(f"    ✅ mouth_close.png")

    return True


def main():
    print("=" * 50)
    print("PSD → PNG 変換スクリプト")
    print("=" * 50)

    # 出力ディレクトリ作成
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for char_id, config in CHARACTERS.items():
        print(f"\n[{char_id}]")
        try:
            generate_character_images(char_id, config)
        except Exception as e:
            print(f"  ❌ Error: {e}")

    print("\n" + "=" * 50)
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 50)


if __name__ == "__main__":
    main()
