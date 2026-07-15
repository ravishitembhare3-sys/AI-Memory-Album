import shutil
from app.services.storage_service import get_album_folder
import os

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from app.services.storage_service import (
    get_album_folder,
    delete_memory_files
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.memory import Memory
from app.models.album import Album
from app.services.upload_service import save_photo, save_video
from app.services.scan_service import find_best_match
from app.utils.file_handler import is_image, is_video
from app.utils.auth_dependency import get_current_user

router = APIRouter()


# ==========================
# Upload Memory
# ==========================

@router.post("/upload")
async def upload_memory(
    album_id: int = Form(...),
    title: str = Form(...),
    photo: UploadFile = File(...),
    video: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    album = db.query(Album).filter(
        Album.id == album_id,
        Album.user_id == current_user["user_id"]
    ).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail="Album not found"
        )

    if not is_image(photo.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid image"
        )

    if not is_video(video.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid video"
        )

    photo_name = save_photo(
        photo,
        current_user["user_id"],
        album.album_code
    )

    video_name = save_video(
        video,
        current_user["user_id"],
        album.album_code
    )

    memory = Memory(
        album_id=album.id,
        title=title,
        photo=photo_name,
        video=video_name,
    )

    db.add(memory)
    db.commit()
    db.refresh(memory)

    return {
        "message": "Memory uploaded successfully",
        "memory_id": memory.id,
        "album_id": memory.album_id,
        "photo": memory.photo,
        "video": memory.video,
    }


# ==========================
# Get All Memories
# ==========================

@router.get("/memories")
def get_memories(db: Session = Depends(get_db)):
    return db.query(Memory).all()


# ==========================
# Get Album Memories
# ==========================

@router.get("/album/{album_id}")
def get_album_memories(
    album_id: int,
    db: Session = Depends(get_db)
):

    album = db.query(Album).filter(
        Album.id == album_id
    ).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail="Album not found"
        )

    memories = db.query(Memory).filter(
        Memory.album_id == album_id
    ).all()

    result = []

    for memory in memories:

        result.append({
            "id": memory.id,
            "title": memory.title,

            "photo":
            f"http://127.0.0.1:8000/uploads/"
            f"user_{album.user_id}/"
            f"album_{album.album_code}/"
            f"photos/{memory.photo}",

            "video":
            f"http://127.0.0.1:8000/uploads/"
            f"user_{album.user_id}/"
            f"album_{album.album_code}/"
            f"videos/{memory.video}"
        })

    return result


# ==========================
# Delete Memory
# ==========================

@router.delete("/memory/{memory_id}")
def delete_memory(
    memory_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    memory = db.query(Memory).filter(
        Memory.id == memory_id
    ).first()

    if memory is None:
        raise HTTPException(
            status_code=404,
            detail="Memory not found"
        )

    album = db.query(Album).filter(
        Album.id == memory.album_id
    ).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail="Album not found"
        )

    if album.user_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # Delete all files
    delete_memory_files(
        user_id=album.user_id,
        album_code=album.album_code,
        photo_name=memory.photo,
        video_name=memory.video
    )

    # Delete database record
    db.delete(memory)
    db.commit()

    return {
        "success": True,
        "message": "Memory deleted successfully",
        "deleted_memory_id": memory.id
    }

# ==========================
# Scan Memory (Hybrid AI)
# ==========================

@router.post("/scan/{album_code}")
async def scan_memory(
    album_code: str,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    album = db.query(Album).filter(
        Album.album_code == album_code
    ).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail="Album not found"
        )

    temp_path = f"app/uploads/{photo.filename}"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(photo.file, buffer)

    folders = get_album_folder(
        album.user_id,
        album.album_code
    )

    best_image, score = find_best_match(
        temp_path,
        str(folders["embeddings"])
    )

    print("BEST IMAGE:", best_image)

    all_memories = db.query(Memory).filter(
    Memory.album_id == album.id
    ).all()

    for m in all_memories:
     print("DB PHOTO:", m.photo)

    if best_image is None:
        raise HTTPException(
            status_code=404,
            detail="No matching memory found"
        )
    

    memory = db.query(Memory).filter(
        Memory.photo == best_image,
        Memory.album_id == album.id
    ).first()

    if memory is None:
        raise HTTPException(
            status_code=404,
            detail="No matching memory found"
        )

    return {
        "title": memory.title,
        "score": score,
        "photo": f"http://127.0.0.1:8000/uploads/user_{album.user_id}/album_{album.album_code}/photos/{memory.photo}",
        "video": f"http://127.0.0.1:8000/uploads/user_{album.user_id}/album_{album.album_code}/videos/{memory.video}"
    }