from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from youtube_transcript_api import TranscriptsDisabled, NoTranscriptFound, YouTubeRequestFailed
import re

import schemas
import models
from database import get_db
from services.transcript_service import TranscriptService

router = APIRouter(
    prefix="/api/video",
    tags=["video"],
)

def extract_video_id(youtube_url: str) -> str | None:
    """Extracts the video ID from a YouTube URL."""
    patterns = [
        r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)",
        r"(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)",
        r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)",
        r"(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)"
    ]
    for pattern in patterns:
        match = re.search(pattern, youtube_url)
        if match:
            return match.group(1)
    return None

@router.post("/process", response_model=schemas.VideoResponse)
async def process_video(
    request: schemas.ProcessVideoRequest, db: AsyncSession = Depends(get_db)
):
    print("--- process_video: START ---")
    print(f"Request URL: {request.youtube_url}")

    video_id = extract_video_id(request.youtube_url)
    print(f"Extracted video_id: {video_id}")

    if not video_id:
        print("Invalid YouTube URL, raising HTTPException")
        raise HTTPException(status_code=400, detail="Invalid YouTube URL")

    print(f"Checking for existing video with video_id: {video_id}")
    result = await db.execute(
        models.Video.__table__.select().where(models.Video.video_id == video_id)
    )
    existing_video_row = result.fetchone()

    if existing_video_row:
        print(f"Video found in DB with ID: {existing_video_row.id}")
        video = await db.get(models.Video, existing_video_row.id)
        if video:
            print("--- process_video: END (returning existing video) ---")
            return video
        print("Video found by video_id but failed to retrieve full record, raising HTTPException")
        raise HTTPException(status_code=404, detail="Video found by video_id but failed to retrieve full record.")

    print("Video not in DB, proceeding to fetch transcript.")
    
    transcript_service = TranscriptService()
    
    # Try to get actual video title using YouTube API
    actual_title = await transcript_service.get_video_metadata(video_id)
    base_title = actual_title or f"Video {video_id}"
    
    transcript_text, title_suffix = await transcript_service.get_transcript(video_id)
    
    video_title = f"{base_title}{' ' + title_suffix if title_suffix else ''}"
    
    print(f"Proceeding to save video {video_id} with title: '{video_title}' and transcript_text (length): {len(transcript_text) if transcript_text else 0}")
    new_video = models.Video(
        video_id=video_id,
        title=video_title,
        transcript=transcript_text,
    )
    db.add(new_video)
    await db.commit()
    await db.refresh(new_video)
    print(f"Video {video_id} saved with DB ID: {new_video.id}")
    print("--- process_video: END (returning new video) ---")
    return new_video
