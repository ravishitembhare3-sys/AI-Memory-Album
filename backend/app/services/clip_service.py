from PIL import Image
from transformers import AutoProcessor, CLIPModel
import torch
import torch.nn.functional as F
import numpy as np

device = "cuda" if torch.cuda.is_available() else "cpu"

processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
model.eval()


def get_embedding(image_path):
    image = Image.open(image_path).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model.get_image_features(**inputs)

        # New transformers versions may return a BaseModelOutputWithPooling
        if hasattr(outputs, "pooler_output"):
            embedding = outputs.pooler_output
        elif hasattr(outputs, "image_embeds"):
            embedding = outputs.image_embeds
        else:
            embedding = outputs

    embedding = F.normalize(embedding, p=2, dim=1)

    return embedding.squeeze(0).cpu().numpy().astype(np.float32)