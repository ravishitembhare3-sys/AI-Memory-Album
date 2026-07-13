from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
import random
import string

from app.database.database import get_db
from app.models.album import Album
from app.services.qr_service import generate_qr
from app.utils.auth_dependency import get_current_user
from app.models.memory import Memory
from app.services.storage_service import delete_album_folder
import os

router = APIRouter()


class AlbumRequest(BaseModel):
    name: str
    client_name: str


def generate_album_code():
    return ''.join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=8
        )
    )


# ==========================
# Create Album
# ==========================

@router.post("/create")
def create_album(
    data: AlbumRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    code = generate_album_code()

    while db.query(Album).filter(
        Album.album_code == code
    ).first():
        code = generate_album_code()

    qr_file = generate_qr(code)

    album = Album(
        name=data.name,
        client_name=data.client_name,
        album_code=code,
        user_id=current_user["user_id"]
    )

    db.add(album)
    db.commit()
    db.refresh(album)

    return {
        "message": "Album Created",
        "album_id": album.id,
        "album_code": album.album_code,
        "qr": f"/qr_codes/{qr_file}"
    }


# ==========================
# Get My Albums
# ==========================

@router.get("/my")
def get_my_albums(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    albums = db.query(Album).filter(
        Album.user_id == current_user["user_id"]
    ).all()

    return albums


# ==========================
# Get Album By Code
# ==========================

@router.get("/code/{album_code}")
def get_album_by_code(
    album_code: str,
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

    return {
        "album_id": album.id,
        "album_name": album.name,
        "client_name": album.client_name,
        "album_code": album.album_code
    }
# ==========================
# Get Single Album
# ==========================

@router.get("/{album_id}")
def get_album(
    album_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
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

    return {
        "id": album.id,
        "name": album.name,
        "client_name": album.client_name,
        "album_code": album.album_code,
        "qr": f"/qr_codes/{album.album_code}.png"
    }
# ==========================
# Delete Album
# ==========================

@router.delete("/{album_id}")
def delete_album(
    album_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
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

    # Delete all memories of this album
    db.query(Memory).filter(
        Memory.album_id == album.id
    ).delete()

    # Delete upload folder
    delete_album_folder(
        album.user_id,
        album.album_code
    )

    # Delete QR Code
    qr_path = f"app/qr_codes/{album.album_code}.png"

    if os.path.exists(qr_path):
        os.remove(qr_path)

    # Delete album from database
    db.delete(album)
    db.commit()

    return {
        "success": True,
        "message": "Album deleted successfully"
    }

# ==========================
# Get Album Details
# ==========================

@router.get("/{album_id}")
def get_album(
    album_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
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

    return {
    "id": album.id,
    "name": album.name,
    "client_name": album.client_name,
    "album_code": album.album_code,
    "qr": f"/qr_codes/{album.album_code}.png"
}