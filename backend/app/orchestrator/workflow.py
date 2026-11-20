import asyncio
from pathlib import Path
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.project import Project, Transcript, Clip
from app.agents.input_agent import InputAgent
from app.agents.transcription_agent import TranscriptionAgent
from app.agents.analysis_agent import ContentAnalysisAgent
from app.agents.highlight_agent import HighlightAgent
from app.agents.commentary_agent import CommentaryAgent
from app.agents.voice_agent import VoiceAgent
from app.agents.video_editor_agent import VideoEditorAgent
from app.agents.qa_agent import QualityAssuranceAgent
from app.agents.social_agent import SocialMediaAgent
from app.core.config import settings

class WorkflowController:
    """Central Orchestrator: Executes the 9-stage ClipVanta pipeline with state verification."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.input_agent = InputAgent()
        self.transcription_agent = TranscriptionAgent()
        self.analysis_agent = ContentAnalysisAgent()
        self.highlight_agent = HighlightAgent()
        self.commentary_agent = CommentaryAgent()
        self.voice_agent = VoiceAgent()
        self.video_editor = VideoEditorAgent()
        self.qa_agent = QualityAssuranceAgent()
        self.social_agent = SocialMediaAgent()

    async def update_status(self, project: Project, stage: str, progress: int):
        project.current_stage = stage
        project.progress_percent = progress
        await self.db.commit()

    async def process_project(self, project_id: str) -> None:
        result = await self.db.execute(select(Project).where(Project.id == project_id))
        project = result.scalar_one_or_none()
        if not project:
            return

        try:
            # Stage 1: Input & Ingestion
            await self.update_status(project, "ingesting", 10)
            video_file = Path(project.source_path) if project.source_path else settings.UPLOAD_DIR / "sample.mp4"

            # Stage 2: Transcription
            await self.update_status(project, "transcribing", 25)
            audio_path = await self.transcription_agent.extract_audio_wav(video_file)
            transcript_data = await self.transcription_agent.transcribe(audio_path)

            transcript = Transcript(
                project_id=project.id,
                full_text=transcript_data["full_text"],
                segments=transcript_data["segments"]
            )
            self.db.add(transcript)
            await self.db.commit()

            # Stage 3: Topic Analysis
            await self.update_status(project, "analyzing_topics", 40)
            blocks = self.analysis_agent.analyze_topics(transcript_data["segments"])

            # Stage 4: Highlight Detection (100-Point Model)
            await self.update_status(project, "scoring_highlights", 55)
            highlights = self.highlight_agent.rank_highlights(blocks, top_k=3)

            # Stage 5 to 9: For each highlight candidate
            await self.update_status(project, "generating_clips", 75)
            for i, h in enumerate(highlights):
                clip_title = f"Clip #{i+1}: Key Insight"
                commentary = self.commentary_agent.generate_commentary(clip_title, h["text"])

                # Voice synthesis
                voice_out = settings.AUDIO_DIR / f"{project.id}_clip_{i+1}_voice.mp3"
                await self.voice_agent.generate_speech(commentary["full_script"], voice_out)

                # Video rendering
                clip_out = settings.CLIPS_DIR / f"{project.id}_clip_{i+1}_vertical.mp4"
                await self.video_editor.render_vertical_clip(
                    source_video=video_file,
                    start_time=h["start"],
                    duration=h["duration"],
                    output_path=clip_out,
                    commentary_audio=voice_out
                )

                # QA Check
                qa_res = self.qa_agent.validate_clip(clip_out, h["duration"])

                # Social package
                social_pkg = self.social_agent.generate_social_package(clip_title, h["text"])

                # Save Clip record
                clip = Clip(
                    project_id=project.id,
                    title=clip_title,
                    start_time=h["start"],
                    end_time=h["end"],
                    duration=h["duration"],
                    score=h["score"],
                    score_breakdown=h["score_breakdown"],
                    commentary_script=commentary,
                    commentary_audio_path=str(voice_out),
                    video_output_path=str(clip_out),
                    social_metadata=social_pkg,
                    qa_passed=qa_res["passed"]
                )
                self.db.add(clip)

            project.status = "completed"
            project.current_stage = "completed"
            project.progress_percent = 100
            await self.db.commit()

        except Exception as e:
            project.status = "failed"
            project.error_message = str(e)
            await self.db.commit()
