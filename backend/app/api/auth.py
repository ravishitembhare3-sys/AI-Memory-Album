from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter()


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
    )

    db.add(new_user)
    db.commit()

    return {"message": "Registration successful"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token(
    {
        "user_id": user.id,
        "email": user.email
    }
    )
    return {
    "message": "Login successful",
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": user.id,
        "name": user.name,
        "email": user.email,
    }
}