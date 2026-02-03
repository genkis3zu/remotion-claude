#!/usr/bin/env python3
"""
PSD → PNG 変換スクリプト（口パク対応・改良版）
レイヤーの表示/非表示を切り替えて口パク画像を生成

使用方法:
    python scripts/convert-psd-advanced.py
"""

from psd_tools import PSDImage
from psd_tools.api.layers import Layer, Group
from PIL import Image
import os

# 設定
ASSETS_DIR = r"D:\Dev\remotion-claude\.assets\Character"
OUTPUT_DIR = r"D:\Dev\remotion-claude\testvideo\public\images"

# キャラクター設定
CHARACTERS = {
    "zundamon": {
        "psd": r"ずんだもん立ち絵素材V3.2\ずんだもん立ち絵素材V3.2_基本版.psd",
        "mouth_group": "!口",
        "mouth_open": "*お",      # 開口
        "mouth_close": "*ほほえみ",  # 閉口
    },
    "metan": {
        "psd": r"四国めたん立ち絵素材2.1\四国めたん立ち絵素材2.1.psd",
        "mouth_group": "!口",
        "mouth_open": "*お",
        "mouth_close": "*ほほえみ",
    },
}


def composite_layers_with_mouth(psd, mouth_group_name, target_mouth_name):
    """
    指定した口レイヤーのみを可視にして合成
    """
    canvas = Image.new('RGBA', (psd.width, psd.height), (0, 0, 0, 0))

    def process_layer(layer, depth=0):
        """レイヤーを再帰処理して合成"""
        # 口グループの特別処理
        if layer.name == mouth_group_name and hasattr(layer, '__iter__'):
            # 口グループ内で指定したレイヤーのみを描画
            for sublayer in layer:
                if sublayer.name == target_mouth_name:
                    try:
                        img = sublayer.composite()
                        if img:
                            return img, sublayer.left, sublayer.top
                    except Exception as e:
                        print(f"    Warning: Could not composite {sublayer.name}: {e}")
            return None, 0, 0

        # 非表示レイヤーはスキップ
        if not layer.visible:
            return None, 0, 0

        # ピクセルレイヤー
        if layer.kind == 'pixel':
            try:
                img = layer.composite()
                if img:
                    return img, layer.left, layer.top
            except:
                pass
            return None, 0, 0

        # グループレイヤー
        if hasattr(layer, '__iter__'):
            group_canvas = Image.new('RGBA', (psd.width, psd.height), (0, 0, 0, 0))
            has_content = False

            for sublayer in layer:
                sub_img, sub_left, sub_top = process_layer(sublayer, depth + 1)
                if sub_img:
                    # 座標がキャンバス内に収まるように調整
                    paste_x = max(0, sub_left)
                    paste_y = max(0, sub_top)
                    group_canvas.paste(sub_img, (paste_x, paste_y), sub_img)
                    has_content = True

            if has_content:
                return group_canvas, 0, 0
            return None, 0, 0

        return None, 0, 0

    # 全レイヤーを処理
    for layer in psd:
        img, left, top = process_layer(layer)
        if img:
            canvas.paste(img, (max(0, left), max(0, top)), img)

    return canvas


def generate_images_simple(char_id, config):
    """
    簡易版: デフォルトのcompositeを使用し、口レイヤーだけ別途上書き
    """
    psd_path = os.path.join(ASSETS_DIR, config["psd"])

    if not os.path.exists(psd_path):
        print(f"  ❌ PSD not found: {psd_path}")
        return False

    print(f"  Loading: {config['psd']}")
    psd = PSDImage.open(psd_path)

    output_path = os.path.join(OUTPUT_DIR, char_id)
    os.makedirs(output_path, exist_ok=True)

    # ベース画像（口以外）を合成
    base_image = psd.composite()
    print(f"  Base image: {base_image.width}x{base_image.height}")

    # 口グループを探す
    mouth_group = None
    for layer in psd:
        if layer.name == config["mouth_group"]:
            mouth_group = layer
            break

    if not mouth_group:
        print(f"  ⚠️ Mouth group not found, using default")
        base_image.save(os.path.join(output_path, "mouth_open.png"))
        base_image.save(os.path.join(output_path, "mouth_close.png"))
        return True

    # 口レイヤーを探す
    mouth_open_layer = None
    mouth_close_layer = None

    for sublayer in mouth_group:
        if sublayer.name == config["mouth_open"]:
            mouth_open_layer = sublayer
        if sublayer.name == config["mouth_close"]:
            mouth_close_layer = sublayer

    # 口を開けた画像
    if mouth_open_layer:
        try:
            open_img = base_image.copy()
            mouth_img = mouth_open_layer.composite()
            if mouth_img:
                # 口レイヤーを上書き（位置を調整）
                open_img.paste(mouth_img, (mouth_open_layer.left, mouth_open_layer.top), mouth_img)
            open_img.save(os.path.join(output_path, "mouth_open.png"))
            print(f"    ✅ mouth_open.png (mouth: {config['mouth_open']})")
        except Exception as e:
            print(f"    ⚠️ mouth_open error: {e}, using default")
            base_image.save(os.path.join(output_path, "mouth_open.png"))
    else:
        print(f"    ⚠️ Open mouth layer not found: {config['mouth_open']}")
        base_image.save(os.path.join(output_path, "mouth_open.png"))

    # 口を閉じた画像
    if mouth_close_layer:
        try:
            close_img = base_image.copy()
            mouth_img = mouth_close_layer.composite()
            if mouth_img:
                close_img.paste(mouth_img, (mouth_close_layer.left, mouth_close_layer.top), mouth_img)
            close_img.save(os.path.join(output_path, "mouth_close.png"))
            print(f"    ✅ mouth_close.png (mouth: {config['mouth_close']})")
        except Exception as e:
            print(f"    ⚠️ mouth_close error: {e}, using default")
            base_image.save(os.path.join(output_path, "mouth_close.png"))
    else:
        print(f"    ⚠️ Close mouth layer not found: {config['mouth_close']}")
        base_image.save(os.path.join(output_path, "mouth_close.png"))

    return True


def main():
    print("=" * 50)
    print("PSD → PNG 変換（口パク対応版）")
    print("=" * 50)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for char_id, config in CHARACTERS.items():
        print(f"\n[{char_id}]")
        try:
            generate_images_simple(char_id, config)
        except Exception as e:
            print(f"  ❌ Error: {e}")
            import traceback
            traceback.print_exc()

    print("\n" + "=" * 50)
    print(f"Output: {OUTPUT_DIR}")
    print("=" * 50)


if __name__ == "__main__":
    main()
