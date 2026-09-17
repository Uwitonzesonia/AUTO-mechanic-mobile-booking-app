# iOS Testing with `native-sim` and `@expo/fingerprint`

This guide explains how to build, cache, and test the **AUTO Mechanic** app on a real iOS Simulator from a Windows machine using **`native-sim`** and **`@expo/fingerprint`**.

---

## 1. Overview & Architecture

Because Apple's iOS Simulator and Xcode tools require macOS, developers on Windows cannot run local iOS simulators directly. 

**`native-sim`** solves this by:
1. Pushing your repository state to GitHub.
2. Triggering a GitHub Actions workflow on an Apple Silicon macOS runner (`macos-26`).
3. Generating a native hash with **`@expo/fingerprint`** to cache and restore the compiled `.app`.
4. Booting the iOS Simulator on the runner and streaming its display back to your browser in real time via `@expo/serve-sim`.
5. Exposing an optional `agent-device` proxy so AI coding agents can interact with the simulator.

```
┌─────────────────┐       git push / gh dispatch       ┌──────────────────────────────┐
│  Windows Local  │ ─────────────────────────────────> │  GitHub Actions macOS Runner │
│  (native-sim)   │                                    │  - @expo/fingerprint         │
└─────────────────┘                                    │  - xcodebuild / cache        │
         ▲                                             │  - xcrun simctl boot         │
         │           Tunnel Stream (MJPEG / WebRTC)    │  - @expo/serve-sim           │
         └──────────────────────────────────────────── └──────────────────────────────┘
```

---

## 2. How `@expo/fingerprint` Caching Works

`@expo/fingerprint` generates a deterministic hash representing only the **native build inputs**:
* Native modules in `package.json` and CocoaPods podspecs.
* Config plugins (Firebase, Google Sign-In, Location, etc.) in [`app.config.ts`](./app.config.ts).
* Native directories (`ios/` if present) and iOS permissions.

### Caching Behavior in CI:
* **Cold Build (Cache Miss)**: When running for the first time or when native dependencies/config change, the runner runs `npx expo prebuild`, compiles the project with `xcodebuild`, and saves the `.app` to GitHub Actions cache under `native-sim-app-macOS-<hash>`. (Takes ~10–15 minutes).
* **Warm Build (Cache Hit)**: When only React Native components, hooks, styles, or screens change, the native fingerprint hash stays identical. The runner restores the compiled `.app` instantly from cache and updates only the JS bundle via `npx expo export:embed`. (Takes ~1–2 minutes).

---

## 3. Project Configuration & Files

The project has been configured with the following files and scripts:

### Workflow and Gate Scripts
* **[`.github/workflows/native-sim.yml`](./.github/workflows/native-sim.yml)**: Workflow that provisions the macOS runner, manages fingerprint caching, boots the simulator, and starts the tunnel.
* **[`.github/native-sim/gate.cjs`](./.github/native-sim/gate.cjs)**: Authentication gate to ensure only authorized connections can view and control the simulator.

### Windows Compatibility Script
* **[`scripts/patch-native-sim.js`](./scripts/patch-native-sim.js)**: Automatically patches `native-sim` upon `npm install` (`postinstall`) so that it works cross-platform on Windows (`where` instead of `which`, and Windows URL launcher).

### NPM Scripts in [`package.json`](./package.json)

| Command | Action |
| :--- | :--- |
| `npm run sim` | Launches the remote iOS simulator stream (`native-sim up --public --agent`) |
| `npm run sim:status` | Shows the active simulator session and tunnel stream URL |
| `npm run sim:down` | Cancels the remote runner and tears down the stream |
| `npm run fingerprint:ios` | Generates the iOS native fingerprint JSON and hash |
| `npm run fingerprint` | Generates full project fingerprint details |

---

## 4. How to Run It

Whenever you want to test the app on the remote iOS Simulator from Windows:

### Step 1: Ensure Changes are Committed & Pushed
GitHub's `workflow_dispatch` API triggers workflows from your repository's default branch (`main`). Ensure your latest code is pushed:
```powershell
git push origin main
```

### Step 2: Start the Simulator
```powershell
npm run sim
```

This command will:
1. Push any outstanding commits to the remote repository.
2. Dispatch the `native-sim` workflow on GitHub Actions.
3. Wait for the macOS runner to spin up and report the stream tunnel URL.

### Step 3: Test in Your Browser
Once ready, the console outputs:
```text
  ● Simulator is live
  https://xxxx.trycloudflare.com/?k=<gate-token>

  Anyone with that link can drive the simulator.
  Stop it early with: native-sim down
```
* Click or copy the URL to your browser.
* You can click, drag, scroll, and type into the interactive iOS Simulator directly inside your browser window.

### Step 4: Check Session Status (Optional)
If you lose the link or close your browser tab:
```powershell
npm run sim:status
```

### Step 5: Teardown Session
When you are done testing, always stop the runner to save GitHub Actions runner minutes:
```powershell
npm run sim:down
```

---

## 5. (Optional) Control via AI Agent (`agent-device`)

Because `--agent` is enabled by default in `npm run sim`, the `agent-device` proxy is exposed on the same tunnel:

```bash
agent-device connect proxy \
  --daemon-base-url https://xxxx.trycloudflare.com/agent-device \
  --daemon-auth-token <gate-token>
```

You can then inspect elements, capture screenshots, and automate interactions:
```bash
agent-device devices --platform ios
agent-device open com.bunsenplus.automechanic --platform ios
agent-device snapshot -i
```

---

## 6. Known Issues & Troubleshooting

### Issue 1: `'native-sim' is not recognized as an internal or external command`
* **Cause**: `native-sim` is not in `devDependencies` or dependencies have not been installed.
* **Fix**: Ensure `"native-sim": "^0.1.0"` is in `devDependencies` and run `npm install`. The `postinstall` script [`scripts/patch-native-sim.js`](./scripts/patch-native-sim.js) will automatically apply Windows compatibility patches.

---

### Issue 2: `[react-native-firebase] SPM + static linkage is not supported`
* **Cause**: React Native Firebase defaults to Swift Package Manager (SPM), which fails when combined with static library/framework linkage in Expo.
* **Fix**: In [`app.config.ts`](./app.config.ts), opt out of SPM for Firebase and enable static frameworks:
  ```typescript
  plugins: [
    [
      "@react-native-firebase/app",
      {
        ios: {
          disableSPM: true
        }
      }
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static"
        }
      }
    ],
    ...
  ]
  ```

---

### Issue 3: `hashFiles(...) couldn't finish within 120 seconds`
* **Cause**: In [`.github/workflows/native-sim.yml`](./.github/workflows/native-sim.yml), the cache key used recursive glob patterns (`**/package-lock.json`). During post-job cleanup, GitHub scanned the entire workspace including `node_modules`, `build/`, and `DerivedData`, exceeding GitHub's 120-second expression timeout.
* **Fix**: Restrict `hashFiles` to the root lockfile:
  ```yaml
  key: native-sim-${{ runner.os }}-${{ hashFiles('package-lock.json') }}
  ```

---

### Issue 4: `Missing iosUrlScheme in provided options: {"iosUrlScheme":""}` & App Crash on Open
* **Cause**: When reusing a cached `.app`, `npx expo export:embed` re-evaluates [`app.config.ts`](./app.config.ts). If environment variables (`EXPO_PUBLIC_*`) were not passed to the `Install and launch app` or `Build app` step, values like `iosUrlScheme` became `""` and Firebase initialized with `undefined` keys, throwing fatal unhandled exceptions at launch.
* **Fix**:
  1. Pass all `EXPO_PUBLIC_*` secrets in [`.github/workflows/native-sim.yml`](./.github/workflows/native-sim.yml) under both `Build app` and `Install and launch app`.
  2. In [`app.config.ts`](./app.config.ts), provide fallback values (e.g., `iosUrlScheme: process.env.EXPO_PUBLIC_IOS_CLIENT_ID || "com.googleusercontent.apps.588096104374-j5olpk59dc4qlc7pv4gbk6dp42llj2ur"`).
  3. In [`utils/renderSecrets.ts`](./utils/renderSecrets.ts), provide fallback constants so Firebase never receives `undefined`.
  4. In [`config/firebaseConfig.ts`](./config/firebaseConfig.ts), safeguard initialization with `try/catch`.

---

### Issue 5: `RNGoogleSignIn: A problem reading or writing to the application keychain... Code=-2 "keychain error"`
* **Cause**: 
  1. `CODE_SIGNING_ALLOWED=NO` in `xcodebuild` stripped all code signing and entitlements from the simulator app bundle. Without entitlements, iOS Simulator's `securityd` (Keychain daemon) blocks the app from reading/writing keychain items.
  2. Missing Keychain Sharing entitlement for Google Sign-In.
* **Fix**:
  1. In [`app.config.ts`](./app.config.ts), configure `keychain-access-groups` under `ios.entitlements`:
     ```typescript
     ios: {
       ...
       entitlements: {
         "keychain-access-groups": [
           "$(AppIdentifierPrefix)com.google.GIDSignIn",
           "$(AppIdentifierPrefix)com.bunsenplus.automechanic"
         ]
       },
     }
     ```
  2. In [`.github/workflows/native-sim.yml`](./.github/workflows/native-sim.yml), replace `CODE_SIGNING_ALLOWED=NO` with ad-hoc simulator signing:
     ```yaml
     CODE_SIGN_IDENTITY="-" \
     CODE_SIGNING_REQUIRED=NO \
     ```
     Ad-hoc signing (`-`) requires **no Apple Developer account or certificate**; it signs the binary locally for the simulator and embeds the entitlements so Keychain functions properly.

---

### Issue 6: `native-sim.yml is not on the default branch`
* **Cause**: GitHub's `workflow_dispatch` API only recognizes workflows present on the repository's default branch (`main`).
* **Fix**: Ensure [`.github/workflows/native-sim.yml`](./.github/workflows/native-sim.yml) is committed and pushed to `main`.
