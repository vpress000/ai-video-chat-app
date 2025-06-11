# Backend - Video Chat Application

FastAPI-based backend service that powers the video chat application with AI integration, transcript processing, and real-time chat capabilities.

## 🎯 Overview

The backend serves as the core engine for video processing, AI-powered chat, and data management. Built with FastAPI for high performance and modern Python async patterns.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Application                     │
├─────────────────────────────────────────────────────────────┤
│  main.py              # Application entry point             │
│  ├── CORS middleware  # Cross-origin request handling       │
│  ├── Router inclusion # API endpoint organization           │
│  └── Database setup   # Async SQLAlchemy configuration      │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                      API Routers                           │
├─────────────────────────────────────────────────────────────┤
│  video.py             # Video processing endpoints          │
│  chat.py              # AI chat conversation endpoints      │
│  timestamps.py        # AI timestamp generation            │
│  search.py            # Content search endpoints           │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                          │
├─────────────────────────────────────────────────────────────┤
│  transcript_service.py # YouTube transcript extraction      │
│  ├── youtube-transcript-api # Primary method               │
│  ├── yt-dlp integration    # Fallback extraction          │
│  └── Manual caption fetch  # Last resort method           │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                   Database Layer                           │
├─────────────────────────────────────────────────────────────┤
│  models.py            # SQLAlchemy ORM models              │
│  database.py          # Async database configuration       │
│  schemas.py           # Pydantic request/response models   │
│  alembic/             # Database migration management      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Key Features

### 📹 Video Processing
- **Multi-source Transcript Extraction**: Robust fallback system
- **YouTube URL Parsing**: Support for various URL formats
- **Metadata Collection**: Title, duration, and video information
- **Database Persistence**: Efficient storage and retrieval

### 🤖 AI Integration
- **OpenAI GPT-4 Turbo**: Advanced language model integration
- **Contextual Chat**: Transcript-aware conversation system
- **Smart Timestamps**: Automatic content section generation
- **Error Handling**: Graceful AI service failure management

### 🔍 Content Analysis
- **Transcript Processing**: Clean and structured text analysis
- **Semantic Understanding**: Context-aware content interpretation
- **Search Capabilities**: Text-based content discovery
- **Performance Optimization**: Efficient query processing

## 🛠️ Technology Stack

### Core Framework
- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for production deployment
- **Python 3.8+**: Modern Python with async/await support

### Database & ORM
- **PostgreSQL**: Robust relational database
- **SQLAlchemy**: Async ORM with relationship management
- **Alembic**: Database migration and version control
- **asyncpg**: High-performance PostgreSQL adapter

### AI & External Services
- **OpenAI API**: GPT-4 Turbo for chat and analysis
- **youtube-transcript-api**: Primary transcript extraction
- **yt-dlp**: Backup transcript and metadata extraction
- **Google YouTube API**: Enhanced metadata (optional)

### Data Validation & Serialization
- **Pydantic**: Data validation and serialization
- **Type Hints**: Full type safety throughout codebase
- **JSON Schema**: Automatic API documentation

## 📋 Prerequisites

- **Python 3.8+**
- **PostgreSQL 12+**
- **OpenAI API key**
- **YouTube API key** (optional)

## 🚀 Setup & Installation

### 1. Environment Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Configuration
```bash
# Create PostgreSQL database
createdb video_chat_db

# Run migrations
alembic upgrade head
```

### 3. Environment Variables
Create `.env` file:
```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://username:password@localhost/video_chat_db

# AI Service Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Enhanced YouTube metadata
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 4. Start Development Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Endpoints

### Video Processing
```http
POST /api/video/process
Content-Type: application/json

{
  "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID"
}

Response:
{
  "id": 1,
  "video_id": "VIDEO_ID",
  "title": "Video Title",
  "transcript": "Full transcript text...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### AI Chat
```http
POST /api/chat/{job_id}
Content-Type: application/json

{
  "message": "What is this video about?",
  "videoId": "VIDEO_ID"
}

Response:
{
  "success": true,
  "message": {
    "id": "asst_123456789",
    "role": "assistant",
    "content": "This video discusses...",
    "timestamp": 1640995200000
  },
  "sessionId": "session_123"
}
```

### Timestamp Generation
```http
GET /api/timestamps/{video_id}

Response:
{
  "success": true,
  "timestamps": [
    {
      "time": 0,
      "title": "Introduction",
      "description": "Video opening and context setting"
    },
    {
      "time": 120,
      "title": "Main Discussion",
      "description": "Core topic exploration"
    }
  ]
}
```

### Search
```http
GET /api/search?query=search_term&video_id=VIDEO_ID

Response:
{
  "success": true,
  "results": [
    {
      "timestamp": 45,
      "content": "Relevant transcript excerpt...",
      "relevance_score": 0.95
    }
  ]
}
```

## 🗂️ Project Structure

```
backend/
├── main.py                   # FastAPI application entry
├── database.py               # Database configuration
├── models.py                 # SQLAlchemy ORM models
├── schemas.py                # Pydantic models
├── requirements.txt          # Python dependencies
├── alembic.ini              # Alembic configuration
├── .env                     # Environment variables
├── routers/                 # API route handlers
│   ├── __init__.py
│   ├── video.py            # Video processing endpoints
│   ├── chat.py             # Chat conversation endpoints
│   ├── timestamps.py       # Timestamp generation
│   └── search.py           # Search functionality
├── services/               # Business logic layer
│   ├── __init__.py
│   └── transcript_service.py # Video transcript extraction
└── alembic/               # Database migrations
    ├── env.py
    ├── versions/
    └── script.py.mako
```

## 🔧 Development

### Database Migrations
```bash
# Create new migration
alembic revision --autogenerate -m "Add new feature"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Adding New Endpoints
1. Create router in `routers/` directory
2. Add business logic to `services/` if needed
3. Update `main.py` to include router
4. Add Pydantic models to `schemas.py`

### Testing
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
python -m pytest

# Run with coverage
python -m pytest --cov=.
```

### Code Quality
```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U username -d video_chat_db
```

**OpenAI API Issues**
- Verify API key is valid and has credits
- Check rate limits and quota
- Review API response errors in logs

**Transcript Extraction Failures**
- Ensure yt-dlp is up to date: `pip install -U yt-dlp`
- Check YouTube video availability
- Verify video has captions/transcripts

**Performance Issues**
- Monitor database query performance
- Check async/await usage
- Review connection pooling settings

### Logging
```python
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

# Check logs for specific modules
logger = logging.getLogger("app.video_processing")
```

## 🔒 Security Considerations

### API Keys
- Store API keys in environment variables
- Never commit secrets to version control
- Use different keys for development/production

### Database Security
- Use strong database passwords
- Enable SSL connections in production
- Implement proper access controls

### Input Validation
- All inputs validated via Pydantic
- SQL injection prevention via SQLAlchemy
- Rate limiting for API endpoints

## 🚀 Production Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Configuration
```env
# Production settings
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/video_chat_db
OPENAI_API_KEY=prod_api_key
```

### Health Checks
```bash
# Check API health
curl http://localhost:8000/

# Check database connection
curl http://localhost:8000/health/db
```

## 📊 Monitoring & Performance

### Metrics
- API response times
- Database query performance
- OpenAI API usage and costs
- Error rates and types

### Optimization
- Database indexing for video queries
- Caching for frequently accessed transcripts
- Async processing for long-running tasks
- Connection pooling optimization

## 🤝 Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Write tests for new features
4. Update documentation
5. Use meaningful commit messages

## 📄 License

This backend service is part of the Video Chat Application project, licensed under the MIT License.
