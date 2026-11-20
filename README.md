# ClipVanta 🎬⚡
### Autonomous AI Video Clipping & Production Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-Ready-green.svg)](https://ffmpeg.org/)

**ClipVanta** is an autonomous AI video production agent that ingests long-form videos (via authorized file upload or permitted YouTube URL metadata/transcripts) and transforms them into engaging, viral-ready 30–60 second vertical shorts (9:16) for **YouTube Shorts**, **Instagram Reels**, and **TikTok**.

---

## 🌟 Key Features

- **Dual Input Methods**:
  - **YouTube URL**: Validates URL, retrieves permitted metadata (title, thumbnail, duration, channel), displays embedded video preview, and fetches accessible transcripts without violating platform ToS.
  - **Direct Upload**: Handles MP4, MOV, MKV, and WebM with file integrity verification and mandatory **Content Rights Confirmation**.
- **Speech Transcription**: Fast, accurate speech-to-text with word-level timestamps using Whisper (`faster-whisper`).
- **Contextual Highlight Detection (100-Point Rubric)**:
  - 🎣 Opening Hook (20 pts)
  - 💡 Informational Value (20 pts)
  - ❤️ Emotional Impact (15 pts)
  - 📖 Storytelling Flow (15 pts)
  - 🧩 Standalone Context (15 pts)
  - 🚀 Shareability Potential (15 pts)
- **AI Commentary & Narration**: Generates tone-matched opening hooks, contextual explanations, and closing summaries while preserving the original speaker's integrity.
- **Natural AI Voiceover**: Integrated zero-cost neural text-to-speech (`edge-tts`) with 100+ voices, customizable speed, pitch, and volume.
- **Automated 9:16 Video Editing**:
  - Smart reframing to 1080×1920 (center-crop / face tracking / blurred pillarbox).
  - Dynamic kinetic subtitles with active word karaoke highlighting.
  - Audio normalization and dynamic commentary ducking.
- **Quality Assurance**: Automated validation checking for exact 30–60s duration, aspect ratio, audio/video sync, and black frame detection.
- **Social Media Publishing Package**: Generates tailored titles, hooks, captions, descriptions, and hashtags for Shorts, Reels, and TikTok.

---

## 📂 Project Structure

```text
clipvanta/
├── docs/                      # Architectural specifications & Phase Roadmap
│   ├── ARCHITECTURE.md        # Complete system architecture
│   └── ROADMAP.md             # 10-stage engineering milestones
├── backend/                   # FastAPI Python backend & AI Agents
│   ├── app/
│   │   ├── agents/            # Autonomous worker agents (1–9)
│   │   ├── api/v1/            # REST API endpoints (projects, clips, media)
│   │   ├── core/              # Config, settings, and database engine
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── orchestrator/      # Central workflow controller & state machine
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # FFmpeg, LLM, and TTS services
│   │   └── main.py            # FastAPI application entrypoint
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile
│   └── run.py                 # Backend launcher
├── frontend/                  # Next.js 14 / TypeScript / Tailwind CSS UI
│   ├── src/
│   │   ├── app/               # App Router pages (Dashboard, New, Project, Clips)
│   │   ├── components/        # Modern UI components
│   │   ├── lib/               # Typed API client & utilities
│   │   └── types/             # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.ts
│   └── Dockerfile
├── storage/                   # Local media scratch workspace (gitignored)
│   ├── uploads/
│   ├── audio/
│   └── clips/
├── docker-compose.yml         # Container orchestration
├── setup.bat                  # Windows one-click setup script
├── setup.sh                   # Linux/macOS setup script
├── .gitignore
├── LICENSE
└── CONTRIBUTING.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**: [Download Python](https://www.python.org/downloads/) *(ensure "Add to PATH" is checked)*
- **Node.js 18+**: [Download Node.js](https://nodejs.org/)
- **FFmpeg**: [Download FFmpeg](https://ffmpeg.org/download.html) *(ensure `ffmpeg` is accessible in your system terminal)*

### 2. Configure Environment

Copy `.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

### 3. Running the Backend (Python FastAPI)

```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
*API documentation: `http://localhost:8000/docs`*

### 4. Running the Frontend (Next.js)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser!

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
