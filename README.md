# 🚗 AUTO - Mobile Mechanic Booking App

[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-v12-FFCA28.svg?style=flat&logo=firebase)](https://firebase.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An on-demand mobile roadside assistance and auto mechanic booking application. Built with **React Native (Expo SDK 57)**, **TypeScript**, and a serverless **Firebase Free Tier (Spark)** architecture, **AUTO** bridges the gap between stranded motorists and nearby certified mechanics in real time.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Customer Portal](#-customer-portal)
  - [Mechanic Portal](#-mechanic-portal)
- [Tech Stack & Architecture](#-tech-stack--architecture)
  - [Zero-Cost Free Stack](#-zero-cost-free-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the App](#running-the-app)
- [Roadmap & Sprint Execution Plan](#-roadmap--sprint-execution-plan)
  - [Sprint 0: Project Setup](#-sprint-0---project-setup-week-1)
  - [Sprint 1: Auth & Profile](#-sprint-1---auth--profile-week-2)
  - [Sprint 2: Garage & Vehicles](#-sprint-2---garage--vehicles-week-3)
  - [Sprint 3: Home & Booking Flow](#-sprint-3---home--booking-flow-week-4-5--critical-path)
  - [Sprint 4: Live Tracking & Arriving](#-sprint-4---live-tracking--arriving-week-5-6)
  - [Sprint 5: Real-Time Chat](#-sprint-5---chat-week-6-7)
  - [Sprint 6: Digital Wallet & Payments](#-sprint-6---wallet--payments-week-7-8)
  - [Sprint 7: Reviews, Tips & Ratings](#-sprint-7---reviews-tips--rating-week-8)
  - [Sprint 8: Mechanic Dashboard](#-sprint-8---mechanic-dashboard-week-9)
  - [Sprint 9: EV Charging Stations](#-sprint-9---ev-charging-stations-week-10)
  - [Sprint 10: Polish, Security & QA](#-sprint-10---polish-security--qa-week-11-12)
- [Trello Board & Workflow Guide](#-trello-board--workflow-guide)
  - [Board Lists (Workflow Columns)](#board-lists-workflow-columns)
  - [Label Legend](#label-legend)
  - [Sprint Summary](#sprint-summary)
- [License](#-license)

---

## 🌟 Overview

**AUTO** provides roadside assistance and vehicle maintenance booking on mobile devices. When drivers face unexpected vehicle breakdowns, flat tires, battery drain, or require scheduled servicing, AUTO pairs them with nearby available mechanics using geohash-based radius discovery, real-time GPS tracking, instant messaging, and a cashless digital wallet.

---

## 📱 Key Features

### 👤 Customer Portal
- **Vehicle Garage**: Register and manage multiple vehicles (Make, Model, Year, Photos) with expense and service history tracking.
- **EV Health & Monitoring**: Dedicated EV telemetry display with battery level gauge and driving range status.
- **Instant Roadside Dispatch**: Pin repair location on interactive maps, select repair categories (Towing, Battery Jump, Tires, Diagnostics, Wash, Mechanical), and search for nearby online mechanics.
- **Live Mechanic Tracking**: Real-time GPS tracking with animated route polyline, distance calculations, and dynamic ETA bottom sheet.
- **In-App Messaging**: Real-time chat with online status indicators, photo attachments, and push notification alerts.
- **Digital Wallet**: In-app balance, transaction history, contactless cashless payments, and mechanic tipping.
- **Ratings & Reviews**: Post-service feedback, 5-star ratings, and review history.
- **EV Charging Discovery**: Search and route to nearby EV charging stations.

### 🔧 Mechanic Portal
- **Availability Toggle**: Go Online / Go Offline switch with throttled background location updates.
- **Job Dispatch Radar**: Incoming repair requests modal with customer distance, issue details, and instant Accept / Decline actions.
- **Turn-by-Turn Navigation**: Direct route mapping to customer's breakdown location.
- **Earnings & Wallet Dashboard**: Live payout balance, completed repairs stats, customer tips, and rating analytics.

---

## 🛠 Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Expo SDK 57](https://expo.dev/) (React Native 0.86, React 19) | Cross-platform mobile runtime & native modules |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) | File-based typed routing (`typedRoutes: true`) |
| **Language** | [TypeScript 6.0](https://www.typescriptlang.org/) | End-to-end type safety |
| **Styling & UI** | React Native StyleSheet + Themed Tokens | Dark / Light theme support & modular components |
| **Animations** | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | High-performance 60/120 FPS UI transitions |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) + Google Sign-In | Secure auth with Expo SecureStore session persistence |
| **Database** | [Cloud Firestore](https://firebase.google.com/docs/firestore) | Real-time NoSQL database with snapshot listeners |
| **Storage** | [Firebase Cloud Storage](https://firebase.google.com/docs/storage) | Secure profile avatar, vehicle, and chat photo uploads |
| **Device Storage** | `expo-secure-store` | Encrypted local token & key persistence |
| **Notifications** | [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/) | Push alerts for bookings, chat, and status updates |

### 💰 Zero-Cost Free Stack

Designed to operate entirely within free-tier resource quotas during development and MVP stages:

| Service | Purpose | Quota / Free Tier Limit |
| :--- | :--- | :--- |
| **Firebase Spark** | Auth, Firestore, Storage | 50K reads/day, 20K writes/day, 1 GB Storage |
| **Expo Push** | Mobile push notifications | Unlimited free push notifications |
| **Vercel Hobby** | Serverless notification trigger | 100K function executions/month |
| **EAS Build** | Android & iOS cloud builds | 30 free builds/month |
| **GitHub** | Code repository & CI/CD | Free unlimited public/private repositories |

> [!TIP]
> **Upgrade Trigger**: When reaching 50+ daily active users, migrate to the **Firebase Blaze** plan (pay-as-you-go) to enable Cloud Functions for server-side wallet authorization and automated status webhooks.

---

## 📂 Project Structure

```
AUTO-mechanic-mobile-booking-app/
├── .vscode/               # Workspace editor settings
├── app/                   # Expo Router file-based routes
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── _layout.tsx    # Tab navigation shell
│   │   ├── index.tsx      # Home / Booking screen
│   │   └── two.tsx        # Secondary tab / Garage screen
│   ├── _layout.tsx        # Root navigation stack & ThemeProvider
│   ├── +html.tsx          # Web root HTML template
│   ├── +not-found.tsx     # 404 handler route
│   └── modal.tsx          # Global modal overlay screen
├── assets/                # App icons, splash screens, and fonts
│   ├── fonts/             # Custom typography (SpaceMono)
│   └── images/            # Brand assets & adaptive icons
├── components/            # Reusable UI component library
│   ├── StyledText.tsx     # Custom styled text primitives
│   ├── Themed.tsx         # Themed View and Text wrappers
│   ├── AppTabs.tsx         # Top application header bar
│   └── EditScreenInfo.tsx # Screen helper component
├── config/                # Service initialization
│   └── firebaseConfig.ts  # Firebase App & Auth with SecureStore persistence
├── constants/             # Design tokens and colors
│   └── Colors.ts          # Light & Dark color palettes
├── context/               # Global state contexts
│   └── auth/              # AuthContext & AuthProvider
├── hooks/                 # Custom React hooks
│   └── useAuth.ts         # User session & profile hook
├── types/                 # TypeScript interfaces and types
│   ├── auth.ts            # User, Role, and Session types
│   └── general.ts         # Shared app interfaces
├── utils/                 # Utility functions & helpers
│   ├── renderSecrets.ts   # Safe environment variable accessor
│   └── secureStore.ts     # Expo SecureStore persistence engine
├── app.json               # Expo application configuration
├── package.json           # Project dependencies & scripts
├── tsconfig.json          # TypeScript compiler configuration
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or `v20.x` LTS recommended
- **Package Manager**: `npm`, `yarn`, or `bun`
- **Expo Go App** (iOS / Android) or configured Android Studio / Xcode Emulators
- **Firebase Project**: Firebase Spark plan (Authentication, Firestore, Storage enabled)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Uwitonzesonia/AUTO-mechanic-mobile-booking-app.git
   cd AUTO-mechanic-mobile-booking-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Populate the `.env` file with your credentials:

```env
## FIREBASE CONFIGURATION
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

## GOOGLE OAUTH CONFIGURATION
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_web_client_id
EXPO_PUBLIC_IOS_CLIENT_ID=your_google_ios_client_id
```

### Running the App

```bash
# Start Metro bundler with Expo
npm start

# Run directly on Android (Emulator or Connected Device)
npm run android

# Run directly on iOS (Simulator or Connected Device - macOS only)
npm run ios

# Run in Web Browser
npm run web
```

---

## 🗓 Roadmap & Sprint Execution Plan

The development roadmap is organized into 11 agile sprints spanning ~12 weeks:

### 🚀 Sprint 0 - Project Setup (Week 1)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `0.1` | Initialize Expo project with `expo-router`, TypeScript, and EAS | Dev A | `setup` | 2h |
| `0.2` | Set up Firebase project (Auth, Firestore, Storage) on Spark plan | Dev B | `setup` | 2h |
| `0.3` | Create Firestore security rules draft for all target collections | Dev B | `setup`, `security` | 3h |
| `0.4` | Set up shared theme & design tokens (dark/light palette, fonts, spacing) | Dev A | `setup`, `ui` | 3h |
| `0.5` | Build reusable UI primitives: `Button`, `Input`, `Card`, `Avatar`, `Badge` | Dev A | `ui`, `component` | 4h |
| `0.6` | Set up Firebase SDK wrapper (Auth helpers, Firestore helpers, typed hooks) | Dev B | `setup`, `backend` | 4h |
| `0.7` | Configure `expo-router` tab layout + stack navigators (skeleton screens) | Dev A | `setup`, `navigation` | 3h |
| `0.9` | Set up Expo Push Notifications (token registration & persistence in user doc) | Dev B | `setup`, `notifications` | 3h |
| `0.10` | Configure serverless push notification dispatcher (Vercel function / client direct) | Dev B | `setup`, `notifications` | 3h |

---

### 🔐 Sprint 1 - Auth & Profile (Week 2)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `1.1` | UI: Login screen (Phone OTP & Email authentication) | Dev A | `ui`, `auth` | 3h |
| `1.2` | UI: Sign-up screen (Name, Phone, Role selector: Customer or Mechanic) | Dev A | `ui`, `auth` | 3h |
| `1.3` | Backend: Firebase Auth integration (Email/Password + Phone OTP + Google) | Dev B | `backend`, `auth` | 4h |
| `1.4` | Backend: Automatically create `users` and `mechanics` Firestore documents upon sign-up | Dev B | `backend`, `auth` | 2h |
| `1.5` | UI: Profile screen (Avatar, Full Name, Contact info, Edit modal) | Dev A | `ui`, `profile` | 3h |
| `1.6` | Backend: Avatar photo upload to Firebase Storage with profile doc update | Dev B | `backend`, `profile` | 2h |
| `1.7` | UI: Side drawer menu (Messages, Support, Settings, Logout) | Dev A | `ui`, `navigation` | 3h |
| `1.8` | Auth state persistence with SecureStore + protected route redirects | Dev B | `backend`, `auth` | 2h |
| `1.9` | UI: Settings screen (Static layout, notification toggles, theme switch) | Dev A | `ui` | 2h |

---

### 🚘 Sprint 2 - Garage & Vehicles (Week 3)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `2.1` | UI: Garage screen - Vehicle card carousel with brand logos | Dev A | `ui`, `garage` | 4h |
| `2.2` | UI: Add/Edit vehicle form (Make, Model, Year, License Plate, Photo) | Dev A | `ui`, `garage` | 3h |
| `2.3` | Backend: Complete CRUD operations for `vehicles` subcollection | Dev B | `backend`, `garage` | 3h |
| `2.4` | Backend: Vehicle image upload pipeline to Firebase Storage | Dev B | `backend`, `garage` | 2h |
| `2.5` | UI: Vehicle expense summary & repair statistics dashboard | Dev A | `ui`, `garage` | 2h |
| `2.6` | UI: EV condition widget (Live battery gauge, driving mode, range estimate) | Dev A | `ui`, `garage` | 3h |
| `2.7` | Backend: EV telemetry sub-document read/write schema | Dev B | `backend`, `garage` | 2h |
| `2.8` | Reusable vehicle selector component for quick booking flow | Dev A | `ui`, `component` | 2h |

---

### ⚡ Sprint 3 - Home & Booking Flow (Week 4-5) `[CRITICAL PATH]`

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `3.1` | UI: Home screen - Hero vehicle carousel + personalized user greeting | Dev A | `ui`, `home` | 4h |
| `3.2` | UI: Breakdown location input (Address autocomplete + interactive map pin) | Dev A | `ui`, `booking` | 4h |
| `3.3` | UI: Vehicle picker selector modal ("Which car do you want to fix?") | Dev A | `ui`, `booking` | 2h |
| `3.4` | UI: Repair category selector (Wash, Electrical, Towing, Mechanical, Tires) | Dev A | `ui`, `booking` | 3h |
| `3.5` | UI: Service type tags (Engine, Scheduled Maintenance, Battery, Diagnostics) | Dev A | `ui`, `booking` | 2h |
| `3.6` | Backend: Create new `bookings` document schema in Firestore | Dev B | `backend`, `booking` | 3h |
| `3.7` | Backend: Client-side mechanic radius matching (Geohash queries for nearby online mechanics) | Dev B | `backend`, `booking`, `critical` | 5h |
| `3.8` | UI: Searching screen - Radar map animation + "Searching for mechanics" + slide-to-cancel | Dev A | `ui`, `booking` | 5h |
| `3.9` | Backend: Real-time booking status listener (`searching` → `matched`) | Dev B | `backend`, `booking` | 3h |
| `3.10` | UI: Booking summary screen (Mechanic bio, distance, fee breakdown, "Confirm Fix" CTA) | Dev A | `ui`, `booking` | 4h |
| `3.11` | Backend: Booking confirmation dispatcher + Expo Push alert to matched mechanic | Dev B | `backend`, `booking`, `notifications` | 3h |
| `3.12` | UI: Booking cancellation modal with reason checklist | Dev A | `ui`, `booking` | 2h |
| `3.13` | Backend: Booking cancellation handler + metric reason recording | Dev B | `backend`, `booking` | 2h |

---

### 📍 Sprint 4 - Live Tracking & Arriving (Week 5-6)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `4.1` | UI: Interactive map component with custom markers (Mechanic icon, User pin) | Dev A | `ui`, `map` | 4h |
| `4.2` | UI: Arriving screen - Live map + draggable bottom sheet (Mechanic info, ETA) | Dev A | `ui`, `tracking` | 5h |
| `4.3` | Backend: Throttled mechanic GPS updater (60-second intervals to conserve Firestore writes) | Dev B | `backend`, `tracking` | 3h |
| `4.4` | UI: Client-side marker interpolation (Smooth coordinate animation between GPS pings) | Dev A | `ui`, `tracking` | 3h |
| `4.5` | Backend: Real-time mechanic location listener for customer map | Dev B | `backend`, `tracking` | 3h |
| `4.6` | UI: Route polyline rendering (Mechanic → Customer location) | Dev A | `ui`, `map` | 3h |
| `4.7` | UI: Arriving bottom sheet action bar (Call Mechanic, Direct Chat, Cancel) | Dev A | `ui`, `tracking` | 2h |
| `4.8` | UI: Repair In Progress screen - Live status badge, repair timer, vehicle details | Dev A | `ui`, `tracking` | 4h |
| `4.9` | Backend: Booking status pipeline transitions (`arriving` → `in_progress` → `completed`) | Dev B | `backend`, `booking` | 3h |
| `4.10` | Backend: Automated Expo Push notifications dispatched on each status transition | Dev B | `backend`, `notifications` | 3h |

---

### 💬 Sprint 5 - Chat (Week 6-7)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `5.1` | UI: Chat screen - Chat bubbles, read receipts, timestamps, media attachment bar | Dev A | `ui`, `chat` | 5h |
| `5.2` | UI: Live presence indicator + Mechanic avatar header bar | Dev A | `ui`, `chat` | 2h |
| `5.3` | Backend: `chats` collection + `messages` subcollection architecture | Dev B | `backend`, `chat` | 2h |
| `5.4` | Backend: Real-time message listener with Firestore `onSnapshot` | Dev B | `backend`, `chat` | 3h |
| `5.5` | Backend: Send message handler + update `lastMessage` timestamp on parent chat doc | Dev B | `backend`, `chat` | 2h |
| `5.6` | UI: Media attachment picker (Camera capture & Gallery image selector) | Dev A | `ui`, `chat` | 3h |
| `5.7` | Backend: Chat photo upload to Storage + message payload type `image` | Dev B | `backend`, `chat` | 3h |
| `5.8` | Backend: Send Push notification on incoming chat message (background alert) | Dev B | `backend`, `chat`, `notifications` | 2h |
| `5.9` | UI: Messages inbox screen (List of all active & past conversations) | Dev A | `ui`, `chat` | 3h |

---

### 💳 Sprint 6 - Wallet & Payments (Week 7-8)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `6.1` | UI: Wallet screen - Modern gradient balance card, Quick Action buttons (Send, Top-up) | Dev A | `ui`, `wallet` | 4h |
| `6.2` | UI: Transaction history list (Amount, date, status, service type thumbnail) | Dev A | `ui`, `wallet` | 3h |
| `6.3` | UI: Frequent contacts avatar row for fast peer-to-peer transfers | Dev A | `ui`, `wallet` | 2h |
| `6.4` | Backend: `wallets` collection + `transactions` subcollection data structure | Dev B | `backend`, `wallet` | 3h |
| `6.5` | Backend: Atomic client-side Firestore `runTransaction` for wallet transfers | Dev B | `backend`, `wallet`, `critical` | 4h |
| `6.6` | Backend: Client-side batch write: Deduct wallet balance & mark booking as paid | Dev B | `backend`, `wallet` | 3h |
| `6.7` | UI: Payment method selector on booking confirmation (Cash / In-App Wallet) | Dev A | `ui`, `wallet` | 2h |
| `6.8` | Backend: Mock wallet top-up flow for MVP demonstration | Dev B | `backend`, `wallet` | 2h |
| `6.9` | UI: Digital debit card detail screen with card flip animation | Dev A | `ui`, `wallet` | 2h |
| `6.10` | Backend: Firestore security rules - Wallet hardening (`balance >= 0`, owner-only writes) | Dev B | `backend`, `security`, `critical` | 4h |

---

### ⭐ Sprint 7 - Reviews, Tips & Rating (Week 8)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `7.1` | UI: Post-service Tip & Review screen - 5-star selector, tip presets, review input | Dev A | `ui`, `review` | 3h |
| `7.2` | Backend: Atomic batch write: Commit review document & recalculate mechanic rating average | Dev B | `backend`, `review` | 3h |
| `7.3` | UI: Reusable star rating selector component with tap & drag gestures | Dev A | `ui`, `component` | 2h |
| `7.4` | Backend: Tip processing - Credit tip amount directly to mechanic's wallet via transaction | Dev B | `backend`, `wallet` | 2h |
| `7.5` | UI: Dynamic rating badge display on mechanic cards (Star score + total reviews) | Dev A | `ui`, `component` | 1h |

---

### 🔧 Sprint 8 - Mechanic Dashboard (Week 9)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `8.1` | UI: Mechanic Home screen - Earnings summary card, star rating, completed repairs count | Dev A | `ui`, `mechanic` | 4h |
| `8.2` | UI: Animated "Go Online / Go Offline" availability switch button | Dev A | `ui`, `mechanic` | 2h |
| `8.3` | Backend: Availability toggle logic (`isOnline`) + start/stop background location service | Dev B | `backend`, `mechanic` | 3h |
| `8.4` | UI: Active jobs & services queue (Customer info, vehicle details, destination) | Dev A | `ui`, `mechanic` | 3h |
| `8.5` | Backend: Real-time listener for incoming booking dispatch requests | Dev B | `backend`, `mechanic` | 3h |
| `8.6` | UI: Incoming job modal alert with 30s countdown timer (Accept / Decline) | Dev A | `ui`, `mechanic` | 3h |
| `8.7` | Backend: Accept job handler → Update booking state to `matched` + trigger navigation | Dev B | `backend`, `mechanic` | 3h |
| `8.8` | Backend: Background location task tracking via `expo-task-manager` (60s throttle) | Dev B | `backend`, `mechanic`, `critical` | 5h |

---

### 🔋 Sprint 9 - EV Charging Stations (Week 10)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `9.1` | UI: EV Charging station finder screen - Map view + station carousel cards | Dev A | `ui`, `ev` | 4h |
| `9.2` | UI: Charging station details card (Charger type, distance, availability, charging speeds) | Dev A | `ui`, `ev` | 2h |
| `9.3` | Backend: Seed initial `evStations` Firestore collection with location coordinates | Dev B | `backend`, `ev` | 2h |
| `9.4` | Backend: Nearby charging station discovery query using client-side geohashes | Dev B | `backend`, `ev` | 3h |
| `9.5` | UI: Route calculation to station with EV battery reach indicator | Dev A | `ui`, `ev` | 3h |
| `9.6` | UI: Quick shortcut link from Garage screen to EV controller and charger finder | Dev A | `ui`, `ev` | 1h |

---

### 🛡️ Sprint 10 - Polish, Security & QA (Week 11-12)

| # | Task / Card | Owner | Labels | Est. Time |
| :---: | :--- | :---: | :--- | :---: |
| `10.1` | UI: Help & Support screen (Categorized FAQ accordion, contact form) | Dev A | `ui` | 3h |
| `10.2` | UI: Standardized loading skeletons across all screens | Dev A | `ui`, `polish` | 4h |
| `10.3` | UI: Empty state illustrations (No vehicles, no active bookings, no chat messages) | Dev A | `ui`, `polish` | 3h |
| `10.4` | UI: Global error boundary + animated toast notification alerts | Dev A | `ui`, `polish` | 3h |
| `10.5` | Backend: Complete Firestore security rules suite - Comprehensive testing & validation | Dev B | `backend`, `security` | 5h |
| `10.6` | Backend: Quota usage monitoring (Daily read/write analytics against free-tier limits) | Dev B | `backend`, `monitoring` | 3h |
| `10.7` | Full end-to-end integration test: Sign-up → Add Vehicle → Book → Track → Chat → Pay → Review | Both | `testing` | 6h |
| `10.8` | Performance optimization (Firestore read counts, image compression, map re-renders) | Dev B | `testing`, `performance` | 4h |
| `10.9` | Prepare app store metadata & visual assets (Screenshots, banners, descriptions) | Dev A | `release` | 3h |
| `10.10` | EAS Production build & submission to Apple TestFlight and Google Play Console Internal Track | Dev B | `release`, `devops` | 3h |

---

## 📊 Trello Board & Workflow Guide

### Board Lists (Workflow Columns)

Tasks progress through the following lifecycle columns:

```
[ 📥 Backlog ] ──► [ 🗓️ Sprint X ] ──► [ ⚙️ In Progress ] ──► [ 🔍 Code Review ] ──► [ 🧪 Testing ] ──► [ ✅ Done ]
```

### Label Legend

| Label | Color Badge | Category / Description |
| :--- | :---: | :--- |
| `setup` | 🟢 Green | Project configuration, infrastructure, and toolchain |
| `ui` | 🔵 Blue | Frontend interface, design tokens, screens, and layouts |
| `backend` | 🟠 Orange | Firestore schemas, queries, and client-side database logic |
| `critical` | 🔴 Red | High-priority blocking tasks on the critical path |
| `component` | 🟣 Purple | Modular, reusable UI components and design system elements |
| `client-side` | 🌸 Pink | Logic executed on device to preserve Firebase Spark tier |
| `security` | 🟤 Brown | Firestore security rules, authentication, and access control |
| `notifications`| 🐬 Teal | Expo Push notification hooks and background workers |
| `monitoring` | 🟡 Yellow | Quota tracking, rate limits, and analytics |
| `testing` | 🟡 Yellow | Quality assurance, integration tests, and manual testing |
| `polish` | ⚪ White | UX polish, micro-interactions, skeleton screens, and error handling |
| `release` | ⚫ Black | App Store / Play Store deployment and EAS release builds |

### Sprint Summary

| Sprint | Focus Theme | Duration | Total Cards |
| :---: | :--- | :---: | :---: |
| **0** | Project Setup & Infrastructure | 1 week | 10 |
| **1** | Authentication & Profile Management | 1 week | 9 |
| **2** | Vehicle Garage & EV Condition | 1 week | 8 |
| **3** | Home & Roadside Booking Flow ⚡ | 2 weeks | 13 |
| **4** | Live Map Tracking & Arrival | 1.5 weeks | 10 |
| **5** | Real-Time Chat & Media Attachments | 1 week | 9 |
| **6** | In-App Wallet & Cashless Payments | 1.5 weeks | 10 |
| **7** | Reviews, Tips & Ratings | 0.5 week | 5 |
| **8** | Mechanic Portal & Dispatch Dashboard | 1 week | 8 |
| **9** | EV Charging Station Discovery | 1 week | 6 |
| **10** | Hardening, Security, QA & Release | 2 weeks | 10 |
| **Total** | **Full Application MVP** | **~12 weeks** | **98 cards** |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
