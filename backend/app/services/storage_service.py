from pathlib import Path
import shutil
import os
import stat

UPLOAD_ROOT = Path("app/uploads")


def get_album_folder(user_id: int, album_code: str):

    album_folder = (
        UPLOAD_ROOT
        / f"user_{user_id}"
        / f"album_{album_code}"
    )

    photos = album_folder / "photos"
    videos = album_folder / "videos"
    embeddings = album_folder / "embeddings"

    photos.mkdir(parents=True, exist_ok=True)
    videos.mkdir(parents=True, exist_ok=True)
    embeddings.mkdir(parents=True, exist_ok=True)

    return {
        "base": album_folder,
        "photos": photos,
        "videos": videos,
        "embeddings": embeddings,
    }


def delete_memory_files(
    user_id: int,
    album_code: str,
    photo_name: str,
    video_name: str,
):

    folders = get_album_folder(user_id, album_code)

    files = [
        folders["photos"] / photo_name,
        folders["videos"] / video_name,
        folders["embeddings"] / f"{photo_name}_orb.npy",
        folders["embeddings"] / f"{photo_name}_clip.npy",
    ]

    for file in files:
        if file.exists():
            file.unlink()



def remove_readonly(func, path, excinfo):
    os.chmod(path, stat.S_IWRITE)
    func(path)


def delete_album_folder(
    user_id: int,
    album_code: str,
):

    album_folder = (
        UPLOAD_ROOT
        / f"user_{user_id}"
        / f"album_{album_code}"
    )

    if album_folder.exists():
        shutil.rmtree(album_folder, onerror=remove_readonly)