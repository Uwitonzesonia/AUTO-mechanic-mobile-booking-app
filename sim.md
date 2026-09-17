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
* Config plugins (Firebase, Google Sign-In, Location, etc.) in [app.config.ts](file:///D:/dev/SOLVIT/auto-app/app.config.ts).
* Native directories (`ios/` if present) and iOS permissions.

### Caching Behavior in CI:
* **Cold Build (Cache Miss)**: When running for the first time or when native dependencies/config change, the runner runs `npx expo prebuild`, compiles the project with `xcodebuild`, and saves the `.app` to GitHub Actions cache under `native-sim-app-macOS-<hash>`. (Takes ~10–15 minutes).
* **Warm Build (Cache Hit)**: When only React Native components, hooks, styles, or screens change, the native fingerprint hash stays identical. The runner restores the compiled `.app` instantly from cache, skipping `xcodebuild`. (Takes ~1–2 minutes).

---

## 3. Project Configuration & Files

The project has been configured with the following files and scripts:

### Workflow and Gate Scripts
* **[.github/workflows/native-sim.yml](file:///D:/dev/SOLVIT/auto-app/.github/workflows/native-sim.yml)**: Workflow that provisions the macOS runner, manages fingerprint caching, boots the simulator, and starts the tunnel.
* **[.github/native-sim/gate.cjs](file:///D:/dev/SOLVIT/auto-app/.github/native-sim/gate.cjs)**: Authentication gate to ensure only authorized connections can view and control the simulator.

### Windows Compatibility Script
* **[scripts/patch-native-sim.js](file:///D:/dev/SOLVIT/auto-app/scripts/patch-native-sim.js)**: Automatically patches `native-sim` upon `npm install` (`postinstall`) so that it works cross-platform on Windows (`where` instead of `which`, and Windows URL launcher).

### NPM Scripts in [package.json](file:///D:/dev/SOLVIT/auto-app/package.json)

| Command | Action |
| :--- | :--- |
| `npm run sim` | Launches the remote iOS simulator stream (`native-sim up --public --agent`) |
| `npm run sim:status` | Shows the active simulator session and tunnel stream URL |
| `npm run sim:down` | Cancels the remote runner and tears down the stream |
| `npm run fingerprint:ios` | Generates the iOS native fingerprint JSON and hash |
| `npm run fingerprint` | Generates full project fingerprint details |

---

## 4. Step-by-Step Instructions

### Step 1: Verify Prerequisites
Run the doctor check to ensure your local environment is ready:

```powershell
npx native-sim doctor
```

Expected output:
```text
native-sim doctor

  ✓ Expo project auto-mechanic
  ✓ git
  ✓ gh CLI authenticated
  ✓ Node >= 20
  ✓ .github/workflows/native-sim.yml
  ✓ .github/native-sim/gate.cjs
  ✓ GitHub remote
```

### Step 2: Authenticate GitHub CLI (`gh`)
If `gh CLI authenticated` shows a cross, log in using your browser:

```powershell
gh auth login
```
* Select: **GitHub.com** → **HTTPS** → **Login with a web browser**.
* Complete the one-time device code confirmation in your browser.

> [!IMPORTANT]
> If you just installed `gh`, open a **new terminal** window so PowerShell can reload the updated system `$PATH`.

### Step 3: Push Workflow to Default Branch (`main`)

> [!WARNING]
> GitHub's `workflow_dispatch` API **only** recognizes workflows that are present on the repository's **default branch** (`main`). 

Make sure your changes and the workflow files are committed and pushed to `main`:

```powershell
# Switch to main branch
git checkout main

# Merge latest changes from master
git merge master

# Stage and commit new files
git add .
git commit -m "ci: setup native-sim with expo fingerprint caching"

# Push to GitHub
git push origin main
```

### Step 4: Launch the Simulator

Start the session with:

```powershell
npm run sim
```

This command will:
1. Push any outstanding commits to the remote repository.
2. Dispatch the `native-sim` workflow on GitHub Actions.
3. Wait for the macOS runner to spin up and report the stream tunnel URL.

### Step 5: Test in Your Browser

Once ready, the console outputs:

```text
  ● Simulator is live
  https://xxxx.trycloudflare.com/?k=<gate-token>

  Anyone with that link can drive the simulator.
  Stop it early with: native-sim down
```

* Click or copy the URL to your browser.
* You can click, drag, scroll, and type into the interactive iOS Simulator directly inside your browser window.

### Step 6: (Optional) Control via AI Agent (`agent-device`)

Because `--agent` is enabled, `agent-device` proxy is exposed on the same tunnel:

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

### Step 7: Teardown Session

To stop the runner and close the tunnel:

```powershell
npm run sim:down
```

---

## 5. Helpful Commands & Troubleshooting

### Check Current Session
```powershell
npm run sim:status
```

### Check Local iOS Native Fingerprint
To check what hash will be used for CI caching:
```powershell
npm run fingerprint:ios
```

### Billing Considerations
* By default, `npm run sim` passes `--public`. Public GitHub repositories have **unlimited free macOS runner minutes**.
* If your repository is private, GitHub bills macOS minutes at 10× normal Linux runner rates.

### Error: `native-sim.yml is not on the default branch`
If you encounter this error, verify which branch is the default on GitHub (Settings → Branches). If `main` is default, ensure [.github/workflows/native-sim.yml](file:///D:/dev/SOLVIT/auto-app/.github/workflows/native-sim.yml) is pushed to `main`.
