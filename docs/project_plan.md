# 📘 Project Plan: Automatic Signboard Reader for the Visually Impaired
> Dual-platform accessibility system using OCR and Text-to-Speech (TTS) to convert text on signboards into audio for visually impaired users.

---

## 🧠 Project Overview

The **Automatic Signboard Reader for the Visually Impaired** aims to assist users with visual impairments by enabling them to capture images of signboards using a **mobile app**, which then detects text and converts it to speech.

Meanwhile, a **web-based admin dashboard** will monitor system usage, manage logs, and analyze performance data.  
The combined system promotes inclusivity, accessibility, and data-driven improvement of assistive tools.

---

## 🏗️ System Architecture

### **1. Mobile Application (User-Side)**
- Built with **Python (Kivy)** or **React Native + Flask API** backend.
- Handles **camera input**, **OCR text detection**, and **TTS audio output**.
- Works **offline-first**, syncing with the web backend when online.

### **2. Web Application (Admin-Side)**
- Built using **Flask (Python)** or **MERN Stack (MongoDB, Express, React, Node)**.
- Displays:
  - Usage logs (timestamps, recognized text samples, device ID)
  - User feedback data
  - OCR performance analytics
- Secure login system for admin control.

---

## 🧩 Key Features

| Platform  | Feature           | Description                                                   |
|-----------|-------------------|---------------------------------------------------------------|
| Mobile    | Image Capture     | Capture signboards or upload images.                          |
| Mobile    | Text Recognition  | OCR text extraction using Tesseract.                          |
| Mobile    | Text-to-Speech    | Converts extracted text into speech using pyttsx3 or gTTS.    |
| Mobile    | Offline Mode      | Saves logs locally; syncs later to backend.                   |
| Web       | User Management   | Displays user data, activity, and statistics.                 |
| Web       | Log Dashboard     | Shows text captures, timestamps, and OCR results.             |
| Web       | Analytics         | Tracks system usage, performance, and error rate.             |

---

## 🧰 Tools and Technologies

| Component         | Technology / Library          | Purpose                               |
|-------------------|-------------------------------|---------------------------------------|
| Language          | **Python 3.10+**              | Core development                      |
| OCR               | **Tesseract OCR**             | Text detection                        |
| TTS               | **pyttsx3** / **gTTS**        | Text-to-speech                        |
| Image Processing  | **OpenCV**, **Pillow**        | Preprocessing and image capture       |
| Mobile Framework  | **Kivy** or **React Native**  | Cross-platform app development        |
| Backend API       | **Flask**                     | Communication between mobile and web  |
| Database          | **MongoDB**                   | Store user logs and OCR results       |
| Web Framework     | **React.js (Frontend)**       | Admin dashboard UI                    |
| Hosting           | **Render / Vercel / Heroku**  | Deployment                            |
| Authentication    | **JWT / Firebase Auth**       | Secure user and admin login           |

---

## 🪜 Development Phases

### **Phase 1: Planning & Setup** ✅
- [x] Define project goals, architecture, and data flow (see `docs/architecture_overview.md`).
- [x] Create repository onboarding docs (`README.md`) and confirm project structure.
- [x] Compile dependency installation scripts and environment setup guides.

**Deliverables:**
- `docs/architecture_overview.md` outlining goals, component responsibilities, and end-to-end data flow.
- `docs/setup_guide.md` with complete installation and configuration instructions.
- `docs/dependency_matrix.md` documenting all packages across platforms.
- `backend/requirements.txt` with Python dependencies.
- `backend/.env.example` template for environment configuration.
- `mobile_app/package.json` with React Native/Expo dependencies.
- `web_admin/package.json` with React/Vite dependencies.
- `README.md` describing repository layout and immediate next steps.
- Python 3.11 environment detected; package inventory captured via tooling for future automation.

✅ **Phase 1 Complete** — All planning artifacts and dependency configurations ready for development.

### **Phase 2: Mobile App Core Development**
1. **Set up camera access** via OpenCV or native mobile APIs.  
2. **Implement OCR** using Tesseract.  
3. **Integrate TTS** for audio playback of recognized text.  
4. **Add offline data logging** (save recognized text + timestamps).  
5. **Develop a simple GUI** with large buttons and audio feedback.  

✅ *Milestone:* Functional offline mobile app that can read signs aloud.

---

### **Phase 3: Authentication & Login Setup**
1. Configure **Expo** project credentials and enable Google OAuth client IDs.  
2. Implement **Expo Google login** using `expo-auth-session` with PKCE flow.  
3. Handle token exchange with backend for session creation and JWT issuance.  
4. Store and refresh authentication tokens securely on the device.  
5. Update sync logic to require authenticated sessions before uploading logs.  

✅ *Milestone:* Secure mobile login flow with backend-issued tokens tied to Google accounts.

---

### **Phase 4: Backend API Setup**
1. Create a **Flask REST API** with routes for:
   - `/upload-text`
   - `/get-logs`
   - `/user-auth`
2. Connect backend to **MongoDB Atlas** for data storage.
3. Implement **JWT authentication** for security.
4. Sync offline logs from the mobile app when internet is available.

✅ *Milestone:* Working backend that receives and stores user activity data.

---

### **Phase 5: Web Admin Dashboard**
1. Build React-based dashboard (or Flask template).  
2. Admin login + authentication.  
3. Display user logs and OCR data using charts/tables.  
4. Optional: Add analytics (usage count, OCR accuracy, user activity graph).  

✅ *Milestone:* Web dashboard visualizing mobile app activity.

---

### **Phase 6: Integration & Testing**
- Test data flow between mobile → backend → web.  
- Validate OCR accuracy and TTS clarity.  
- Conduct user accessibility tests (e.g., large buttons, audio feedback).  
- Debug sync issues and optimize performance.

✅ *Milestone:* Fully functional system with stable communication between platforms.

---

### **Phase 7: Finalization & Documentation**
- Write system documentation and installation guide.  
- Prepare final project report and demo presentation.  
- Optional: Deploy the web dashboard on **Render** or **Vercel**.  

✅ *Milestone:* Deployed project with documentation and final demo.

---

## 🧪 Testing Plan

| Test Type             | Description                                             |
|-----------------------|---------------------------------------------------------|
| Functional Test       | Check if OCR, TTS, and camera modules work correctly.   |
| Performance Test      | Measure processing time for OCR and audio output.       |
| Accessibility Test    | Verify ease of use for visually impaired individuals.   |
| Integration Test      | Ensure mobile app successfully syncs data with backend. |
| Security Test         | Validate secure login and data storage for admins.      |

---

## 🗂️ Suggested Folder Structure

│
├── mobile_app/
│ ├── main.py
│ ├── modules/
│ │ ├── ocr.py
│ │ ├── tts.py
│ │ ├── camera.py
│ │ └── storage.py
│ └── assets/
│ └── icons/
│
├── backend/
│ ├── app.py
│ ├── routes/
│ │ ├── users.py
│ │ ├── logs.py
│ └── models/
│ └── database.py
│
├── web_admin/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── App.jsx
│ └── package.json
│
└── docs/
├── README.md
└── Project_Plan.md