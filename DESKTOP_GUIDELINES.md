# Folio Development Guidelines (Native & Lightweight)

Our goal is to build a high-performance, native-feeling word processor. 
We prioritize resource efficiency and deep system integration over feature-bloat.

## 1. Native Integration (MUST)
- **Dialogs:** Always use system-native dialogs (file picker, save, print).
  - Use `@tauri-apps/plugin-dialog` to leverage XDG Desktop Portals.
  - Fallback: Use `zenity` only if portal integration is unavailable.
  - NEVER implement custom in-app modal windows for core system tasks (e.g., Open File, Save As).

- **Theming:** The app must respect the OS color scheme.
  - On KDE Plasma: Listen to system color changes and apply to CSS variables.
  - On GNOME: Respect the GTK theme colors via system settings.
  - Implementation: Use CSS variables (`--color-bg`, `--color-text`) that map to system tokens.

## 2. Resource Management (MUST)
- **Memory Footprint:** The idle memory usage should NEVER exceed 200MB.
- **Dependencies:** Avoid adding heavy JS libraries (like full-blown Lodash or massive UI kits). Prefer lightweight alternatives or native Web APIs.
- **Lazy Loading:** Any heavy features (Export to complex formats, Spellcheck engines) must be lazy-loaded only when requested.

## 3. UI/UX Philosophy (SHOULD)
- **Look & Feel:** Keep the interface clean and "Native".
  - Avoid redundant UI elements (e.g., centered titles if the header already contains app/file info).
  - Use `data-tauri-drag-region` carefully to ensure the app feels solid, not "webby".
- **Icons:** Use SVG-based icon sets that can be swapped/theming-friendly for:
  - KDE (Breeze), GNOME (Adwaita), macOS, and Windows.

## 4. Platform Specifics (Notes)
- **Linux:** First-class citizen. Ensure full compatibility with XDG standards.
- **Future-proofing:** Keep logic and UI separated (Rust/React) to allow future porting of the UI layer without rewriting the core business logic.
