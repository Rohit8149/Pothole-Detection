# Pothole Detection Website

A full-stack MERN application with AI-powered pothole verification. Users report potholes with images and location; an AI model verifies detections, and reports are auto-assigned to the nearest officer. Role-based dashboards are provided for users, officers, and supervisors.

---

## Tech Stack

- **Frontend:** React, React Router, Axios; file upload, browser geolocation, OpenStreetMap reverse geocoding, canvas overlays for bounding boxes.
- **Backend:** Node.js, Express, MongoDB, JWT auth, bcrypt, multer, Helmet, CORS.
- **Model API:** FastAPI serving YOLO-based inference; only AI-verified reports are saved.

---

## Project Structure

```
model_api/   — FastAPI service for YOLO inference
backend/     — Express + MongoDB REST APIs and auth
frontend/    — React app with role-based dashboards
```

---

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and pip
- MongoDB running locally or a connection string (`MONGODB_URI`)
- OpenStreetMap reverse geocoding requires internet access; no API keys needed

---

## Quick Start

### Model API (FastAPI)

1. Open a terminal in `model_api/`.
2. Create and activate virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run dev server:
```bash
python -m uvicorn app:app --reload
```

**Default URL:** `http://127.0.0.1:8000`

---

### Backend (Express + MongoDB)

1. Open a terminal in `backend/`.
2. Install dependencies:
```bash
npm i
```
3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pothole_db
JWT_SECRET=your_jwt_secret
```
4. Start server:
```bash
npm start
```

**Default URL:** `http://127.0.0.1:5000`

---

### Frontend (React)

1. Open a terminal in `frontend/`.
2. Install dependencies:
```bash
npm i
```
3. Start dev server:
```bash
npm start
```

**Default URL (usually):** `http://localhost:3000`

---

## Features

### User Flow
- Register/Login with JWT authentication
- Submit report with image, auto location, reverse geocoded address, severity, and description
- Report is saved only if AI detects potholes; otherwise, user is notified
- Dashboard to view submitted reports with annotated images

### Officer Flow
- View assigned reports and filter by status/severity
- Update report status and view details (photo, location, description)

### Supervisor Flow
- View all reports with filters (ID, location, officer, status, severity, date)
- Monitor officer assignments and progress

---

## How it Works
1. Upload → Backend calls FastAPI model → Model returns bounding boxes if potholes detected
2. If detected: save report, draw boxes on canvas in frontend, and return annotated view
3. If not detected: notify user; report is discarded
4. Assignment: nearest officer computed using lat/lon (e.g., Haversine), and report is auto-assigned

---

## Environment Variables

**Backend `.env`**
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`


## Development Tips
- Start order: Model API → Backend → Frontend
- Verify internet connectivity and browser geolocation permissions
- Ensure backend CORS allows frontend origin during development
- For role-based dashboards, verify role mapping logic tied to user email and allowed actions

---

## Notes and Limitations
- No email/notification system for assignments is implemented
- Report persistence is gated by AI verification to reduce false reports
- Model metrics (example): precision ~81.7%, recall ~68.1%, mAP50 ~79.8% (actual results may vary by weights)

---

## Scripts Cheat Sheet

### Model API
```bash
python -m venv venv
# Activate venv:
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

### Backend
```bash
npm i
npm start
```

### Frontend
```bash
npm i
npm start
```
