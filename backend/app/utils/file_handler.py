import os
import uuid

IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"]
VIDEO_EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv"]


def generate_filename(filename: str):
    ext = os.path.splitext(filename)[1]
    unique = uuid.uuid4().hex
    return f"{unique}{ext}"


def is_image(filename: str):
    ext = os.path.splitext(filename)[1].lower()
    return ext in IMAGE_EXTENSIONS


def is_video(filename: str):
    ext = os.path.splitext(filename)[1].lower()
    return ext in VIDEO_EXTENSIONS