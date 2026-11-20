from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProjectCreateRequest(BaseModel):
    title: Optional[str] = "Untitled Project"
    source_type: str = Field(..., description="'youtube' or 'upload'")
    source_url: Optional[str] = None
    rights_confirmed: bool = Field(..., description="User explicit confirmation of content rights")

class YouTubeMetadataResponse(BaseModel):
    video_id: str
    title: str
    duration_sec: float
    thumbnail_url: str
    channel_name: str
    is_permitted: bool

class ClipResponse(BaseModel):
    id: str
    project_id: str
    title: str
    start_time: float
    end_time: float
    duration: float
    score: int
    score_breakdown: Dict[str, Any]
    commentary_script: Dict[str, Any]
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    social_metadata: Dict[str, Any]
    qa_passed: bool
    created_at: datetime

class ProjectResponse(BaseModel):
    id: str
    title: str
    source_type: str
    source_url: Optional[str]
    duration_sec: float
    rights_confirmed: bool
    status: str
    current_stage: str
    progress_percent: int
    error_message: Optional[str]
    clips_count: int = 0
    created_at: datetime
