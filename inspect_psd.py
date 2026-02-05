from psd_tools import PSDImage

psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
psd = PSDImage.open(psd_path)

def print_structure(group, indent=0):
    for layer in group:
        print("  " * indent + layer.name)
        if layer.is_group():
            print_structure(layer, indent + 1)

print_structure(psd)
