import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.project import Project, Clip
from app.schemas.project import ProjectCreateRequest, ProjectResponse, ClipResponse, YouTubeMetadataResponse
from app.agents.input_agent import InputAgent
from app.orchestrator.workflow import WorkflowController
from app.core.config import settings

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.created_at.desc()))
    projects = result.scalars().all()
    out = []
    for p in projects:
        clips_res = await db.execute(select(Clip).where(Clip.project_id == p.id))
        clips_count = len(clips_res.scalars().all())
        out.append(ProjectResponse(
            id=p.id,
            title=p.title,
            source_type=p.source_type,
            source_url=p.source_url,
            duration_sec=p.duration_sec,
            rights_confirmed=p.rights_confirmed,
            status=p.status,
            current_stage=p.current_stage,
            progress_percent=p.progress_percent,
            error_message=p.error_message,
            clips_count=clips_count,
            created_at=p.created_at
        ))
    return out

@router.post("/youtube/preview", response_model=YouTubeMetadataResponse)
async def preview_youtube(url: str):
    agent = InputAgent()
    try:
        return await agent.get_youtube_metadata(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("", response_model=ProjectResponse)
async def create_project(
    background_tasks: BackgroundTasks,
    payload: ProjectCreateRequest,
    db: AsyncSession = Depends(get_db)
):
    if not payload.rights_confirmed:
        raise HTTPException(status_code=400, detail="You must confirm you have authorization to use this content.")

    new_project = Project(
        title=payload.title or "YouTube Video Analysis",
        source_type=payload.source_type,
        source_url=payload.source_url,
        rights_confirmed=payload.rights_confirmed,
        status="processing",
        current_stage="queued",
        progress_percent=5
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    async def run_pipeline(p_id: str):
        from app.core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as session:
            controller = WorkflowController(session)
            await controller.process_project(p_id)

    background_tasks.add_task(run_pipeline, new_project.id)

    return ProjectResponse(
        id=new_project.id,
        title=new_project.title,
        source_type=new_project.source_type,
        source_url=new_project.source_url,
        duration_sec=0.0,
        rights_confirmed=new_project.rights_confirmed,
        status=new_project.status,
        current_stage=new_project.current_stage,
        progress_percent=new_project.progress_percent,
        error_message=None,
        clips_count=0,
        created_at=new_project.created_at
    )

@router.post("/upload", response_model=ProjectResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form("Uploaded Video"),
    rights_confirmed: bool = Form(...),
    db: AsyncSession = Depends(get_db)
):
    if not rights_confirmed:
        raise HTTPException(status_code=400, detail="Authorization confirmation required.")

    save_path = settings.UPLOAD_DIR / file.filename
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_project = Project(
        title=title,
        source_type="upload",
        source_path=str(save_path),
        rights_confirmed=rights_confirmed,
        status="processing",
        current_stage="queued",
        progress_percent=5
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    async def run_pipeline(p_id: str):
        from app.core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as session:
            controller = WorkflowController(session)
            await controller.process_project(p_id)

    background_tasks.add_task(run_pipeline, new_project.id)

    return ProjectResponse(
        id=new_project.id,
        title=new_project.title,
        source_type=new_project.source_type,
        source_url=None,
        duration_sec=0.0,
        rights_confirmed=new_project.rights_confirmed,
        status=new_project.status,
        current_stage=new_project.current_stage,
        progress_percent=new_project.progress_percent,
        error_message=None,
        clips_count=0,
        created_at=new_project.created_at
    )

@router.get("/{project_id}/clips", response_model=List[ClipResponse])
async def get_project_clips(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Clip).where(Clip.project_id == project_id).order_by(Clip.score.desc()))
    clips = result.scalars().all()
    return [
        ClipResponse(
            id=c.id,
            project_id=c.project_id,
            title=c.title,
            start_time=c.start_time,
            end_time=c.end_time,
            duration=c.duration,
            score=c.score,
            score_breakdown=c.score_breakdown,
            commentary_script=c.commentary_script,
            video_url=f"/media/clips/{Path(c.video_output_path).name}" if c.video_output_path else None,
            thumbnail_url=None,
            social_metadata=c.social_metadata,
            qa_passed=c.qa_passed,
            created_at=c.created_at
        ) for c in clips
    ]
