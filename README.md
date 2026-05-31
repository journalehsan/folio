# Folio

> A modern, open-source word processor for Linux — built with Rust and React.

Folio is a desktop-native document editor built on [Tauri v2](https://tauri.app) (Rust backend) and React + TypeScript. It aims to be a fast, privacy-first alternative to LibreOffice and Microsoft Word, with a clean UI, low memory footprint, and planned AI and cloud capabilities that go beyond what existing word processors offer.

---

## Why Folio?

| | Folio | LibreOffice | MS Word |
|---|---|---|---|
| **Native desktop** | ✅ Tauri/Rust | ✅ C++ | ✅ |
| **Open source** | ✅ | ✅ | ❌ |
| **Linux first-class** | ✅ | ✅ | ❌ |
| **RAM usage** | ~150 MB | ~400 MB | ~600 MB+ |
| **AI writing assistant** | 🔜 planned | ❌ | limited |
| **Cloud sync (Dropbox, Drive)** | 🔜 planned | ❌ | OneDrive only |
| **Custom titlebar / CSD** | ✅ | partial | ✅ |

---

## Features (current)

- **Frameless window** with custom draggable titlebar and Win11-style controls
- **Rich text editor** powered by [Tiptap](https://tiptap.dev) (bold, italic, underline, strike, code, lists, blockquotes, alignment, headings)
- **Document outline** panel with live heading navigation
- **Page thumbnails** sidebar
- **Typography inspector** panel (font family, size, line height, letter spacing)
- **Document settings** panel (page size, orientation, margins, columns)
- **Style manager** (Normal, Heading 1–4, Quote, Code Block, Caption, Title, Subtitle)
- **Template manager**
- **Zoom control** (50–200%)
- **Ruler** overlay
- **Right-click context menu**
- **Status bar** (word count, character count, page info)
- **Dark / Light mode toggle**
- Memory usage script (`mem.sh`) to benchmark against other apps

---

## Planned features

### AI (beyond MS Word)
- Context-aware rewriting (not just autocomplete — understands full document structure)
- Style-matched suggestions (learns your writing style)
- Multi-document synthesis (ask questions across multiple files)
- Local-first AI via Ollama — no cloud required, no data leaves your machine
- AI-powered outline generation and restructuring
- Grammar and tone analysis with explanations

### Cloud & sync
- Dropbox integration
- Google Drive integration
- Nextcloud / self-hosted support
- Real-time collaborative editing (CRDT-based, no central server required)
- Offline-first with background sync

### Editor
- Multi-page document model
- Headers, footers, page numbers
- Table of contents (auto-generated from headings)
- Image and media embedding
- Advanced table editor
- Comments and tracked changes
- Export to PDF, DOCX, Markdown, HTML
- Print support

---

## Tech stack

| Layer | Technology |
|---|---|
| Desktop runtime | [Tauri v2](https://tauri.app) (Rust) |
| Frontend | React 19 + TypeScript |
| Bundler | Vite 7 |
| Styling | Tailwind CSS v4 |
| Editor engine | Tiptap v3 (ProseMirror) |
| State | Zustand |
| Icons | Lucide React |

---

## Getting started

### Prerequisites

**Rust + Cargo**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Node.js** (v20+)

**Linux system dependencies (Arch)**
```bash
sudo pacman -S --needed \
  webkit2gtk-4.1 base-devel curl wget file \
  openssl gtk3 libappindicator-gtk3 librsvg xdotool
```

**Linux system dependencies (Ubuntu/Debian)**
```bash
sudo apt install -y \
  libwebkit2gtk-4.1-dev build-essential curl wget file \
  libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

### Install and run

```bash
git clone https://github.com/journalehsan/folio.git
cd folio
npm install
npm run tauri:dev
```

Or use the helper script:
```bash
./dev.sh
```

### Build for production

```bash
npm run tauri:build
```

The installer/binary will be in `src-tauri/target/release/bundle/`.

---

## Benchmarking memory

```bash
# Folio only
./mem.sh

# Compare Folio vs LibreOffice
./mem.sh soffice

# Compare Folio vs VS Code
./mem.sh code
```

---

## Project structure

```
folio/
├── src/                        # React frontend
│   ├── components/
│   │   ├── toolbar/            # TitleBar, TopToolbar, buttons
│   │   ├── sidebar/
│   │   │   ├── left/           # Outline, Thumbnails
│   │   │   └── right/          # Typography, DocumentSettings, Styles, Templates
│   │   ├── workspace/          # PageCanvas, Ruler, ContextMenu
│   │   └── editor/             # Tiptap editor, BubbleToolbar
│   ├── store/                  # Zustand document store
│   └── tauri/                  # Tauri window API helpers
├── src-tauri/                  # Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── capabilities/           # Tauri permission grants
│   └── tauri.conf.json         # App config (window, bundle, etc.)
├── dev.sh                      # Quick launch script
└── mem.sh                      # Memory benchmarking script
```

---

## Contributing

Contributions are welcome. Open an issue first for major features.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes
4. Open a pull request

---

## License

MIT
