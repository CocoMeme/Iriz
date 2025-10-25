# 👁️ Iriz - Automatic Signboard Reader for the Visually Impaired

> Empowering accessibility through intelligent text recognition and audio conversion technology.

---

## 📖 About Iriz

**Iriz** is a dual-platform accessibility system designed to assist visually impaired individuals by converting text on signboards into natural audio. Using advanced OCR (Optical Character Recognition) and Text-to-Speech technology, Iriz enables users to navigate their environment with greater independence and confidence.

### Mission Statement

To promote inclusivity and accessibility by providing an intelligent, offline-capable mobile solution that transforms visual text into immediate audio feedback, helping visually impaired users access critical information in public spaces.

---

## 🌟 Key Features

### Mobile Application (User-Facing)
- 📸 **Instant Capture** - Quick camera access for photographing signboards
- 🔍 **Smart OCR** - Advanced text extraction from images
- 🔊 **Natural TTS** - Clear audio playback of recognized text
- 📴 **Offline Mode** - Full functionality without internet connection
- 🔒 **Secure Login** - Google authentication via Expo
- 💾 **Smart Sync** - Automatic data synchronization when online

### Web Admin Dashboard (Management)
- 📊 **Usage Analytics** - Real-time statistics and usage patterns
- 📝 **Activity Logs** - Comprehensive capture history with timestamps
- 👥 **User Management** - Monitor user activity and engagement
- 📈 **Performance Metrics** - OCR accuracy and system health tracking
- 🔐 **Secure Access** - Role-based authentication for administrators

---

## 🏗️ System Architecture

Iriz consists of three interconnected components:

```
┌─────────────────┐
│  Mobile App     │ ← User captures signboard
│  (Expo/RN)      │ → OCR + TTS processing
└────────┬────────┘ → Offline-first storage
         │
         │ JWT Auth
         ↓
┌─────────────────┐
│  Backend API    │ ← Receives authenticated logs
│  (Flask)        │ → Validates & stores data
└────────┬────────┘
         │
         │ MongoDB
         ↓
┌─────────────────┐
│  Web Dashboard  │ ← Displays analytics
│  (React/Vite)   │ → Admin management tools
└─────────────────┘
```

### Technology Stack

| Component | Technologies |
|-----------|-------------|
| **Mobile** | Expo 51, React Native, expo-auth-session, expo-camera, expo-av, SQLite |
| **Backend** | Flask, PyJWT, pymongo, google-auth, python-dotenv |
| **Web** | React 18, Vite, Material UI, Recharts, Axios |
| **Database** | MongoDB Atlas |
| **OCR** | Tesseract OCR, pytesseract |
| **TTS** | Native iOS/Android text-to-speech engines |
| **Auth** | Google OAuth 2.0, JWT |

---

## 📂 Documentation Index

This `docs/` folder contains all project documentation:

### Setup & Installation
- **[setup_guide.md](./setup_guide.md)** - Complete installation instructions for all components
- **[dependency_matrix.md](./dependency_matrix.md)** - Detailed dependency inventory and management

### Project Planning
- **[Project_Plan.md](./Project_Plan.md)** - Full 7-phase development roadmap
- **[architecture_overview.md](./architecture_overview.md)** - System design and data flow details
- **[phase1_completion.md](./phase1_completion.md)** - Phase 1 deliverables summary

### Development Guides
- Coming in Phase 2+:
  - API documentation
  - Mobile app development guide
  - Admin dashboard user manual
  - Testing procedures
  - Deployment guide

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:
- Python 3.11+
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Platform project (OAuth credentials)
- Tesseract OCR

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Elective_4_Project
   ```

2. **Follow the setup guide**
   ```bash
   # See docs/setup_guide.md for detailed instructions
   ```

3. **Backend Setup**
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   # Configure .env file
   python app.py
   ```

4. **Mobile App Setup**
   ```powershell
   cd mobile_app
   npm install
   # Configure .env file
   npm start
   ```

5. **Web Admin Setup**
   ```powershell
   cd web_admin
   npm install
   # Configure .env file
   npm run dev
   ```

For detailed instructions, see **[setup_guide.md](./setup_guide.md)**.

---

## 📋 Development Status

### Current Phase: Phase 1 ✅ Complete

- [x] Project planning and architecture design
- [x] Dependency configuration and documentation
- [x] Environment setup guides
- [ ] **Next: Phase 2 - Mobile App Core Development**

### Upcoming Phases

- **Phase 2**: Mobile App Core Development (Camera, OCR, TTS, Offline Storage)
- **Phase 3**: Authentication & Login Setup (Expo Google OAuth)
- **Phase 4**: Backend API Setup (Flask REST API, MongoDB)
- **Phase 5**: Web Admin Dashboard (React UI, Analytics)
- **Phase 6**: Integration & Testing
- **Phase 7**: Finalization & Deployment

See **[Project_Plan.md](./Project_Plan.md)** for complete roadmap.

---

## 🎯 Project Goals

1. **Accessibility First** - Design with visually impaired users at the center
2. **Offline Capability** - Ensure core functionality without internet
3. **Speed & Accuracy** - Deliver OCR results in under 3 seconds
4. **Privacy & Security** - Protect user data with encryption and secure authentication
5. **Scalability** - Build architecture that supports future growth
6. **Data-Driven Improvement** - Use analytics to continuously enhance performance

---

## 🧪 Testing Strategy

Iriz employs comprehensive testing across multiple dimensions:

| Test Type | Focus Areas |
|-----------|------------|
| **Functional** | OCR accuracy, TTS clarity, camera capture |
| **Performance** | Processing speed, memory usage, battery consumption |
| **Accessibility** | Screen reader compatibility, large UI elements, audio feedback |
| **Integration** | Mobile-backend sync, authentication flow, data persistence |
| **Security** | Token validation, encrypted storage, API authorization |
| **Usability** | Real-world testing with visually impaired users |

---

## 👥 Target Users

### Primary Users
- Individuals with visual impairments seeking navigation assistance
- Low-vision users who benefit from audio augmentation
- Accessibility advocates and organizations

### Secondary Users
- System administrators monitoring usage and performance
- Researchers studying accessibility technology effectiveness
- Caregivers and support staff

---

## 🔐 Security & Privacy

Iriz takes user privacy seriously:

- **Google OAuth 2.0** - Secure authentication with PKCE flow
- **JWT Tokens** - Time-limited session management
- **Encrypted Storage** - Sensitive data protected on-device via Expo Secure Store
- **No PII in Logs** - OCR text stored without personally identifying information
- **Admin Controls** - Role-based access to sensitive dashboard features

---

## 🤝 Contributing

Currently, Iriz is in active development as an educational project. Contribution guidelines will be established after Phase 6 completion.

---

## 📄 License

[To be determined - Add license information]

---

## 📞 Contact & Support

**Project Name:** Iriz - Automatic Signboard Reader  
**Development Phase:** Phase 1 Complete, Phase 2 In Planning  
**Documentation:** All guides available in `docs/` folder

For setup issues, refer to:
- **[setup_guide.md](./setup_guide.md)** - Installation troubleshooting
- **[dependency_matrix.md](./dependency_matrix.md)** - Package version conflicts

---

## 🙏 Acknowledgments

This project aims to contribute to the broader accessibility technology ecosystem and support the visually impaired community through innovative, practical solutions.

---

**Built with ❤️ for accessibility and inclusion**

*Iriz - See the world through sound*
