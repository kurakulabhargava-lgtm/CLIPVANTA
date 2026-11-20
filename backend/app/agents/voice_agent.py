import asyncio
from pathlib import Path
from app.core.config import settings

class VoiceAgent:
    """Agent 6: Neural text-to-speech engine using Edge-TTS (Zero-cost, realistic)."""

    AVAILABLE_VOICES = [
        {"id": "en-US-ChristopherNeural", "name": "Christopher (Authoritative, Male)", "gender": "Male"},
        {"id": "en-US-JennyNeural", "name": "Jenny (Natural, Female)", "gender": "Female"},
        {"id": "en-US-GuyNeural", "name": "Guy (Casual Storyteller, Male)", "gender": "Male"},
        {"id": "en-US-AriaNeural", "name": "Aria (Energetic, Female)", "gender": "Female"},
    ]

    async def generate_speech(self, text: str, output_path: Path, voice: str = None, rate: str = "+0%") -> Path:
        selected_voice = voice or settings.DEFAULT_TTS_VOICE
        try:
            import edge_tts
            communicate = edge_tts.Communicate(text, selected_voice, rate=rate)
            await communicate.save(str(output_path))
            return output_path
        except Exception:
            # If edge_tts fails or offline, touch empty audio file for fallback
            output_path.write_bytes(b"")
            return output_path
