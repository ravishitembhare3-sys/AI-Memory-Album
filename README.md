# AI Memory Album

AI-powered Memory Album that connects printed photos with videos using Computer Vision and AI.

## Features

- User Authentication (JWT)
- Create Albums
- QR Code for Every Album
- Upload Multiple Photo + Video Memories
- AI Photo Recognition (ORB + CLIP Hybrid Matching)
- Automatic Video Playback after Photo Scan
- Public Album Access
- Delete Memory
- Delete Album
- Responsive React UI

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT Authentication

### AI
- OpenCV (ORB)
- OpenAI CLIP
- NumPy

## Project Structure

```text
backend/
frontend/

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

cd frontend
npm install
npm run dev
