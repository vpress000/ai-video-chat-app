from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession 
from sqlalchemy import select
from pydantic import BaseModel
import logging
import os 
import openai
from openai import AsyncOpenAI # Import AsyncOpenAI

# Assuming you have a database session utility like in your video router
from database import get_db 
# Assuming your Video model is in models.py
from models import Video 

logger = logging.getLogger(__name__)

# Initialize OpenAI Client
# It's generally recommended to initialize the client once when the module loads.
# Ensure your OPENAI_API_KEY is set in your .env file and loaded by main.py
if os.getenv("OPENAI_API_KEY"):
    # openai.api_key = os.getenv("OPENAI_API_KEY") # Not needed for client instantiation approach
    try:
        client = AsyncOpenAI() # Use AsyncOpenAI for awaitable calls
        logger.info("AsyncOpenAI client initialized.")
    except Exception as e:
        logger.error(f"Failed to initialize AsyncOpenAI client: {e}")
        client = None
else:
    logger.warning("OPENAI_API_KEY not found in environment variables. Chat functionality will be limited.")
    client = None

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
)

class ChatRequest(BaseModel):
    message: str
    videoId: str | None = None # videoId might be passed in the path or body

# ChatResponse model is not strictly needed here for the return if we match the dict structure
# class ChatResponse(BaseModel):
#     id: str
#     role: str
#     content: str
#     timestamp: int # Unix timestamp

@router.post("/{job_id}")
async def handle_chat_message(
    job_id: str, 
    request: ChatRequest, 
    db: AsyncSession = Depends(get_db)
):
    logger.info(f"Received chat message for job_id: {job_id}, message: {request.message}")

    video_id_to_check = request.videoId if request.videoId else job_id
    
    stmt = select(Video).where(Video.video_id == video_id_to_check)
    result = await db.execute(stmt)
    video = result.scalars().first()
    
    transcript_text = None
    if video and video.transcript:
        transcript_text = video.transcript
        logger.info(f"Transcript found for video ID: {video_id_to_check}")
    else:
        logger.warning(f"Video or transcript not found for ID: {video_id_to_check}")

    assistant_response_content = "I could not process your request. Video transcript not available."

    if client and transcript_text:
        try:
            logger.info("Sending request to OpenAI API (async)...")
            messages = [
                {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided video transcript. Be concise and directly answer the user's question using the transcript context."},
                {"role": "user", "content": f"Video Transcript:\n\n{transcript_text}\n\nQuestion: {request.message}"}
            ]
            
            chat_completion = await client.chat.completions.create( # This is now correctly awaitable
                model="gpt-4-turbo",
                messages=messages
            )
            
            assistant_response_content = chat_completion.choices[0].message.content
            logger.info("Received response from OpenAI API.")

        except openai.APIError as e:
            logger.error(f"OpenAI API Error: {e}")
            assistant_response_content = f"Sorry, I encountered an error communicating with the AI: {e}"
        except Exception as e:
            logger.error(f"An unexpected error occurred with OpenAI: {e}")
            assistant_response_content = "Sorry, an unexpected error occurred while processing your chat request."
    elif not client:
        assistant_response_content = "AI assistant is not configured (OPENAI_API_KEY missing)."

    import time
    current_timestamp = int(time.time() * 1000)
    
    return {
        "success": True,
        "message": {
            "id": f"asst_{current_timestamp}",
            "role": "assistant",
            "content": assistant_response_content,
            "timestamp": current_timestamp
        },
        "sessionId": job_id
    }
