# 👁️ Iriz - Automatic Signboard Reader for the Visually Impaired

Assistive system that captures images of signboards, extracts text with OCR, and converts the text to audio, delivering accessible navigation help for visually impaired users.

> *Iriz - See the world through sound*

---

## 📖 About

**Iriz** is a comprehensive accessibility solution consisting of a mobile app for visually impaired users, a backend API for data management, and a web dashboard for administrators. The system enables users to capture signboard images, extract text via OCR, and hear the content through text-to-speech technology—all working offline-first with smart synchronization.

---

## 🏗️ Repository Structure

- **`mobile_app/`** — Cross-platform mobile client (Expo + React Native) handling capture, OCR, text-to-speech, and offline storage.
- **`backend/`** — REST API (Flask), authentication services, and data persistence layer with MongoDB.
- **`web_admin/`** — Administrative dashboard (React + Vite) providing analytics, usage logs, and management tools.
- **`docs/`** — Complete project documentation including setup guides, architecture, and development plans.

---

## 🚀 Quick Links

- **[Complete Documentation](./docs/README.md)** - Full Iriz documentation hub
- **[Setup Guide](./docs/setup_guide.md)** - Installation instructions for all components
- **[Project Plan](./docs/Project_Plan.md)** - 7-phase development roadmap
- **[Architecture](./docs/architecture_overview.md)** - System design and data flow

---

## 🎯 Current Status

### Phase 1: Planning & Setup ✅ **COMPLETE**

All foundational artifacts have been created:
- ✅ System architecture and data flow documented
- ✅ Dependency configurations for all platforms
- ✅ Environment setup guides with troubleshooting
- ✅ Repository structure established

**Next Phase:** Mobile App Core Development (Camera, OCR, TTS, Offline Storage)

---

## 🛠️ Technology Stack

| Component | Technologies |
|-----------|-------------|
| **Mobile** | Expo 51, React Native, SQLite |
| **Backend** | Flask, PyJWT, MongoDB |
| **Web** | React 18, Vite, Material UI |
| **Auth** | Google OAuth 2.0, JWT |
| **OCR** | Tesseract OCR |
| **TTS** | Native iOS/Android engines |

---

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Platform project

### Quick Setup

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Mobile App
cd mobile_app
npm install

# Web Admin
cd web_admin
npm install
```

For detailed instructions, see **[docs/setup_guide.md](./docs/setup_guide.md)**

---

## 📋 Development Phases

1. ✅ **Phase 1:** Planning & Setup — *Complete*
2. ⏳ **Phase 2:** Mobile App Core Development — *Next*
3. 📅 **Phase 3:** Authentication & Login Setup
4. 📅 **Phase 4:** Backend API Setup
5. 📅 **Phase 5:** Web Admin Dashboard
6. 📅 **Phase 6:** Integration & Testing
7. 📅 **Phase 7:** Finalization & Documentation

---

## 📚 Documentation

The **`docs/`** folder contains comprehensive documentation:

- **[README.md](./docs/README.md)** - Complete Iriz documentation hub
- **[setup_guide.md](./docs/setup_guide.md)** - Environment setup and installation
- **[dependency_matrix.md](./docs/dependency_matrix.md)** - Package inventory
- **[Project_Plan.md](./docs/Project_Plan.md)** - Development roadmap
- **[architecture_overview.md](./docs/architecture_overview.md)** - System design
- **[phase1_completion.md](./docs/phase1_completion.md)** - Phase 1 summary

---

## 🌟 Key Features

### Mobile App
- 📸 Instant camera capture
- 🔍 Advanced OCR text extraction
- 🔊 Natural text-to-speech
- 📴 Full offline functionality
- 🔒 Secure Google login

### Admin Dashboard
- 📊 Real-time analytics
- 📝 Activity logs
- 👥 User management
- 📈 Performance metrics

---

## 🤝 Contributing

This project is currently in active development as part of an educational initiative. Contribution guidelines will be established after Phase 6.

---

## 📄 License

[To be determined]

---

## 📞 Contact

For setup issues or questions, refer to the documentation in the `docs/` folder.

---

**Built with ❤️ for accessibility and inclusion**

## Running Backend Server Locally

    cd backend; .\.venv\Scripts\Activate.ps1; python run.py