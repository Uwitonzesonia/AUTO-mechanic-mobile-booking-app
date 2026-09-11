# 🚗 AUTO Mechanic - Mobile Booking App

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Store-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Mapbox](https://img.shields.io/badge/Mapbox-Directions%20API-000000?style=for-the-badge&logo=mapbox&logoColor=white)](https://www.mapbox.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

An on-demand mobile automotive repair and breakdown assistance application built with **React Native**, **Expo SDK 57**, and **TypeScript**. **AUTO Mechanic** connects drivers directly with certified nearby auto mechanics, offering real-time geolocation tracking, upfront pricing, route visualization, and booking management.

---
[![Coverage](https://img.shields.io/codecov/c/github/Uwitonzesonia/AUTO-mechanic-mobile-booking-app?style=for-the-badge&logo=codecov&logoColor=white)](https://codecov.io/gh/Uwitonzesonia/AUTO-mechanic-mobile-booking-app)

---
## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Navigation Flow](#-architecture--navigation-flow)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Available Scripts](#-available-scripts)
- [Testing Strategy](#-testing-strategy)
- [Contributing & License](#-contributing--license)

---

## 🌟 Overview

When vehicle breakdowns happen, drivers need fast, dependable assistance without unpredictable towing fees or lengthy call-center delays. **AUTO Mechanic** provides a streamlined, map-first mobile experience:

1. **Locate**: Pinpoint current coordinates and view nearby active mechanics with live distance and ratings.
2. **Diagnose & Request**: Specify vehicle model, breakdown location, and issue category via a 3-step timeline modal.
3. **Book**: Review mechanic credentials, transparent flat fees, and consultation charges before confirming.
4. **Track Live**: Follow the mechanic's GPS route with real-time ETA and distance countdown, transitioning automatically to *Vehicle Check in Progress* upon arrival at 5 meters.
5. **Cancel or Navigate**: Slide-to-cancel knob and back buttons intelligently dismiss active flows and restore previous tab contexts.

---

## ✨ Key Features

### 🗺️ Live Map & Route Guidance
- **Interactive Google Maps**: Integrated using `react-native-maps` with dark mode map styling.
- **Route Polylines**: Real-time directions queried through the Mapbox Directions API with high-precision polyline decoding.
- **Mechanic Movement Simulation**: Live tracking coordinate interpolation that updates mechanic location, remaining route length, distance in meters/kilometers, and ETA.
- **Smart Camera Fitting**: Automatic map camera framing for pickup coordinates, mechanic origin, and dynamic route extents.

### 🛠️ Booking & Workflow Management
- **Repair Location Modal**: A multi-column bottom sheet to configure pickup location, vehicle selection, and issue category.
- **Transparent Fee Breakdown**: Clear display of flat callout fee, diagnostic inspection fee, and aggregate total.
- **Mechanic Arriving Card**: Bottom sheet containing driver avatar, live ETA badge, call/chat shortcuts, and arrival notifications.
- **Slide-to-Cancel Slider**: Gesture-driven `PanResponder` sliding knob (`SlideToCancelButton`) providing deliberate cancellation feedback.
- **Clean Stack Reset**: Slide-to-cancel and header back actions pop all nested modal/booking screens and return directly to the originating tab (`Home`, `Garage`, `Wallet`, or `Profile`).

### 🔐 Authentication & Session Security
- **Multi-Provider Auth**: Firebase Authentication supporting Email/Password, Google Sign-In, and Facebook Login.
- **Secure Token Storage**: Encrypted token persistence using `expo-secure-store`.
- **Protected Routing**: Global auth state checks in root layout, automatically rerouting unauthenticated users to `/login`.
- **Network Monitoring**: Continuous connectivity status detection via `@react-native-community/netinfo` and `expo-network`.

### 🎨 UI & Aesthetics
- **Dark-Theme Design**: Consistent palette centered around `#0e1626` and `#141A22` with subtle translucent glassmorphic card borders.
- **Curved Bottom Tab Bar**: Custom tab navigator floating bar with elevated circular center trigger.
- **Side Drawer**: Slide-out navigation drawer providing access to Messages, Settings, Support, and Terms & Conditions.
- **Micro-Interactions**: Fluid animations built with `Animated` and `react-native-reanimated`.

---

## 🧭 Architecture & Navigation Flow

The application utilizes **Expo Router** (file-based navigation) structured in nested groups:

```
app/
├── index.tsx                         --> Initial route & onboarding check
├── onboarding.tsx                    --> First-launch introductory slides
├── _layout.tsx                       --> Root Stack (Providers, Splash, Auth gate)
│
├── (auth)/                           --> Authentication Group
│   ├── _layout.tsx                   --> Auth Stack
│   ├── login.tsx                     --> Email, Google & Facebook sign-in
│   ├── register.tsx                  --> User registration
│   └── forgot-password.tsx           --> Password reset flow
│
└── (drawer)/                         --> Main App Drawer Navigator
    ├── _layout.tsx                   --> Custom drawer configuration
    ├── messages.tsx                  --> In-app chat interface
    ├── settings.tsx                  --> User preferences
    ├── support.tsx                   --> Customer support contact
    ├── termsConditions.tsx           --> Legal & privacy policy
    │
    └── (tabs)/                       --> Bottom Tab Navigator
        ├── _layout.tsx               --> Custom bottom tab bar & repair trigger
        ├── index.tsx                 --> Home screen dashboard
        ├── garage.tsx                --> User vehicles & maintenance history
        ├── wallet.tsx                --> Payment methods & balance
        ├── profile.tsx               --> Profile management & avatar upload
        │
        └── maintenance/              --> Maintenance Stack Navigator
            ├── _layout.tsx           --> Maintenance Stack (index, booking, job)
            ├── index.tsx             --> Primary map, coordinator, and detail cards
            ├── booking.tsx           --> Booking summary, fee breakdown & payment method
            └── job.tsx               --> Active repair job status
```

---

## 📁 Project Structure

```
auto-app/
├── assets/                           --> Static assets, logos, fonts, and marker images
├── components/                       --> Reusable modular UI components
│   ├── maintenance/                  --> Map cards, sliders, arrival indicators
│   │   ├── detail/                   --> Mechanic preview & arriving cards
│   │   ├── map/                      --> Map markers, polylines, location state
│   │   ├── modal/                    --> Repair location timeline & Q&A
│   │   ├── SlideToCancelButton.tsx   --> Draggable slide-to-cancel knob
│   │   └── TransparentHeaderCard.tsx --> Top navigation bar with back/slider/avatar
│   ├── navigations/                  --> Custom headers and drawer content
│   ├── splash/                       --> Animated app splash screen
│   └── ui/                           --> Primitives (Button, Avatar, Modal, etc.)
├── config/                           --> Firebase client initialization
├── constants/                        --> Static mechanic rosters, mock data, colors
├── context/                          --> React Contexts (AuthContext, NetworkContext)
├── hooks/                            --> Custom React hooks
│   ├── useAuth.ts                    --> Authentication actions & user state
│   ├── useMaintenanceCoordinator.ts  --> Orchestrates map, routing, search & cancel
│   ├── useMapboxRoute.ts             --> Mapbox Directions query & route parsing
│   ├── useMechanicMovement.ts        --> GPS simulation & countdown calculation
│   └── useUserLocation.ts            --> Location permissions & watchPosition
├── services/                         --> External API adapters (Mapbox client)
├── types/                            --> TypeScript interfaces (Mechanic, Route, User)
├── utils/                            --> Helper functions (phone dialer, storage, formatting)
├── app.config.ts                     --> Dynamic Expo configuration & native plugins
├── package.json                      --> Dependencies and scripts
└── test.md                           --> Testing documentation & test patterns guide
```

---

## 💻 Tech Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Framework** | [Expo](https://expo.dev/) (SDK 57), [React Native](https://reactnative.dev/) (0.86.3) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) (v57), React Navigation Drawer & Tabs |
| **Maps & Location** | `react-native-maps`, `expo-location`, Mapbox Directions API |
| **Authentication** | Firebase Auth (v12), Google Sign-In (`@react-native-google-signin`), Facebook SDK (`react-native-fbsdk-next`) |
| **Storage & Security** | `expo-secure-store` |
| **Animations & UI** | `react-native-reanimated`, `expo-blur`, `expo-linear-gradient`, `react-native-vector-icons` |
| **Testing** | Jest, `jest-expo`, React Native Testing Library (`@testing-library/react-native`) |

---

## 📦 Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js**: `v18.x` or `v20.x` LTS recommended
- **npm** (or **yarn** / **pnpm**)
- **Android Studio** (with Android SDK & emulator) for Android development
- **Xcode** (macOS only) for iOS simulator testing
- **Expo Go** app on your physical device, or an Expo Dev Build

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Uwitonzesonia/AUTO-mechanic-mobile-booking-app.git
cd auto-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file and fill in your API credentials:

```bash
cp .env.example .env
```

Refer to the [Environment Configuration](#-environment-configuration) section for details on each variable.

### 4. Start the Development Server

```bash
npm start
```

Press `a` in the terminal to launch the Android emulator, `i` for the iOS simulator, or scan the QR code with the Expo Go app.

---

## ⚙️ Environment Configuration

Populate the `.env` file with credentials obtained from your provider consoles:

```env
# ==============================================
# FIREBASE CONFIGURATION
# ==============================================
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# ==============================================
# GOOGLE AUTHENTICATION
# ==============================================
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
EXPO_PUBLIC_IOS_CLIENT_ID=your_ios_client_id
EXPO_PUBLIC_WEB_CLIENT_ID=your_web_client_id

# ==============================================
# FACEBOOK SDK / AUTHENTICATION
# ==============================================
EXPO_PUBLIC_FACEBOOK_APP_ID_HERE=your_fb_app_id
EXPO_PUBLIC_FACEBOOK_CLIENT_TOKEN_HERE=your_fb_client_token
EXPO_PUBLIC_FACEBOOK_APP_SECRET=your_fb_app_secret

# ==============================================
# GOOGLE MAPS (react-native-maps)
# ==============================================
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY=your_android_maps_key
EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY=your_ios_maps_key

# ==============================================
# MAPBOX (Routing & Polyline)
# ==============================================
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token
```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm start` | Starts the Expo Metro bundler |
| `npm run android` | Builds and runs the application on an Android device/emulator |
| `npm run ios` | Builds and runs the application on an iOS device/simulator |
| `npm run web` | Serves the web-compiled version |
| `npm test` | Runs the Jest test suite in watch mode |
| `npx jest --watchAll=false` | Executes all Jest tests once |
| `npx tsc --noEmit` | Performs full TypeScript type-checking across the codebase |

---

## 🧪 Testing Strategy

The project includes unit and component tests verified with **Jest** and **React Native Testing Library**:

- **Component Tests**: Assert rendered UI, labels, accessibility attributes, and simulated press events.
- **Hook & Simulation Tests**: Utilize `jest.useFakeTimers()` to test asynchronous movement steps and arrival triggers at 5m.
- **E2E Strategy**: Full multi-screen flow validation via Maestro (documented in [`test.md`](./test.md)).

To execute the test suite:

```bash
npx jest --watchAll=false
```

For complete testing patterns, native module mocking recipes, and code examples, consult [`test.md`](./test.md).

---

## 📄 Contributing & License

Contributions are welcome! Please open an issue or submit a pull request for any feature enhancements or bug fixes.

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.
