from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.album import Album
from app.models.memory import Memory

router = APIRouter()

@router.get("/{album_code}")
def public_album(album_code: str, db: Session = Depends(get_db)):

    album = db.query(Album).filter(
        Album.album_code == album_code
    ).first()

    if album is None:
        raise HTTPException(
            status_code=404,
            detail="Album not found"
        )

    memories = db.query(Memory).filter(
        Memory.album_id == album.id
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

    return {
        "album": {
            "id": album.id,
            "name": album.name,
            "client_name": album.client_name,
            "album_code": album.album_code
        },
        "memories": result
    }