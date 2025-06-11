from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession 
from sqlalchemy import select
from pydantic import BaseModel
import logging
import os 
import openai
from openai import AsyncOpenAI
from typing import List, Optional
import re

from database import get_db 
from models import Video 

logger = logging.getLogger(__name__)

# Initialize OpenAI Client
if os.getenv("OPENAI_API_KEY"):
    try:
        client = AsyncOpenAI()
        logger.info("AsyncOpenAI client initialized for timestamps.")
    except Exception as e:
        logger.error(f"Failed to initialize AsyncOpenAI client: {e}")
        client = None
else:
    logger.warning("OPENAI_API_KEY not found. Timestamps functionality will be limited.")
    client = None

router = APIRouter(
    prefix="/api/timestamps",
    tags=["timestamps"],
)

class TimestampItem(BaseModel):
    time: int  # Time in seconds
    title: str
    description: str

class TimestampsResponse(BaseModel):
    success: bool
    timestamps: List[TimestampItem] = []
    error: Optional[str] = None

@router.get("/{video_id}")
async def generate_timestamps(
    video_id: str, 
    db: AsyncSession = Depends(get_db)
):
    """Generate AI-powered timestamps for a video based on its transcript."""
    logger.info(f"Generating timestamps for video_id: {video_id}")

    # Get video and transcript from database
    stmt = select(Video).where(Video.video_id == video_id)
    result = await db.execute(stmt)
    video = result.scalars().first()
    
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    if not video.transcript:
        return TimestampsResponse(
            success=False, 
            error="No transcript available for this video"
        )

    if not client:
        return TimestampsResponse(
            success=False, 
            error="AI service not configured (OPENAI_API_KEY missing)"
        )

    try:
        logger.info("Sending request to OpenAI API for timestamp generation...")
        
        # Create a prompt for timestamp generation
        prompt = f"""
Analyze the following video transcript and generate meaningful timestamps that break down the content into logical sections. 

Please provide timestamps in this EXACT format (follow this pattern precisely):
[30] - Title: Introduction and Setup
Description: Opening remarks and context setting for the discussion

[120] - Title: Main Topic Discussion
Description: Deep dive into the primary subject matter

[300] - Title: Key Examples and Cases
Description: Specific examples and practical applications

Guidelines:
- Generate 4-8 timestamps depending on content length
- Times should be in seconds only (no minutes:seconds format)
- Focus on major topic changes, key insights, or important segments
- Keep titles under 50 characters
- Keep descriptions under 100 characters
- Use the exact format shown above with square brackets and dashes

Transcript:
{video.transcript[:8000]}

Generate timestamps now:
"""

        messages = [
            {"role": "system", "content": "You are an expert video content analyzer. Generate precise timestamps that help viewers navigate to key sections of the video. Focus on natural topic boundaries and important moments."},
            {"role": "user", "content": prompt}
        ]
        
        completion = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=messages,
            temperature=0.1,  # Even lower temperature for more consistent formatting
            max_tokens=1500   # Limit response length
        )
        
        ai_response = completion.choices[0].message.content
        logger.info("Received response from OpenAI API for timestamps.")
        logger.info(f"AI response length: {len(ai_response) if ai_response else 0}")
        
        if not ai_response:
            return TimestampsResponse(
                success=False,
                error="Empty response from AI service"
            )
        
        # Parse the AI response to extract timestamps
        timestamps = parse_timestamps_from_response(ai_response)
        
        return TimestampsResponse(
            success=True,
            timestamps=timestamps
        )

    except openai.APIError as e:
        logger.error(f"OpenAI API Error: {e}")
        return TimestampsResponse(
            success=False,
            error=f"AI service error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error generating timestamps: {e}")
        return TimestampsResponse(
            success=False,
            error="An unexpected error occurred while generating timestamps"
        )

def parse_timestamps_from_response(response: str) -> List[TimestampItem]:
    """Parse the AI response to extract structured timestamp data."""
    timestamps = []
    
    try:
        logger.info(f"Parsing AI response for timestamps. Response length: {len(response)}")
        logger.info(f"First 500 chars of response: {response[:500]}")
        
        # Look for patterns like [120] - Title: Something
        pattern = r'\[(\d+)\]\s*-\s*Title:\s*([^\n]+?)(?:\n|\r\n)Description:\s*([^\n\[]+)'
        matches = re.findall(pattern, response, re.MULTILINE | re.IGNORECASE | re.DOTALL)
        
        logger.info(f"Found {len(matches)} matches with primary regex")
        
        for match in matches:
            try:
                time_seconds = int(match[0])
                title = match[1].strip()
                description = match[2].strip()
                
                # Clean up title and description
                title = re.sub(r'[^\w\s\-\.,!?]', '', title)[:50]
                description = re.sub(r'[^\w\s\-\.,!?]', '', description)[:100]
                
                timestamps.append(TimestampItem(
                    time=time_seconds,
                    title=title,
                    description=description
                ))
                logger.info(f"Added timestamp: {time_seconds}s - {title}")
            except (ValueError, IndexError) as e:
                logger.warning(f"Error parsing timestamp match {match}: {e}")
                continue
        
        # If the primary regex didn't work, try a looser approach
        if not timestamps:
            logger.warning("Primary regex failed, trying alternative parsing...")
            
            # Try to find any timestamp-like patterns
            alt_pattern = r'(\d+)(?:s|sec|seconds?)?\s*[-:]\s*([^\n\r]{10,80})'
            alt_matches = re.findall(alt_pattern, response, re.MULTILINE | re.IGNORECASE)
            
            logger.info(f"Found {len(alt_matches)} matches with alternative regex")
            
            for i, match in enumerate(alt_matches[:8]):  # Limit to 8 timestamps
                try:
                    time_seconds = int(match[0])
                    content = match[1].strip()
                    
                    # Split content into title and description if possible
                    if len(content) > 30:
                        title = content[:30] + "..."
                        description = content
                    else:
                        title = content
                        description = f"Content at {time_seconds} seconds"
                    
                    timestamps.append(TimestampItem(
                        time=time_seconds,
                        title=title,
                        description=description[:100]
                    ))
                    logger.info(f"Added alternative timestamp: {time_seconds}s - {title}")
                except (ValueError, IndexError) as e:
                    logger.warning(f"Error parsing alternative match {match}: {e}")
                    continue
    
    except Exception as e:
        logger.error(f"Error parsing timestamps: {e}")
    
    # Sort timestamps by time
    timestamps.sort(key=lambda x: x.time)
    
    # If we still don't have timestamps, create some basic ones based on transcript length
    if not timestamps:
        logger.warning("No timestamps could be parsed, creating basic fallback timestamps")
        # Estimate video length from transcript (rough approximation)
        estimated_length = min(max(len(response) // 50, 300), 1800)  # 5-30 minutes
        
        timestamps = [
            TimestampItem(
                time=0,
                title="Video Introduction",
                description="Opening and introduction to the content"
            ),
            TimestampItem(
                time=estimated_length // 3,
                title="Main Discussion",
                description="Core content and primary topics"
            ),
            TimestampItem(
                time=(estimated_length * 2) // 3,
                title="Key Points",
                description="Important insights and conclusions"
            )
        ]
    
    logger.info(f"Final timestamps count: {len(timestamps)}")
    return timestamps
