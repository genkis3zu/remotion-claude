from psd_tools import PSDImage
from psd_tools.constants import BlendMode

psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
psd = PSDImage.open(psd_path)

def inspect_cheek(group):
    for layer in group:
        if layer.name == "!ほっぺ":
            print(f"Group: {layer.name}, Visible: {layer.visible}, Blend: {layer.blend_mode}, Opacity: {layer.opacity}")
            for child in layer:
                print(f"  Layer: {child.name}, Visible: {child.visible}, Blend: {child.blend_mode}, Opacity: {child.opacity}")

inspect_cheek(psd)
