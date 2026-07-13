import shutil
import numpy as np

from app.utils.file_handler import generate_filename
from app.services.orb_service import generate_descriptor
from app.services.clip_service import get_embedding
from app.services.storage_service import get_album_folder


def save_photo(photo, user_id: int, album_code: str):

    folders = get_album_folder(user_id, album_code)

    filename = generate_filename(photo.filename)

    filepath = folders["photos"] / filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    # ==========================
    # Generate ORB Descriptor
    # ==========================

    descriptor = generate_descriptor(str(filepath))

    if descriptor is not None:
        np.save(
            folders["embeddings"] / f"{filename}_orb.npy",
            descriptor
        )

    # ==========================
    # Generate CLIP Embedding
    # ==========================

    embedding = get_embedding(str(filepath))

    np.save(
        folders["embeddings"] / f"{filename}_clip.npy",
        embedding
    )

    return filename


def save_video(video, user_id: int, album_code: str):

    folders = get_album_folder(user_id, album_code)

    filename = generate_filename(video.filename)

    filepath = folders["videos"] / filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    return filename