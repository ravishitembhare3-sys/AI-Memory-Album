from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database.database import Base


class Memory(Base):

    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    photo = Column(String)

    video = Column(String)