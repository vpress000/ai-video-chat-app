# Video Chat Application

A full-stack application that allows users to interact with YouTube videos through AI-powered chat, automatic timestamp generation, and intelligent content search.

## 🎯 Overview

This application combines video processing, AI analysis, and interactive chat to create an intelligent video companion. Users can upload YouTube videos, receive AI-generated timestamps, chat about the content, and search through video transcripts.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│  • VideoPlayer Component (YouTube embed)                   │
│  • ChatInterface (AI-powered conversations)                │
│  • TimestampLinks (AI-generated navigation)                │
│  • SearchInput (Content search functionality)              │
└─────────────────────────────────────────────────────────────┘
                               │
                          HTTP/REST API
                               │
┌─────────────────────────────────────────────────────────────┐
│                Backend (FastAPI + Python)                  │
├─────────────────────────────────────────────────────────────┤
│  • Video Processing (transcript extraction)                │
│  • AI Integration (OpenAI GPT-4 Turbo)                    │
│  • Timestamp Generation (content analysis)                 │
│  • Chat Management (contextual responses)                  │
│  • Search Functionality (transcript-based)                 │
└─────────────────────────────────────────────────────────────┘
                               │
                        Database Layer
                               │
┌─────────────────────────────────────────────────────────────┐
│                PostgreSQL Database                         │
├─────────────────────────────────────────────────────────────┤
│  • Videos table (metadata, transcripts)                   │
│  • Async SQLAlchemy ORM                                   │
│  • Database migrations (Alembic)                          │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Key Features

### 📹 Video Processing
- **YouTube Integration**: Support for various YouTube URL formats
- **Transcript Extraction**: Multiple fallback methods (youtube-transcript-api, yt-dlp)
- **Metadata Storage**: Video titles, IDs, and full transcripts

### 🤖 AI-Powered Features
- **Intelligent Chat**: Context-aware conversations about video content
- **Automatic Timestamps**: AI-generated section markers with descriptions
- **Content Analysis**: Smart parsing of video transcripts

### 🔍 Search & Navigation
- **Transcript Search**: Find specific content within videos
- **Timestamp Navigation**: Jump to relevant video sections
- **Visual UI**: Interactive search results with time-based navigation

### 💬 Interactive Chat
- **Contextual Responses**: AI answers based on video transcripts
- **Session Management**: Persistent chat sessions per video
- **Real-time Messaging**: Instant responses with loading states

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Modern CSS** with responsive design
- **Fetch API** for HTTP requests
- **Component Architecture** with reusable components

### Backend
- **FastAPI** for high-performance API
- **SQLAlchemy** with async support
- **PostgreSQL** for data persistence
- **OpenAI API** for AI capabilities
- **Pydantic** for data validation

### External Services
- **OpenAI GPT-4 Turbo** for chat and timestamp generation
- **YouTube API** for video metadata
- **yt-dlp** for transcript extraction

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **PostgreSQL** database
- **OpenAI API key**
- **YouTube API key** (optional, for enhanced metadata)

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd video-chat-app
chmod +x setup.sh
./setup.sh
```

### 2. Environment Configuration
Create `.env` file in the backend directory:
```bash
# Database
DATABASE_URL=postgresql+asyncpg://username:password@localhost/video_chat_db

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here  # Optional
```

### 3. Start Backend
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start Frontend
```bash
cd frontend
npm start
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📚 API Endpoints

### Video Processing
- `POST /api/video/process` - Process YouTube video and extract transcript
- `GET /api/timestamps/{video_id}` - Generate AI-powered timestamps

### Chat & Search
- `POST /api/chat/{job_id}` - Send chat message about video content
- `GET /api/search` - Search through video transcripts (placeholder)

### Health & Status
- `GET /` - API health check
- `GET /docs` - Interactive API documentation

## 🏃‍♂️ Usage Workflow

1. **Enter YouTube URL**: Paste any YouTube video URL
2. **Video Processing**: System extracts transcript and metadata
3. **AI Analysis**: Generate intelligent timestamps automatically
4. **Interactive Chat**: Ask questions about the video content
5. **Navigate Content**: Use timestamps to jump to specific sections

## 🔧 Development

### Database Migrations
```bash
cd backend
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

### Adding New Features
- **Frontend**: Add components in `src/components/`
- **Backend**: Add routers in `routers/`
- **Database**: Update models in `models.py`

### Testing
```bash
# Frontend
cd frontend && npm test

# Backend
cd backend && python -m pytest
```
   ```
   npm start
   ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Dependencies
- React
- TypeScript
- YouTube Transcript API
- Other necessary libraries as specified in `package.json`

## 🚨 Troubleshooting

### Common Issues

**Video Processing Fails**
- Check YouTube URL format
- Verify internet connection
- Ensure yt-dlp is installed

**Chat Not Working**
- Verify OpenAI API key
- Check backend logs for errors
- Ensure database connection

**Timestamps Missing**
- Check OpenAI API quota
- Verify transcript availability
- Review backend error logs

**Database Connection**
- Confirm PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

## 📖 Project Structure

```
video-chat-app/
├── README.md                 # This file
├── setup.sh                  # Automated setup script
├── backend/                  # Python FastAPI backend
│   ├── README.md            # Backend-specific documentation
│   ├── main.py              # FastAPI application entry
│   ├── models.py            # Database models
│   ├── routers/             # API route handlers
│   └── services/            # Business logic services
└── frontend/                # React TypeScript frontend
    ├── README.md            # Frontend-specific documentation
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API communication
    │   └── utils/           # Helper utilities
    └── public/              # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 Turbo API
- YouTube for video content access
- FastAPI and React communities
- Contributors and testers