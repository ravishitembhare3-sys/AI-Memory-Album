import os
import cv2
import numpy as np

from app.services.orb_service import generate_descriptor
from app.services.clip_service import get_embedding
from app.services.hybrid_service import (
    orb_score,
    clip_score,
    hybrid_score,
)

def find_best_match(scan_image_path, embedding_folder):

    scan_descriptor = generate_descriptor(scan_image_path)
    scan_embedding = get_embedding(scan_image_path)

    best_image = None
    best_score = -1


    for file in os.listdir(embedding_folder):

        if not file.endswith("_clip.npy"):
            continue

        image_name = file.replace("_clip.npy", "")

        clip_path = os.path.join(
            embedding_folder,
            f"{image_name}_clip.npy"
        )

        orb_path = os.path.join(
            embedding_folder,
            f"{image_name}_orb.npy"
        )


        stored_clip = np.load(clip_path)


        if os.path.exists(orb_path):
            stored_orb = np.load(orb_path)
        else:
            stored_orb = None


        orb = orb_score(
            scan_descriptor,
            stored_orb
        )


        clip = clip_score(
            scan_embedding,
            stored_clip
        )


        score = hybrid_score(
            orb,
            clip
        )


        print(
            image_name,
            "ORB:",
            orb,
            "CLIP:",
            clip,
            "HYBRID:",
            score
        )


        if score > best_score:
            best_score = score
            best_image = image_name


    return best_image, best_score