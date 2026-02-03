#!/usr/bin/env python3
"""
PSD → PNG 変換スクリプト（最終版）
非表示レイヤーも強制的にレンダリングして口パク画像を生成
"""

from psd_tools import PSDImage
from PIL import Image
import os

ASSETS_DIR = r"D:\Dev\remotion-claude\.assets\Character"
OUTPUT_DIR = r"D:\Dev\remotion-claude\testvideo\public\images"

CHARACTERS = {
    "zundamon": {
        "psd": r"ずんだもん立ち絵素材V3.2\ずんだもん立ち絵素材V3.2_基本版.psd",
        "mouth_group": "!口",
        "mouth_open": "*お",
        "mouth_close": "*ほほえみ",
    },
    "metan": {
        "psd": r"四国めたん立ち絵素材2.1\四国めたん立ち絵素材2.1.psd",
        "mouth_group": "!口",
        "mouth_open": "*お",
        "mouth_close": "*ほほえみ",
    },
}


def render_layer_recursive(layer, canvas, skip_group=None, force_layer=None):
    """
    レイヤーを再帰的にレンダリング
    skip_group: このグループ名はスキップ（口グループなど）
    force_layer: (group_name, layer_name) で指定したレイヤーを強制描画
    """
    # スキップ対象グループ
    if skip_group and layer.name == skip_group:
        if force_layer and force_layer[0] == layer.name:
            # このグループ内の特定レイヤーを描画
            for sublayer in layer:
                if sublayer.name == force_layer[1]:
                    try:
                        img = sublayer.topil()
                        if img:
                            canvas.paste(img, (sublayer.left, sublayer.top), img)
                    except:
                        pass
        return

    # 非表示レイヤーはスキップ
    if not layer.visible:
        return

    # グループの場合は再帰処理
    if hasattr(layer, '__iter__'):
        for sublayer in layer:
            render_layer_recursive(sublayer, canvas, skip_group, force_layer)
        return

    # ピクセルレイヤーを描画
    try:
        img = layer.topil()
        if img:
            canvas.paste(img, (layer.left, layer.top), img)
    except:
        pass


def generate_character_images(char_id, config):
    psd_path = os.path.join(ASSETS_DIR, config["psd"])
    if not os.path.exists(psd_path):
        print(f"  ❌ PSD not found: {psd_path}")
        return

    print(f"  Loading: {os.path.basename(config['psd'])}")
    psd = PSDImage.open(psd_path)

    out_dir = os.path.join(OUTPUT_DIR, char_id)
    os.makedirs(out_dir, exist_ok=True)

    # 口を開けた画像
    canvas_open = Image.new('RGBA', (psd.width, psd.height), (0, 0, 0, 0))
    for layer in psd:
        render_layer_recursive(
            layer, canvas_open,
            skip_group=config["mouth_group"],
            force_layer=(config["mouth_group"], config["mouth_open"])
        )
    canvas_open.save(os.path.join(out_dir, "mouth_open.png"))
    print(f"    ✅ mouth_open.png ({config['mouth_open']})")

    # 口を閉じた画像
    canvas_close = Image.new('RGBA', (psd.width, psd.height), (0, 0, 0, 0))
    for layer in psd:
        render_layer_recursive(
            layer, canvas_close,
            skip_group=config["mouth_group"],
            force_layer=(config["mouth_group"], config["mouth_close"])
        )
    canvas_close.save(os.path.join(out_dir, "mouth_close.png"))
    print(f"    ✅ mouth_close.png ({config['mouth_close']})")


def main():
    print("=" * 50)
    print("PSD → PNG 変換（最終版）")
    print("=" * 50)

    for char_id, config in CHARACTERS.items():
        print(f"\n[{char_id}]")
        try:
            generate_character_images(char_id, config)
        except Exception as e:
            print(f"  ❌ Error: {e}")
            import traceback
            traceback.print_exc()

    # 結果確認
    print("\n" + "=" * 50)
    print("Generated files:")
    for char_id in CHARACTERS:
        out_dir = os.path.join(OUTPUT_DIR, char_id)
        if os.path.exists(out_dir):
            for f in os.listdir(out_dir):
                fpath = os.path.join(out_dir, f)
                size = os.path.getsize(fpath)
                print(f"  {char_id}/{f}: {size:,} bytes")

    # 差分確認
    print("\nImage difference check:")
    from PIL import ImageChops
    for char_id in CHARACTERS:
        out_dir = os.path.join(OUTPUT_DIR, char_id)
        open_path = os.path.join(out_dir, "mouth_open.png")
        close_path = os.path.join(out_dir, "mouth_close.png")
        if os.path.exists(open_path) and os.path.exists(close_path):
            open_img = Image.open(open_path)
            close_img = Image.open(close_path)
            diff = ImageChops.difference(open_img, close_img)
            bbox = diff.getbbox()
            if bbox:
                print(f"  {char_id}: ✅ Different (area: {bbox})")
            else:
                print(f"  {char_id}: ⚠️ Identical")


if __name__ == "__main__":
    main()
