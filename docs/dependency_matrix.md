# Dependency Matrix

Comprehensive inventory of all project dependencies across platforms.

---

## Backend (Python/Flask)

| Package | Version | Purpose | Critical |
|---------|---------|---------|----------|
| Flask | 3.1.0 | Web framework and REST API server | ✅ |
| Flask-Cors | 5.0.0 | Enable cross-origin requests from web/mobile | ✅ |
| pymongo | 4.10.1 | MongoDB driver for data persistence | ✅ |
| python-dotenv | 1.0.1 | Environment variable management | ✅ |
| PyJWT | 2.9.0 | JWT token generation and validation | ✅ |
| google-auth | 2.36.0 | Google OAuth token verification | ✅ |
| google-auth-oauthlib | 1.2.0 | OAuth2 flow implementation | ✅ |
| requests | 2.32.3 | HTTP client for external API calls | ⚠️ |
| bcrypt | 3.2.0 | Password hashing for admin accounts | ✅ |
| pillow | 11.0.0 | Image processing utilities | ⚠️ |
| pytesseract | 0.3.10 | Tesseract OCR wrapper (server-side fallback) | ⚠️ |

**System Dependencies:**
- Tesseract OCR binary (4.x or 5.x)
- Python 3.11+

---

## Mobile App (React Native/Expo)

| Package | Version | Purpose | Critical |
|---------|---------|---------|----------|
| expo | ~51.0.0 | Expo SDK and runtime | ✅ |
| react | 18.2.0 | UI framework | ✅ |
| react-native | 0.74.0 | Native platform bridge | ✅ |
| expo-auth-session | ~5.5.0 | OAuth authentication flows | ✅ |
| expo-secure-store | ~13.0.0 | Encrypted token storage | ✅ |
| expo-camera | ~15.0.0 | Camera access for image capture | ✅ |
| expo-image-picker | ~15.0.0 | Gallery image selection | ⚠️ |
| expo-av | ~14.0.0 | Audio playback (TTS output) | ✅ |
| expo-sqlite | ~14.0.0 | Local offline database | ✅ |
| expo-web-browser | ~13.0.0 | In-app browser for OAuth | ✅ |
| expo-crypto | ~13.0.0 | Cryptographic functions (PKCE) | ✅ |
| axios | ^1.6.0 | HTTP client for API requests | ✅ |
| @react-navigation/native | ^6.1.0 | Navigation framework | ✅ |
| @react-navigation/stack | ^6.3.0 | Stack-based navigation | ✅ |
| react-native-gesture-handler | ~2.16.0 | Touch gesture handling | ⚠️ |
| react-native-reanimated | ~3.10.0 | Animation library | ⚠️ |
| react-native-safe-area-context | 4.10.0 | Safe area utilities | ⚠️ |
| react-native-screens | ~3.31.0 | Native screen primitives | ⚠️ |

**Native Dependencies:**
- OCR capability (via Tesseract Mobile or ML Kit)
- TTS engine (native iOS/Android)

---

## Web Admin (React/Vite)

| Package | Version | Purpose | Critical |
|---------|---------|---------|----------|
| react | ^18.2.0 | UI framework | ✅ |
| react-dom | ^18.2.0 | React DOM renderer | ✅ |
| react-router-dom | ^6.22.0 | Client-side routing | ✅ |
| axios | ^1.6.0 | HTTP client for API | ✅ |
| recharts | ^2.12.0 | Chart library (primary) | ⚠️ |
| chart.js | ^4.4.0 | Alternative chart library | ⚠️ |
| react-chartjs-2 | ^5.2.0 | React wrapper for Chart.js | ⚠️ |
| date-fns | ^3.3.0 | Date formatting utilities | ⚠️ |
| @mui/material | ^5.15.0 | Material UI components | ✅ |
| @mui/icons-material | ^5.15.0 | Material UI icons | ⚠️ |
| @emotion/react | ^11.11.0 | CSS-in-JS (MUI dependency) | ✅ |
| @emotion/styled | ^11.11.0 | Styled components (MUI dependency) | ✅ |
| vite | ^5.1.0 | Build tool and dev server | ✅ |
| @vitejs/plugin-react | ^4.2.0 | Vite React plugin | ✅ |
| eslint | ^8.56.0 | Code linting | ⚠️ |
| eslint-plugin-react | ^7.33.0 | React-specific linting rules | ⚠️ |

---

## Legend

- ✅ **Critical**: Core functionality depends on this package
- ⚠️ **Important**: Enhances functionality but replaceable
- 📦 **Optional**: Development/testing only

---

## Installation Commands Summary

### Quick Setup (All Components)

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Mobile
cd ../mobile_app
npm install

# Web Admin
cd ../web_admin
npm install
```

### Verification

```powershell
# Python packages
python -c "import flask, pymongo, jwt; print('✅ Backend OK')"

# Node packages (mobile)
cd mobile_app
npm list expo react-native

# Node packages (web)
cd ../web_admin
npm list react vite axios
```

---

## Update Strategy

- **Patch updates**: Apply weekly via `pip install -U` and `npm update`
- **Minor updates**: Review monthly, test before applying
- **Major updates**: Schedule during phase transitions, full regression test

---

## Known Compatibility Issues

1. **Expo SDK 51** requires Node.js 18+ (not compatible with Node 16)
2. **Pillow 11.0** may require additional system libraries on Linux
3. **pytesseract** requires system Tesseract binary matching version expectations
4. **React Navigation** gesture handler requires additional setup in bare React Native

---

## Security Considerations

- Keep `pymongo` updated for security patches
- Monitor `axios` for known vulnerabilities
- Update `expo-auth-session` for OAuth security fixes
- Regular audit with `npm audit` and `pip-audit`
