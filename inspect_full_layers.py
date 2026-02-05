from psd_tools import PSDImage

psd_path = r"d:\Dev\remotion-claude\examples\春日部つむぎ立ち絵素材\春日部つむぎ立ち絵素材.psd"
psd = PSDImage.open(psd_path)

def list_layers(group):
    for layer in group:
        if layer.name == "口":
            print("--- Mouth Layers ---")
            for child in layer:
                 print(child.name)
        if layer.name == "目":
            print("--- Eye Layers ---")
            for child in layer:
                print(child.name)
                if child.is_group():
                    for grandchild in child:
                        print(f"  {grandchild.name}")
        if layer.name == "まゆ":
            print("--- Brow Layers ---")
            for child in layer:
                print(child.name)

list_layers(psd)
