from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from pydantic import BaseModel
from typing import List, Optional
import logging

from database import get_db
from models import Video

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/search",
    tags=["search"],
)

class SearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 10

class SearchResult(BaseModel):
    video_id: str
    title: str
    relevance_score: float
    matched_content: str

class SearchResponse(BaseModel):
    success: bool
    results: List[SearchResult]
    total_count: int

@router.post("/", response_model=SearchResponse)
async def search_videos(
    request: SearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Search videos by title and transcript content.
    """
    try:
        logger.info(f"Searching for: {request.query}")
        
        # Create search query for title and transcript
        search_term = f"%{request.query.lower()}%"
        
        stmt = select(Video).where(
            or_(
                Video.title.ilike(search_term),
                Video.transcript.ilike(search_term)
            )
        ).limit(request.limit)
        
        result = await db.execute(stmt)
        videos = result.scalars().all()
        
        # Convert to search results with basic relevance scoring
        search_results = []
        for video in videos:
            # Simple relevance scoring based on matches in title vs transcript
            title_match = request.query.lower() in (video.title or "").lower()
            transcript_match = request.query.lower() in (video.transcript or "").lower()
            
            relevance_score = 1.0 if title_match else 0.5 if transcript_match else 0.1
            
            # Extract matched content snippet
            matched_content = ""
            if title_match:
                matched_content = video.title or ""
            elif transcript_match and video.transcript:
                # Find snippet around the match
                transcript_lower = video.transcript.lower()
                query_lower = request.query.lower()
                match_index = transcript_lower.find(query_lower)
                if match_index != -1:
                    start = max(0, match_index - 50)
                    end = min(len(video.transcript), match_index + len(request.query) + 50)
                    matched_content = "..." + video.transcript[start:end] + "..."
            
            search_results.append(SearchResult(
                video_id=video.video_id,
                title=video.title or f"Video {video.video_id}",
                relevance_score=relevance_score,
                matched_content=matched_content
            ))
        
        # Sort by relevance score
        search_results.sort(key=lambda x: x.relevance_score, reverse=True)
        
        return SearchResponse(
            success=True,
            results=search_results,
            total_count=len(search_results)
        )
        
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/health")
async def search_health():
    """Health check for search service."""
    return {"status": "healthy", "service": "search"}