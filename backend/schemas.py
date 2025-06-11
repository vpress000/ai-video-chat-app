from pydantic import BaseModel
from typing import Optional
import datetime

class VideoBase(BaseModel):
    video_id: str
    title: Optional[str] = None

class VideoCreate(VideoBase):
    transcript: Optional[str] = None

class VideoResponse(VideoBase):
    id: int
    transcript: Optional[str] = None
    created_at: datetime.datetime
    updated_at: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True  # Updated for Pydantic V2 (was orm_mode = True in V1)

class ProcessVideoRequest(BaseModel):
    youtube_url: str
