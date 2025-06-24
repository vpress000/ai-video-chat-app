# Container Diagram

## Overview
This diagram shows the high-level containers (applications and data stores) that make up the Video Chat Application and how they interact.

## Diagram

```mermaid
C4Container
    title Container Diagram - Video Chat Application

    Person(user, "User", "Content consumer")

    System_Boundary(app_boundary, "Video Chat Application") {
        Container(frontend, "React Frontend", "React, TypeScript", "User interface for video interaction")
        Container(api_gateway, "FastAPI Backend", "Python, FastAPI", "Main API gateway & business logic")
        
        ContainerDb(postgres, "PostgreSQL", "Database", "Video & chat data storage")
        ContainerDb(redis, "Redis Cache", "Cache", "Session & performance cache")
        
        Container(transcript_svc, "Transcript Service", "Python", "Video transcript extraction")
        Container(ai_service, "AI Service", "OpenAI SDK", "Chat AI processing")
    }

    System_Ext(youtube_api, "YouTube API", "Video platform")
    System_Ext(openai_api, "OpenAI API", "AI models")
    System_Ext(transcript_sources, "Transcript Sources", "External extraction")

    %% Main flow
    Rel(user, frontend, "Uses", "HTTPS")
    Rel(frontend, api_gateway, "API calls", "REST/JSON")
    
    %% Backend services
    Rel(api_gateway, postgres, "Store/Query", "SQL")
    Rel(api_gateway, redis, "Cache", "Redis")
    Rel(api_gateway, transcript_svc, "Extract", "Internal")
    Rel(api_gateway, ai_service, "Process", "Internal")
    
    %% External services
    Rel(transcript_svc, youtube_api, "Metadata", "REST")
    Rel(transcript_svc, transcript_sources, "Extract", "API")
    Rel(ai_service, openai_api, "AI calls", "REST")
    
    %% Caching
    Rel(transcript_svc, redis, "Cache", "Redis")
    Rel(ai_service, redis, "Context", "Redis")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
    
    UpdateElementStyle(user, $bgColor="#4A90E2", $fontColor="white")
    UpdateElementStyle(frontend, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(api_gateway, $bgColor="#F5A623", $fontColor="white")
    UpdateElementStyle(postgres, $bgColor="#D0021B", $fontColor="white")
    UpdateElementStyle(redis, $bgColor="#9013FE", $fontColor="white")
    UpdateElementStyle(transcript_svc, $bgColor="#50E3C2", $fontColor="white")
    UpdateElementStyle(ai_service, $bgColor="#BD10E0", $fontColor="white")
```

## Container Responsibilities

### React Frontend
- **Technology**: React 18+, TypeScript, Vite build system
- **Purpose**: Single-page application providing the user interface
- **Key Features**:
  - Video player integration
  - Real-time chat interface
  - Search functionality
  - Timestamp navigation
  - Responsive design

### FastAPI Backend
- **Technology**: Python 3.11+, FastAPI, Uvicorn ASGI server
- **Purpose**: Main API gateway and business logic orchestrator
- **Key Features**:
  - RESTful API endpoints
  - Request validation and sanitization
  - Authentication and session management
  - CORS handling for frontend integration
  - Error handling and logging

### PostgreSQL Database
- **Technology**: PostgreSQL 15+ with asyncpg driver
- **Purpose**: Primary data persistence layer
- **Stored Data**:
  - Video metadata and transcripts
  - Chat conversation history
  - User session information
  - Timestamp mappings

### Redis Cache
- **Technology**: Redis 7+ with redis-py client
- **Purpose**: High-performance caching and session storage
- **Cached Data**:
  - Video transcripts (temporary)
  - Chat conversation context
  - API response caches
  - Rate limiting counters

### Transcript Service
- **Technology**: Python with multiple extraction libraries
- **Purpose**: Specialized video content extraction
- **Capabilities**:
  - Multiple fallback methods for transcript extraction
  - Content cleaning and formatting
  - Timestamp synchronization
  - Error handling for unavailable transcripts

### AI Chat Service
- **Technology**: Python with OpenAI SDK
- **Purpose**: AI-powered conversation management
- **Features**:
  - Context-aware chat responses
  - Video content analysis
  - Timestamp generation
  - Conversation memory management

## Key Architectural Decisions

1. **Microservice Architecture**: Services are logically separated for maintainability
2. **Async/Await Pattern**: Python async throughout for better performance
3. **Caching Strategy**: Redis for performance-critical data
4. **API-First Design**: Clear separation between frontend and backend
5. **External Service Integration**: Robust handling of third-party API dependencies
