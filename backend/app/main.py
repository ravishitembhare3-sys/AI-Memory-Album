from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.models.user import User

from app.database.database import Base, engine
from app.api.memory import router
from app.api.auth import router as auth_router
from app.api.album import router as album_router
from app.api.public import router as public_router


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Memory Album API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads"
)

app.mount(
    "/qr_codes",
    StaticFiles(directory="app/qr_codes"),
    name="qr_codes"
)

app.include_router(router, prefix="/api")
app.include_router(auth_router, prefix="/auth")
app.include_router(album_router, prefix="/album", tags=["Album"])
app.include_router(public_router, prefix="/public", tags=["Public"])