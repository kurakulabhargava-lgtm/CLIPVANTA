# ClipVanta Implementation Roadmap & Verification Gates

---

### Phase Plan (10 Stages)

| Stage | Name | Key Deliverables | Verification Gate |
|---|---|---|---|
| **Stage 1** | **Requirements Analysis & Architecture** | System Architecture, Tech Stack Selection, Folder Structure, API Contract | Architecture spec documented, directory structure initialized. |
| **Stage 2** | **Frontend Dashboard & Project Creation** | Next.js 14 Web App, Tailwind UI, Dashboard, New Project form (Upload & YouTube URL), State store | UI runs cleanly, forms validate inputs, client mock data flows. |
| **Stage 3** | **Backend APIs & Database** | FastAPI REST API, Pydantic schemas, SQLite/PostgreSQL models, CRUD endpoints | API health checks pass, project endpoints return valid responses. |
| **Stage 4** | **Authorized Video Input & Processing** | YouTube metadata parser, file upload handler, FFmpeg media probe & audio extraction | Ingest sample video, extract metadata and 16kHz audio stream. |
| **Stage 5** | **Speech Transcription Engine** | Faster-Whisper / Whisper integration, word-level timestamp generation | Convert audio to timestamped JSON transcript with 100% sentence boundaries. |
| **Stage 6** | **AI Content Analysis & Highlight Detection** | 100-point highlight scoring engine, LLM provider abstraction (OpenAI, Gemini, Ollama) | Candidate clips extracted with verifiable 30–60s duration and score breakdowns. |
| **Stage 7** | **Commentary & Voice Generation** | Script generation engine, Edge-TTS audio generator, voice preview | Generate natural voiceover audio matching clip context and length. |
| **Stage 8** | **Automatic Video Editing Engine** | FFmpeg 9:16 portrait reframing, animated subtitles (ASS), audio ducking and merging | Render clean MP4 vertical clip with burned-in subtitles and voiceover. |
| **Stage 9** | **Quality Assurance & Social Export** | Automated QA validation (duration, black frames, sync), social media copy generator | Output verified clips with YouTube Shorts / TikTok / Reels metadata. |
| **Stage 10** | **Deployment, Packaging & Full E2E Test** | Docker compose, environment configuration, complete end-to-end user verification | Complete run from long-form video to downloadable shorts. |
