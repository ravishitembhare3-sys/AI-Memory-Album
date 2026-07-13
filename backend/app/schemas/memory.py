from pydantic import BaseModel


class MemoryResponse(BaseModel):
    id: int
    title: str
    photo: str
    video: str

    class Config:
        from_attributes = True