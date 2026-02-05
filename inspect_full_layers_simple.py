from psd_tools import PSDImage

psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
print(f"Loading {psd_path}...")
psd = PSDImage.open(psd_path)

def print_layers(layer, indent=0):
    print("  " * indent + layer.name)
    if layer.is_group():
        for child in layer:
            print_layers(child, indent + 1)

print("--- Printing All Layers ---")
for layer in psd:
    print_layers(layer)
