# 🧪 Testing Guidance Guide: Jest & React Native Testing Library

Comprehensive testing guide for the **AUTO** mobile application (Expo SDK 57, React Native 0.86, TypeScript).

---

## 📑 Table of Contents
1. [Overview & Testing Strategy](#1-overview--testing-strategy)
2. [Setup & Installation](#2-setup--installation)
3. [Configuration](#3-configuration)
4. [File Structure & Conventions](#4-file-structure--conventions)
5. [Testing Patterns with Codebase Examples](#5-testing-patterns-with-codebase-examples)
   - [5.1 Pure Utility Functions](#51-pure-utility-functions)
   - [5.2 UI Component Testing](#52-ui-component-testing)
   - [5.3 Custom Hooks with Fake Timers](#53-custom-hooks-with-fake-timers)
   - [5.4 Mocking Native Modules](#54-mocking-native-modules)
6. [Running Tests & CLI Commands](#6-running-tests--cli-commands)
7. [Troubleshooting & Best Practices](#7-troubleshooting--best-practices)

---

## 1. Overview & Testing Strategy

In this application, tests are divided into three tiers:

```
                  ┌──────────────────────┐
                  │   E2E Tests (Maestro)│  --> Full app flow on phone/emulator
                  ├──────────────────────┤
                  │ Component UI (Jest)  │  --> Renders components in memory
                  ├──────────────────────┤
                  │ Unit Tests (Jest)    │  --> Pure functions, math & hooks
                  └──────────────────────┘
```

- **Jest**: The test runner providing assertions (`expect`), test suites (`describe`, `test`), and lifecycle hooks (`beforeEach`, `afterEach`).
- **React Native Testing Library (`@testing-library/react-native`)**: Renders React Native elements into a virtual tree in Node.js to assert text, accessibility labels, and simulate button taps.

---

## 2. Setup & Installation

When you are ready to install the testing dependencies, run the following command in your terminal:

```bash
npm install --save-dev jest jest-expo @types/jest @testing-library/react-native react-test-renderer
```

### Dependency Breakdown:
| Package | Role |
| :--- | :--- |
| `jest` | Core test runner and assertion framework |
| `jest-expo` | Pre-configured preset with native Expo module mocks |
| `@testing-library/react-native` | User-centric React Native component testing utilities |
| `@types/jest` | TypeScript type declarations for test global functions |
| `react-test-renderer` | Required by React Native Testing Library for tree rendering |

---

## 3. Configuration

Add the `test` scripts and `jest` preset configuration into your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@react-native-vector-icons/.*)"
    ],
    "setupFilesAfterEnv": [
      "@testing-library/react-native/extend-expect"
    ]
  }
}
```

> [!TIP]
> The `transformIgnorePatterns` array ensures Babel compiles modern ESM packages (such as `@react-native-vector-icons` and Expo modules) so Jest can execute them in Node.js.

---

## 4. File Structure & Conventions

Keep test files adjacent to the source code they test inside a `__tests__` directory or with a `.test.ts` / `.test.tsx` extension:

```
components/
├── maintenance/
│   ├── detail/
│   │   ├── MechanicArrivingCard.tsx
│   │   ├── types.ts
│   │   └── __tests__/
│   │       ├── MechanicArrivingCard.test.tsx
│   │       └── types.test.ts
│   └── TwoGearsSpinner.tsx
hooks/
├── useMechanicMovement.ts
└── __tests__/
    └── useMechanicMovement.test.ts
services/
├── mapbox.ts
└── __tests__/
    └── mapbox.test.ts
```

---

## 5. Testing Patterns with Codebase Examples

### 5.1 Pure Utility Functions
Pure functions are the easiest to test because they do not depend on React state or native devices.

#### Example: Testing `formatDistance`
File: `components/maintenance/detail/__tests__/types.test.ts`
Source: `components/maintenance/detail/types.ts`

```ts
import { formatDistance } from '../types';

describe('formatDistance()', () => {
  test('returns exact meters when distance is 5m', () => {
    expect(formatDistance(undefined, 5)).toBe('5 m');
  });

  test('formats in meters when under 1000m', () => {
    expect(formatDistance(undefined, 350)).toBe('350 m');
    expect(formatDistance(undefined, 999)).toBe('999 m');
  });

  test('formats in kilometers when 1000m or more', () => {
    expect(formatDistance(undefined, 1000)).toBe('1.0 km');
    expect(formatDistance(undefined, 1850)).toBe('1.9 km');
  });

  test('handles null and undefined values safely', () => {
    expect(formatDistance(null, null)).toBe('0.0 km');
    expect(formatDistance(undefined, undefined)).toBe('0.0 km');
    expect(formatDistance(2.5, null)).toBe('2.5 km');
  });
});
```

---

### 5.2 UI Component Testing
Component tests verify what users actually see and interact with.

#### Example: Testing `MechanicArrivingCard`
File: `components/maintenance/detail/__tests__/MechanicArrivingCard.test.tsx`
Source: `components/maintenance/detail/MechanicArrivingCard.tsx`

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MechanicArrivingCard } from '../MechanicArrivingCard';
import type { Mechanic } from '@/types/mechanic';

const mockMechanic: Mechanic = {
  id: 'mech-101',
  names: 'Eric Nshimiyimana',
  rating: 4.9,
  expertise: ['Engine diagnostics', 'Brakes'],
  telephone: '250788123456',
  years_experience: 7,
  is_online: true,
};

describe('<MechanicArrivingCard />', () => {
  test('renders in moving state with ETA and action buttons', () => {
    const handleCall = jest.fn();
    const handleChat = jest.fn();

    render(
      <MechanicArrivingCard
        mechanic={mockMechanic}
        distanceMeters={800}
        durationText="4min"
        isArrived={false}
        onCall={handleCall}
        onChat={handleChat}
      />
    );

    // Assert texts
    expect(screen.getByText('Arriving 4min')).toBeTruthy();
    expect(screen.getByText('800 m away')).toBeTruthy();
    expect(screen.getByText('Eric Nshimiyimana')).toBeTruthy();

    // Assert action buttons exist and respond to taps
    const callButton = screen.getByLabelText('Call mechanic');
    expect(callButton).toBeTruthy();
    fireEvent.press(callButton);
    expect(handleCall).toHaveBeenCalledWith(mockMechanic);
  });

  test('replaces action buttons with vehicle check row when arrived at 5m', () => {
    render(
      <MechanicArrivingCard
        mechanic={mockMechanic}
        distanceMeters={5}
        isArrived={true}
      />
    );

    // Assert arrival header updates
    expect(screen.getByText('Arrived')).toBeTruthy();
    expect(screen.getByText('5 m away')).toBeTruthy();

    // Assert new status row elements
    expect(screen.getByText('Vehicle check in progress')).toBeTruthy();
    expect(
      screen.getByText('Awaiting Autohelp repair info for your confirmation.')
    ).toBeTruthy();

    // Assert old action buttons are removed
    expect(screen.queryByLabelText('Call mechanic')).toBeNull();
    expect(screen.queryByLabelText('Chat with mechanic')).toBeNull();
    expect(screen.queryByLabelText('Cancel mechanic')).toBeNull();
  });
});
```

---

### 5.3 Custom Hooks with Fake Timers
When hooks use `setInterval` or `setTimeout` (like live GPS simulation), use `jest.useFakeTimers()` to control time without waiting real seconds.

#### Example: Testing `useMechanicMovement`
File: `hooks/__tests__/useMechanicMovement.test.ts`
Source: `hooks/useMechanicMovement.ts`

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useMechanicMovement } from '../useMechanicMovement';

describe('useMechanicMovement()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRoute = {
    coordinates: [
      { latitude: -1.9441, longitude: 30.0619 },
      { latitude: -1.9500, longitude: 30.0700 },
    ],
    distanceMeters: 1000,
    distanceKm: 1.0,
    durationSeconds: 300,
    durationMinutes: 5,
    formattedDistance: '1.0 km',
    formattedDuration: '5 min',
  };

  test('does not animate if isBooked is false', () => {
    const { result } = renderHook(() =>
      useMechanicMovement({
        isBooked: false,
        route: mockRoute,
      })
    );

    expect(result.current.isArrived).toBe(false);
    expect(result.current.currentLocation).toBeNull();
  });

  test('progresses along the path and stops at 5m', () => {
    const { result } = renderHook(() =>
      useMechanicMovement({
        isBooked: true,
        route: mockRoute,
        durationMs: 10000,
        stopDistanceMeters: 5,
      })
    );

    // Fast-forward initial 700ms camera delay + 10000ms animation
    act(() => {
      jest.advanceTimersByTime(11000);
    });

    expect(result.current.isArrived).toBe(true);
    expect(result.current.remainingDistanceMeters).toBe(5);
    expect(result.current.remainingDurationText).toBe('Arrived');
  });
});
```

---

### 5.4 Mocking Native Modules
Libraries with native Android/iOS code (like Google Maps or Expo Router) must be mocked in Jest.

Create a `jest.setup.js` file if needed:

```js
// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MockMapView = (props) => <View testID="mock-map-view" {...props} />;
  const MockMarker = (props) => <View testID="mock-marker" {...props} />;
  const MockPolyline = (props) => <View testID="mock-polyline" {...props} />;
  return {
    __esModule: true,
    default: MockMapView,
    Marker: MockMarker,
    Polyline: MockPolyline,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    setParams: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
}));
```

---

## 6. Running Tests & CLI Commands

| Command | Action |
| :--- | :--- |
| `npm test` | Run all test suites once |
| `npm run test:watch` | Run in watch mode (re-runs when code changes) |
| `npm test types.test.ts` | Run only a specific test file |
| `npm test -- -t "arrived at 5m"` | Run tests matching a specific name pattern |
| `npm run test:coverage` | Generate code coverage report (HTML table) |

---

## 7. Troubleshooting & Best Practices

1. **`getBy...` vs `queryBy...`**:
   - Use `screen.getByText(...)` when an element **must exist** (throws if absent).
   - Use `screen.queryByText(...)` when asserting that an element **does not exist** (`expect(...).toBeNull()`).

2. **Wrap State Updates in `act()`**:
   - When triggering timers (`jest.advanceTimersByTime`) or async responses, wrap in `act(() => { ... })` to avoid React warning messages.

3. **Avoid Testing Implementation Details**:
   - Don't check internal state variables. Check what is rendered on screen or what callbacks are fired when buttons are tapped.
