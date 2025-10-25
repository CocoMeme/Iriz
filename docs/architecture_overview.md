# Architecture Overview

## Project Goals

- Deliver a mobile-first experience that converts signboard text into natural audio output in under three seconds per capture.
- Provide administrators with a secure dashboard to review usage analytics and tune OCR/TTS performance remotely.
- Preserve usability in low-connectivity environments by caching requests locally and resuming synchronization once online.

## Core Components

1. **Mobile App (Expo + React Native)**
   - Captures images, performs on-device preprocessing, and orchestrates OCR requests.
   - Manages Google login via Expo Auth Session and maintains secure refresh token storage using Expo Secure Store.
   - Streams recognized text to native TTS modules for immediate playback and stores offline logs in SQLite.

2. **Backend API (Flask)**
   - Serves authenticated REST endpoints for uploads, logs, and configuration.
   - Exchanges Google OAuth tokens for JWT-based sessions and persists user profiles in MongoDB.
   - Provides analytics aggregation routines for the admin dashboard.

3. **Web Admin Dashboard (React + Chart.js)**
   - Visualizes log data, activity trends, and OCR accuracy metrics.
   - Offers role-based access control and manual overrides for flagged OCR entries.

## Data Flow

```
[User Camera]
     |
     v
[Mobile Preprocessing] --(local OCR/TTS)--> [Audio Playback]
     |
     | (Authenticated request with JWT)
     v
[Flask API Gateway] --(persist)--> [MongoDB Atlas]
     |
     | (aggregated metrics)
     v
[Admin Dashboard]
```

1. User captures an image and triggers preprocessing (denoising, resizing).
2. On-device OCR extracts candidate text; immediate TTS feedback plays offline.
3. When network is available, the mobile app sends the capture metadata and text payload to the Flask API authorized by JWT.
4. The backend validates the JWT, stores the payload, and publishes summary metrics.
5. Admin dashboard queries analytics endpoints to display updated insights and logs.

## Dependency Snapshot (Phase 1)

| Component | Primary Libraries |
|-----------|-------------------|
| Mobile    | expo, react-native, expo-auth-session, expo-secure-store, sqlite |
| Backend   | flask, flask-cors, pymongo, python-dotenv, google-auth |
| Admin     | react, axios, recharts/chart.js |

## Operational Assumptions

- Google Cloud project provisioned for OAuth credentials (iOS, Android, and web client IDs) before Phase 3.
- MongoDB Atlas cluster configured with IP allowlist matching deployment target.
- Render or alternative hosting ready for Flask API deployment with environment variables for secrets.
