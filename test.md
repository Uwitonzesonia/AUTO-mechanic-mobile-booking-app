# 🧪 Testing Guidance Guide: Jest, React Native Testing Library & Maestro

Comprehensive testing guide for the **AUTO Mechanic** mobile application (Expo SDK 57, React Native 0.86, TypeScript).

---

## 📑 Table of Contents
1. [Overview & Testing Strategy](#1-overview--testing-strategy)
2. [Setup & Installed Packages](#2-setup--installed-packages)
3. [Configuration (`package.json`)](#3-configuration-packagejson)
4. [File Structure & Conventions](#4-file-structure--conventions)
5. [Testing Patterns with Codebase Examples](#5-testing-patterns-with-codebase-examples)
   - [5.1 Pure Utility Functions](#51-pure-utility-functions)
   - [5.2 UI Component Testing](#52-ui-component-testing)
   - [5.3 Gesture & Slider Testing (`SlideToCancelButton`)](#53-gesture--slider-testing-slidetocancelbutton)
   - [5.4 Header & Navigation Fallbacks (`TransparentHeaderCard`)](#54-header--navigation-fallbacks-transparentheadercard)
   - [5.5 Custom Hooks with Fake Timers (`useMechanicMovement`)](#55-custom-hooks-with-fake-timers-usemechanicmovement)
   - [5.6 Coordinator & Navigation Exits (`useMaintenanceCoordinator`)](#56-coordinator--navigation-exits-usemaintenancecoordinator)
   - [5.7 Native Modules & Expo Router Mocking](#57-native-modules--expo-router-mocking)
6. [Maestro E2E Testing Flows](#6-maestro-e2e-testing-flows)
7. [Running Tests & CLI Commands](#7-running-tests--cli-commands)
8. [Troubleshooting & Best Practices](#8-troubleshooting--best-practices)

---

## 1. Overview & Testing Strategy

In this application, testing is divided into three tiers:

```
                  ┌────────────────────────┐
                  │   E2E Tests (Maestro)  │  --> Full app flow on phone / emulator
                  ├────────────────────────┤
                  │ Component UI (Jest)    │  --> Renders elements in memory (RNTL)
                  ├────────────────────────┤
                  │ Unit Tests (Jest)      │  --> Pure functions, math & custom hooks
                  └────────────────────────┘
```

- **Jest**: The test runner providing assertions (`expect`), test suites (`describe`, `test`), and lifecycle hooks (`beforeEach`, `afterEach`).
- **React Native Testing Library (`@testing-library/react-native`)**: Renders components into a virtual DOM tree to assert visible text, accessibility labels, and simulate touch/press events.
- **Maestro**: Declarative YAML-driven blackbox end-to-end testing executing real gestures on Android and iOS devices.

---

## 2. Setup & Installed Packages

The application already includes the required testing dependencies in `devDependencies`:

```bash
npm install --save-dev jest jest-expo @types/jest @testing-library/react-native react-test-renderer
```

### Dependency Breakdown:
| Package | Role |
| :--- | :--- |
| `jest` | Core test runner and assertion framework |
| `jest-expo` | Pre-configured preset with native Expo module mocks |
| `@testing-library/react-native` | User-centric React Native component testing utilities |
| `@types/jest` | TypeScript type declarations for test globals |
| `react-test-renderer` | Required by React Native Testing Library for tree rendering |

---

## 3. Configuration (`package.json`)

The project configures Jest using the official `jest-expo` preset:

```json
{
  "scripts": {
    "test": "jest --watchAll",
    "test:ci": "jest --watchAll=false",
    "test:coverage": "jest --watchAll=false --coverage"
  },
  "jest": {
    "preset": "jest-expo"}
}
```

## 4. File Structure & Conventions

Keep test files either adjacent to source files inside `__tests__` directories or with `.test.ts` / `.test.tsx` extensions:

```
__tests__/
└── onboarding-screen-test.tsx
components/
├── maintenance/
│   ├── SlideToCancelButton.tsx
│   ├── TransparentHeaderCard.tsx
│   ├── detail/
│   │   ├── MechanicArrivingCard.tsx
│   │   ├── types.ts
│   │   └── __tests__/
│   │       ├── MechanicArrivingCard.test.tsx
│   │       └── types.test.ts
│   └── __tests__/
│       ├── SlideToCancelButton.test.tsx
│       └── TransparentHeaderCard.test.tsx
hooks/
├── useMaintenanceCoordinator.ts
├── useMechanicMovement.ts
└── __tests__/
    ├── useMaintenanceCoordinator.test.ts
    └── useMechanicMovement.test.ts
```

---

## 5. Testing Patterns with Codebase Examples

### 5.1 Pure Utility Functions
Pure functions are the easiest to test because they do not depend on React state or native devices.

#### Example: Testing `formatDistance`
File: `components/maintenance/detail/__tests__/types.test.ts`  
Source: [`components/maintenance/detail/types.ts`](./components/maintenance/detail/types.ts)

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
Source: [`components/maintenance/detail/MechanicArrivingCard.tsx`](./components/maintenance/detail/MechanicArrivingCard.tsx)

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

    expect(screen.getByText('Arriving 4min')).toBeTruthy();
    expect(screen.getByText('800 m away')).toBeTruthy();
    expect(screen.getByText('Eric Nshimiyimana')).toBeTruthy();

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

    expect(screen.getByText('Arrived')).toBeTruthy();
    expect(screen.getByText('5 m away')).toBeTruthy();
    expect(screen.getByText('Vehicle check in progress')).toBeTruthy();
    expect(
      screen.getByText('Awaiting Autohelp repair info for your confirmation.')
    ).toBeTruthy();

    expect(screen.queryByLabelText('Call mechanic')).toBeNull();
    expect(screen.queryByLabelText('Chat with mechanic')).toBeNull();
  });
});
```

---

### 5.3 Gesture & Slider Testing (`SlideToCancelButton`)
Verifies that the draggable slide-to-cancel knob responds to PanResponder handlers, renders accessible labels, and invokes `onCancel` upon exceeding the slide threshold.

File: `components/maintenance/__tests__/SlideToCancelButton.test.tsx`  
Source: [`components/maintenance/SlideToCancelButton.tsx`](./components/maintenance/SlideToCancelButton.tsx)

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { SlideToCancelButton } from '../SlideToCancelButton';

describe('<SlideToCancelButton />', () => {
  test('renders slider track with label and accessibility role', () => {
    render(<SlideToCancelButton onCancel={jest.fn()} />);

    expect(screen.getByLabelText('Slide to cancel')).toBeTruthy();
    expect(screen.getByText('Slide to cancel')).toBeTruthy();
  });

  test('cleans up timeout timer on unmount without warnings', () => {
    jest.useFakeTimers();
    const onCancel = jest.fn();
    const { unmount } = render(<SlideToCancelButton onCancel={onCancel} />);

    unmount();
    jest.runOnlyPendingTimers();
    expect(onCancel).not.toHaveBeenCalled();
    jest.useRealTimers();
  });
});
```

---

### 5.4 Header & Navigation Fallbacks (`TransparentHeaderCard`)
Verifies that the header's back button and slider trigger provided props or fall back to dismiss all screens and replace navigation to `/(drawer)/(tabs)`.

File: `components/maintenance/__tests__/TransparentHeaderCard.test.tsx`  
Source: [`components/maintenance/TransparentHeaderCard.tsx`](./components/maintenance/TransparentHeaderCard.tsx)

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TransparentHeaderCard } from '../TransparentHeaderCard';

const mockDismissAll = jest.fn();
const mockCanDismiss = jest.fn().mockReturnValue(true);
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    dismissAll: mockDismissAll,
    canDismiss: mockCanDismiss,
    replace: mockReplace,
    push: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(false),
  }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { photoURL: null },
    userProfile: { fullName: 'Test Driver' },
  }),
}));

describe('<TransparentHeaderCard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('invokes onBackPress when back button is pressed', () => {
    const handleBack = jest.fn();
    render(<TransparentHeaderCard onBackPress={handleBack} />);

    fireEvent.press(screen.getByLabelText('Go back'));
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  test('falls back to dismissAll and replace to /(drawer)/(tabs) when no handler is provided', () => {
    render(<TransparentHeaderCard />);

    fireEvent.press(screen.getByLabelText('Go back'));
    expect(mockDismissAll).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/(drawer)/(tabs)');
  });
});
```

---

### 5.5 Custom Hooks with Fake Timers (`useMechanicMovement`)
When hooks use `setInterval` or `setTimeout` (like live GPS simulation), use `jest.useFakeTimers()` to control time without waiting real seconds.

File: `hooks/__tests__/useMechanicMovement.test.ts`  
Source: [`hooks/useMechanicMovement.ts`](./hooks/useMechanicMovement.ts)

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

### 5.6 Coordinator & Navigation Exits (`useMaintenanceCoordinator`)
Validates that `handleBackPress` and `handleCancelPress` pop all nested stack entries and return directly to the originating tab (`fromTab`), such as `/garage` or `/`.

File: `hooks/__tests__/useMaintenanceCoordinator.test.ts`  
Source: [`hooks/useMaintenanceCoordinator.ts`](./hooks/useMaintenanceCoordinator.ts)

```ts
import { renderHook, act } from '@testing-library/react-native';
import { useMaintenanceCoordinator } from '../useMaintenanceCoordinator';

const mockReplace = jest.fn();
const mockDismissAll = jest.fn();
const mockCanDismiss = jest.fn().mockReturnValue(true);
const mockSetParams = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    dismissAll: mockDismissAll,
    canDismiss: mockCanDismiss,
    setParams: mockSetParams,
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    fromTab: 'garage',
    bookedMechanicId: 'mech-1',
  }),
}));

describe('useMaintenanceCoordinator navigation exits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handleCancelPress dismisses stack and returns to the originating tab (/garage)', () => {
    const { result } = renderHook(() => useMaintenanceCoordinator());

    act(() => {
      result.current.handleCancelPress();
    });

    expect(mockDismissAll).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/(drawer)/(tabs)/garage');
  });

  test('handleBackPress dismisses stack and returns to the originating tab (/garage)', () => {
    const { result } = renderHook(() => useMaintenanceCoordinator());

    act(() => {
      result.current.handleBackPress();
    });

    expect(mockDismissAll).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/(drawer)/(tabs)/garage');
  });
});
```

---

### 5.7 Native Modules & Expo Router Mocking

Create a `jest.setup.js` file or mock directly in your test suites:

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
    dismiss: jest.fn(),
    dismissAll: jest.fn(),
    canDismiss: jest.fn().mockReturnValue(false),
    canGoBack: jest.fn().mockReturnValue(false),
    setParams: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useNavigation: () => ({
    setOptions: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  }),
}));
```

---

## 6. Maestro E2E Testing Flows

Maestro allows writing concise YAML scripts to test full flows on physical devices and emulators.

### Example: Booking and Slide-to-Cancel Flow
File: `.maestro/maintenance_cancel_flow.yaml`

```yaml
appId: com.bunsenplus.automechanic
---
- launchApp
- assertVisible: "Home Screen"

# Open repair modal via center wrench button
- tapOn:
    id: "wrench-center-tab-button"
- assertVisible: "REPAIR LOCATION"

# Start search
- tapOn: "Start Search"
- assertVisible: "Slide to cancel"

# Select mechanic pin & confirm
- tapOn:
    point: "50%,50%"
- assertVisible: "Fixes"
- tapOn:
    accessibilityLabel: "Select .*"

# Book fix on booking screen
- assertVisible: "Booking info"
- tapOn: "Book a fix"

# Verify arriving card & live ETA
- assertVisible: "Arriving .*"
- assertVisible: "away"

# Slide to cancel
- swipe:
    start: "30%,8%"
    end: "70%,8%"

# Assert return to previous tab
- assertVisible: "Home Screen"
```

---

## 7. Running Tests & CLI Commands

| Command | Action |
| :--- | :--- |
| `npm test` | Run tests in interactive watch mode (`jest --watchAll`) |
| `npx jest --watchAll=false` | Execute all test suites once (CI mode) |
| `npx jest types.test.ts --watchAll=false` | Run a specific test file |
| `npx jest -t "arrived at 5m" --watchAll=false` | Run tests matching a regex name pattern |
| `npm run test:coverage` | Generate code coverage HTML table |
| `npx tsc --noEmit` | Check for static TypeScript type errors |

---

## 8. Troubleshooting & Best Practices

1. **`getBy...` vs `queryBy...`**:
   - Use `screen.getByText(...)` or `screen.getByLabelText(...)` when an element **must exist** (throws if absent).
   - Use `screen.queryByText(...)` when asserting that an element **does not exist** (`expect(...).toBeNull()`).

2. **Wrap State Updates in `act()`**:
   - When triggering fake timers (`jest.advanceTimersByTime`) or async responses, wrap in `act(() => { ... })` to avoid React warning messages.

3. **Avoid Testing Implementation Details**:
   - Don't assert internal state variables. Check what is rendered on screen or verify that callback functions are called when user actions occur.

4. **Always Clean Up Timers & Animations**:
   - Components that utilize `setTimeout` inside animations (such as `SlideToCancelButton`) should store the timer in a `useRef` and clear it inside the `useEffect` cleanup return to prevent unmounted component memory leaks.
