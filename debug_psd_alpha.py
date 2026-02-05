from psd_tools import PSDImage
psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
psd = PSDImage.open(psd_path)
print(f"Channels: {psd.channels}")
print(f"Has Preview: {psd.has_preview}")

# Try to get layer composition
img = psd.composite()
print(f"Composite Mode: {img.mode}")
if img.mode == 'RGBA':
    print(f"Alpha at 0,0: {img.getpixel((0,0))[3]}")
else:
    print("Not RGBA")

# Try layer composite
for layer in psd:
    if layer.visible and layer.name == '*体':
        l_img = layer.composite()
        print(f"Body Layer Mode: {l_img.mode}")
