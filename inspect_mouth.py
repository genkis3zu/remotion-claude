from psd_tools import PSDImage
psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
psd = PSDImage.open(psd_path)

def find_layer(group, name):
    for layer in group:
        if layer.name == name:
            return layer
        if layer.is_group():
             found = find_layer(layer, name)
             if found: return found
    return None

mouth_mun = find_layer(psd, "*むん")
print(f"Mouth Mun: {mouth_mun}, Blend: {mouth_mun.blend_mode}, Opacity: {mouth_mun.opacity}")
# Check size/bbox?
print(f"BBox: {mouth_mun.bbox}")

mouth_yi = find_layer(psd, "*いー")
print(f"Mouth Yi: {mouth_yi}, Blend: {mouth_yi.blend_mode}, Opacity: {mouth_yi.opacity}")
print(f"BBox: {mouth_yi.bbox}")
