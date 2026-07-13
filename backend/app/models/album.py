from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.database import Base

class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(150), nullable=False)

    client_name = Column(String(150), nullable=False)

    album_code = Column(String(20), unique=True, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"))