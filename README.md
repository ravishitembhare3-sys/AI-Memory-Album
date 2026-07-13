# AI Memory Album

AI Memory Album is a full-stack web application that allows users to create digital memory albums, upload photos and videos, generate QR codes, and retrieve memories using AI-powered image matching.

## Features

- User Authentication (JWT)
- Create and Manage Albums
- Upload Photos & Videos
- QR Code Generation
- Public Album Sharing
- AI Image Matching using OpenCV & CLIP
- Video Playback after Memory Detection
- Responsive UI

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication

### AI
- OpenCV
- CLIP
- NumPy

## Project Structure

```
memory_album/
│
├── frontend/
├── backend/
└── README.md
```

## Installation

### Backend

```bash
cd backend
python -m venv venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Future Improvements

- Live Camera AI Scan
- Face Recognition
- Cloud Storage
- Mobile Responsive UI
- Deployment

## Author

**Ravishi Tembhare**

GitHub:
https://github.com/ravishitembhare3-sys
