# FitTech — Project Setup Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start Expo development server
npm start
```

---

---

## Local Network Troubleshooting (Expo Go)

If you are using **Expo Go** on a physical device or a separate emulator, you may encounter `Request timed out` errors. Follow these steps to resolve them:

### 1. Match the API URL to your setup
Update your `.env` file based on your environment:

- **Android Emulator**: `http://10.0.2.2:3000/api`
- **iOS Simulator**: `http://localhost:3000/api`
- **Physical Device (Same Wi-Fi)**: `http://[YOUR_COMPUTER_IP]:3000/api` (e.g., `192.168.1.50`)

### 2. Check your Firewall
Your computer's firewall often blocks incoming connections on port `3000`. 
- **Windows**: Allow "Node.js JavaScript Runtime" through the Windows Defender Firewall.
- **Mac**: Check System Settings > Network > Firewall and ensure it's not blocking incoming connections for your development tools.

### 3. Backend "Listen" Configuration
The backend is configured to listen on `0.0.0.0`, which means it accepts connections from any device on your local network. Ensure your backend is running before starting Expo.

---


## JWT Token Flow

### How tokens are stored

All tokens are stored **encrypted** on-device using [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/), which maps to iOS Keychain and Android Keystore. Tokens are **never** stored in plain `AsyncStorage`.

There are two storage mechanisms:

1. **`redux-persist` via `SecureStore`** (`src/store/secureStorage.ts`): The entire Redux `auth` slice (including `token`, `refreshToken`, and `user`) is serialized and persisted to SecureStore. This is the primary mechanism that survives app restarts.

2. **`tokenService`** (`src/services/tokenService.ts`): A thin, direct wrapper for one-off token reads/writes outside the Redux lifecycle (e.g., startup checks, non-Redux services).

### Token lifecycle

```
1. App Launch
   └─ PersistGate rehydrates Redux store from SecureStore
      └─ isAuthenticated = true  →  AppNavigator renders AppStack
      └─ isAuthenticated = false →  AppNavigator renders AuthStack

2. Login / Register
   └─ dispatch(login(credentials))
      └─ authService.login() called via Axios
      └─ On success: Redux state updated (user, token, refreshToken, isAuthenticated)
      └─ redux-persist automatically saves to SecureStore

3. Every API Request
   └─ Axios interceptor reads token from Redux store
      └─ Attaches: Authorization: Bearer <token>

4. Token Expiry (401 Response)
   └─ Axios response interceptor catches 401
      └─ Attempts token refresh via /auth/refresh
         └─ On success: store.dispatch(setCredentials(...)) with new tokens
         └─ Retry original request
         └─ On failure: store.dispatch(logout()) → navigates to AuthStack

5. Logout
   └─ dispatch(logout())
      └─ Redux state reset (user=null, token=null, isAuthenticated=false)
      └─ redux-persist clears SecureStore entry
      └─ Navigation: AuthStack is displayed
```

### Key Files

| File | Purpose |
|---|---|
| `src/store/secureStorage.ts` | SecureStore adapter for redux-persist |
| `src/services/tokenService.ts` | Direct token read/write (outside Redux) |
| `src/services/axiosClient.ts` | Axios instance + auth interceptors |
| `src/features/auth/store/authSlice.ts` | Redux auth state + async thunks |
| `src/features/auth/store/authSelectors.ts` | Typed Redux selectors |

---

## Project Structure

```
src/
├── features/
│   └── auth/
│       ├── assets/            # Auth screen images
│       ├── components/        # Auth-specific UI components
│       ├── screens/           # All authentication screens
│       ├── services/          # authService (API calls)
│       └── store/             # authSlice + authSelectors
├── navigation/
│   ├── AppNavigator.tsx       # Root navigator
│   └── routes.ts              # Route name constants
├── services/
│   ├── axiosClient.ts         # Axios instance + JWT interceptors
│   └── tokenService.ts        # Direct SecureStore token access
├── shared/
│   ├── components/
│   │   ├── layout/            # AppScreen, ErrorBanner, Loader, LoadingOverlay
│   │   └── ui/                # Input, NeonButton, Logo, Modal, etc.
│   ├── constants/             # colors, theme, apiEndpoints, errorMessages
│   ├── context/               # ThemeContext (light/dark mode)
│   ├── hooks/                 # useTheme, useReduxHooks, useApiCall
│   └── utils/                 # logger, validators, responsive
├── store/
│   ├── store.ts               # Redux configureStore + redux-persist
│   ├── secureStorage.ts       # SecureStore ↔ redux-persist adapter
│   └── helpers.ts             # Shared pending/fulfilled/rejected handlers
└── types/
    ├── index.ts               # User interface
    ├── api.types.ts           # ApiResponse, ApiError
    ├── navigation.types.ts    # AuthStackParamList, SignupData
    └── declarations.d.ts      # Module declarations
```

---

---

## Auth Screens Flow

```
SplashScreen
  └─ WelcomeScreen
       └─ AuthChoiceScreen
            ├─ LoginScreen
            │    └─ ForgotPasswordScreen
            │         └─ OTPVerificationScreen (mode: 'reset')
            │              └─ ResetPasswordScreen
            │                   └─ SuccessScreen
            └─ RegisterStep1Screen  (Personal Info)
                 └─ RegisterStep2Screen  (Account Security)
                      └─ RegisterStep3Screen  (Weight)
                           └─ RegisterStep4Screen  (Height)
                                └─ RegisterStep5Screen  (Goal)
                                     └─ RegisterStep6Screen  (Activities)
                                          └─ OTPVerificationScreen (mode: 'register')
                                               └─ SuccessScreen
```
