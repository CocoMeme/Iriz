# Environment Setup Guide

Complete installation and configuration instructions for all project components.

---

## Prerequisites

- **Python 3.11+** (detected: 3.11.9)
- **Node.js 18+** with npm
- **MongoDB Atlas account** (free tier available)
- **Google Cloud Platform project** (for OAuth credentials)
- **Expo CLI** (`npm install -g expo-cli`)
- **Tesseract OCR** installed on development machine

---

## 1. Backend Setup (Flask API)

### Install Python Dependencies

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` and fill in your credentials:
   - Generate `SECRET_KEY` and `JWT_SECRET_KEY` (use strong random strings)
   - Add MongoDB Atlas connection string to `MONGODB_URI`
   - Add Google OAuth credentials from Google Cloud Console

### Install Tesseract OCR

**Windows:**
```powershell
# Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
# Install to default location: C:\Program Files\Tesseract-OCR
# Add to PATH or configure in code
```

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

### Verify Backend Setup

```powershell
python -c "import flask, pymongo, jwt; print('Backend dependencies OK')"
```

---

## 2. Mobile App Setup (Expo + React Native)

### Install Node Dependencies

```powershell
# Navigate to mobile app directory
cd mobile_app

# Install dependencies
npm install

# or with yarn
yarn install
```

### Configure Expo Project

1. Create an Expo account at https://expo.dev
2. Login via CLI:
   ```powershell
   npx expo login
   ```

3. Initialize app configuration:
   ```powershell
   # Create app.json if not exists
   npx expo prebuild
   ```

### Configure Google OAuth for Expo

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials for:
   - **Android**: Use package name from `app.json`
   - **iOS**: Use bundle identifier from `app.json`
   - **Web**: Add redirect URI: `https://auth.expo.io/@your-username/your-app-slug`

3. Create `mobile_app/.env`:
   ```
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
   EXPO_PUBLIC_API_URL=http://localhost:5000
   ```

### Run Mobile App

```powershell
# Start Expo development server
npm start

# Run on specific platform
npm run android    # Android emulator/device
npm run ios        # iOS simulator (macOS only)
npm run web        # Web browser
```

---

## 3. Web Admin Dashboard Setup (React + Vite)

### Install Dependencies

```powershell
# Navigate to web admin directory
cd web_admin

# Install dependencies
npm install
```

### Configure Environment

Create `web_admin/.env`:
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Signboard Reader Admin
```

### Run Development Server

```powershell
npm run dev
```

The dashboard will be available at `http://localhost:5173`

---

## 4. MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 free tier)
3. Add database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get connection string and add to backend `.env` file

### Create Initial Collections

Collections will be auto-created, but you can pre-create them:
- `users` - User profiles and authentication data
- `logs` - OCR capture logs and metadata
- `analytics` - Aggregated usage statistics

---

## 5. Verify Complete Setup

### Start All Services

```powershell
# Terminal 1: Backend API
cd backend
.\venv\Scripts\Activate.ps1
python app.py

# Terminal 2: Mobile App
cd mobile_app
npm start

# Terminal 3: Web Admin
cd web_admin
npm run dev
```

### Test Checklist

- [ ] Backend API responds at `http://localhost:5000`
- [ ] Mobile app launches in Expo Go
- [ ] Web admin dashboard loads at `http://localhost:5173`
- [ ] MongoDB connection successful (check backend logs)
- [ ] Python can import all required packages
- [ ] Node dependencies installed without errors

---

## Troubleshooting

### Backend Issues

**Import Error: No module named 'flask'**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Tesseract not found**
- Verify installation: `tesseract --version`
- Add to PATH or configure `pytesseract.pytesseract.tesseract_cmd`

### Mobile App Issues

**Expo Login Failed**
- Clear cache: `npx expo start -c`
- Re-login: `npx expo logout` then `npx expo login`

**Metro bundler errors**
- Clear cache: `npx expo start --clear`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Web Admin Issues

**Port 5173 already in use**
- Kill process or change port in `vite.config.js`

**API connection refused**
- Verify backend is running on port 5000
- Check CORS settings in Flask app

---

## Next Steps

Once all environments are set up and verified:
1. Review `docs/architecture_overview.md` for system design
2. Proceed to **Phase 2: Mobile App Core Development**
3. Create feature branches for parallel development
4. Set up CI/CD pipelines (optional for Phase 1)

---

## Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Documentation](https://react.dev/)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Tesseract OCR Guide](https://github.com/tesseract-ocr/tesseract)
