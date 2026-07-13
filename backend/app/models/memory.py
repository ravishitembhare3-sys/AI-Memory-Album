from sqlalchemy import Column, Integer, String, ForeignKey

from app.database.database import Base


class Memory(Base):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)

    album_id = Column(Integer, ForeignKey("albums.id"), nullable=False)

    title = Column(String(100), nullable=False)

    photo = Column(String(255), nullable=False)

    video = Column(String(255), nullable=False)

    descriptor = Column(String(255), nullable=True)

    embedding = Column(String(255), nullable=True)

