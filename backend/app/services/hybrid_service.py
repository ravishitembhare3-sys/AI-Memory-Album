import cv2
import torch
import torch.nn.functional as F

bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)


def orb_score(scan_descriptor, stored_descriptor):
    if scan_descriptor is None or stored_descriptor is None:
        return 0

    matches = bf.match(scan_descriptor, stored_descriptor)
    matches = sorted(matches, key=lambda x: x.distance)

    good = [m for m in matches if m.distance < 35]

    return len(good)


def clip_score(scan_embedding, stored_embedding):
    scan = torch.tensor(scan_embedding)
    stored = torch.tensor(stored_embedding)

    similarity = F.cosine_similarity(
        scan.unsqueeze(0),
        stored.unsqueeze(0)
    )

    return similarity.item()


def hybrid_score(
    orb,
    clip,
    orb_weight=0.6,
    clip_weight=0.4
):
    orb = min(orb / 100.0, 1.0)

    return (
        orb * orb_weight +
        clip * clip_weight
    )