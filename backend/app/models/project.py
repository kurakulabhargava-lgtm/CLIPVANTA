import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON
from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, default="Untitled Video")
    source_type = Column(String(50), nullable=False) # 'youtube' or 'upload'
    source_url = Column(String(500), nullable=True)
    source_path = Column(String(500), nullable=True)
    duration_sec = Column(Float, default=0.0)
    rights_confirmed = Column(Boolean, default=False)
    status = Column(String(50), default="created") # created, processing, completed, failed
    current_stage = Column(String(50), default="queued")
    progress_percent = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), nullable=False, index=True)
    full_text = Column(Text, nullable=False)
    segments = Column(JSON, nullable=False) # List of dicts with start, end, text, words
    created_at = Column(DateTime, default=datetime.utcnow)

class Clip(Base):
    __tablename__ = "clips"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String(36), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    duration = Column(Float, nullable=False)
    
    # 100-Point Scoring
    score = Column(Integer, default=0)
    score_breakdown = Column(JSON, default=dict)
    
    commentary_script = Column(JSON, default=dict) # hook, explanation, outro
    commentary_audio_path = Column(String(500), nullable=True)
    video_output_path = Column(String(500), nullable=True)
    thumbnail_path = Column(String(500), nullable=True)
    
    social_metadata = Column(JSON, default=dict) # youtube, instagram, tiktok titles/tags
    qa_passed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
