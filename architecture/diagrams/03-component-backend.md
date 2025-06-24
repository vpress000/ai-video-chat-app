# Component Diagram - FastAPI Backend

## Overview
This diagram shows the internal components of the FastAPI Backend container and their interactions.

## Diagram

```mermaid
C4Component
    title Component Diagram - FastAPI Backend

    Container(frontend, "Frontend", "React", "User interface")
    ContainerDb(postgres, "Database", "PostgreSQL", "Single database instance")
    System_Ext(youtube_api, "YouTube Data API", "Video metadata via Google API Client")
    System_Ext(youtube_transcript_api, "YouTube Transcript Sources", "youtube-transcript-api + yt-dlp")
    System_Ext(openai_api, "OpenAI API", "GPT models for chat/timestamps")

    Container_Boundary(api, "FastAPI Backend - ACTUAL IMPLEMENTATION") {
        Component(main_app, "FastAPI App", "Application", "Main app with CORS middleware")
        
        Component(video_router, "Video Router", "Router", "/api/video endpoints")
        Component(chat_router, "Chat Router", "Router", "/api/chat endpoints")
        Component(search_router, "Search Router", "Router", "/api/search endpoints")
        Component(timestamps_router, "Timestamps Router", "Router", "/api/timestamps endpoints")
        
        Component(transcript_svc, "Transcript Service", "Service", "Multi-source transcript extraction<br/>youtube-transcript-api + yt-dlp + manual")
        
        Component(database_layer, "Database Layer", "SQLAlchemy", "Async PostgreSQL operations")
        Component(models, "Video Model", "SQLAlchemy ORM", "Single Video table")
        Component(schemas, "Pydantic Schemas", "Validation", "Request/Response models")
    }

    %% Frontend to backend
    Rel(frontend, main_app, "API Requests", "HTTP + CORS")

    %% App to routers (include_router calls in main.py)
    Rel(main_app, video_router, "Include router")
    Rel(main_app, chat_router, "Include router")
    Rel(main_app, search_router, "Include router")
    Rel(main_app, timestamps_router, "Include router")

    %% Router operations (actual implementation)
    Rel(video_router, transcript_svc, "Extract transcript")
    Rel(video_router, database_layer, "Store video data")
    Rel(chat_router, openai_api, "Direct OpenAI calls")
    Rel(chat_router, database_layer, "Query video data")
    Rel(search_router, database_layer, "Search transcripts")
    Rel(timestamps_router, openai_api, "Generate timestamps")

    %% External integrations (ACTUAL)
    Rel(transcript_svc, youtube_api, "Video metadata", "Google API Client")
    Rel(transcript_svc, youtube_transcript_api, "Transcript data", "youtube-transcript-api")
    
    %% Data model usage
    Rel(database_layer, models, "Uses ORM")
    Rel(database_layer, postgres, "Async queries")
    
    %% Validation (schemas used in routers)
    Rel(video_router, schemas, "Validates requests")
    Rel(chat_router, schemas, "Validates requests")
    Rel(search_router, schemas, "Validates requests")
    Rel(timestamps_router, schemas, "Validates requests")

    UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="1")
      UpdateElementStyle(main_app, $bgColor="#4A90E2", $fontColor="white")
    UpdateElementStyle(video_router, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(chat_router, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(search_router, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(timestamps_router, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(transcript_svc, $bgColor="#F5A623", $fontColor="white")
    UpdateElementStyle(database_layer, $bgColor="#BD10E0", $fontColor="white")
```

## Component Responsibilities

### API Layer

#### Main Application
- **File**: `main.py`
- **Purpose**: Application bootstrap and configuration
- **Features**:
  - CORS middleware configuration
  - Router registration
  - Database table creation
  - Application lifecycle management

#### Routers
- **Video Router** (`routers/video.py`):
  - `POST /api/video/process`: Process YouTube video URLs
  - Video ID extraction and validation
  - Transcript fetching coordination
  
- **Chat Router** (`routers/chat.py`):
  - `POST /api/chat/{session_id}`: Handle chat messages
  - Session management
  - AI response generation
  
- **Search Router** (`routers/search.py`):
  - `GET /api/search`: Search video content
  - Full-text search implementation
  - Result ranking and pagination
  
- **Timestamp Router** (`routers/timestamps.py`):
  - `POST /api/timestamps`: Generate timestamp links
  - Time-based content mapping
  - Video navigation helpers

### Business Logic Layer

#### Services
- **Video Service**: Coordinates video processing workflow
- **Chat Service**: Manages conversation state and AI interactions
- **Search Service**: Implements search algorithms and ranking
- **Transcript Service**: Handles multiple transcript extraction methods
- **OpenAI Service**: Manages AI API integration and response processing

### Data Layer

#### Database Service
- **Purpose**: Async database operations
- **Technology**: SQLAlchemy with asyncpg driver
- **Features**:
  - Connection pooling
  - Transaction management
  - Query optimization

#### Cache Service
- **Purpose**: Redis operations and caching strategies
- **Features**:
  - Session storage
  - Response caching
  - Rate limiting support

#### Models & Schemas
- **SQLAlchemy Models**: Database schema definitions
- **Pydantic Schemas**: API request/response validation
- **Data validation**: Type checking and serialization

### Cross-Cutting Concerns

#### Middleware
- **Custom Middleware**: Logging, error handling, request tracking
- **CORS Middleware**: Cross-origin request handling
- **Security Middleware**: Input validation and sanitization

## Key Architectural Patterns

1. **Router-Service Pattern**: Clear separation of API routing and business logic
2. **Dependency Injection**: FastAPI's built-in DI for database sessions
3. **Async/Await**: Non-blocking operations throughout the stack
4. **Repository Pattern**: Abstracted data access through services
5. **Schema Validation**: Pydantic models for request/response validation
