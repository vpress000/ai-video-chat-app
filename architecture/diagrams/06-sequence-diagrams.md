# Sequence Diagrams

## Overview
These diagrams show the detailed interactions between system components for key user scenarios.

## 1. Video Processing Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant VideoRouter
    participant TranscriptService
    participant YouTubeAPI
    participant Database

    User->>Frontend: Submit YouTube URL
    Frontend->>VideoRouter: POST /api/video/process
    VideoRouter->>VideoRouter: Extract video ID from URL
    
    VideoRouter->>Database: Check if video exists
    Database-->>VideoRouter: Video not found
    
    VideoRouter->>TranscriptService: Create service instance
    TranscriptService->>YouTubeAPI: Get video metadata
    YouTubeAPI-->>TranscriptService: Video title & info
    
    TranscriptService->>TranscriptService: Try multiple transcript methods
    note over TranscriptService: 1. youtube-transcript-api<br/>2. yt-dlp subtitles<br/>3. Manual extraction<br/>4. Alternative sources
    
    TranscriptService-->>VideoRouter: Transcript text + title suffix
    
    VideoRouter->>Database: Save Video (video_id, title, transcript)
    Database-->>VideoRouter: Video saved
    
    VideoRouter-->>Frontend: Video data response
    Frontend-->>User: Display video player
```

## 2. Chat Interaction Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant ChatRouter
    participant Database
    participant OpenAI

    User->>Frontend: Send chat message
    Frontend->>ChatRouter: POST /api/chat/{job_id}
    ChatRouter->>Database: Query Video by video_id
    Database-->>ChatRouter: Video with transcript
    
    alt Transcript exists and OpenAI configured
        ChatRouter->>OpenAI: Send chat completion request
        note over ChatRouter,OpenAI: System prompt + transcript context<br/>+ user message
        OpenAI-->>ChatRouter: AI response content
        ChatRouter->>ChatRouter: Format response with timestamp
    else No transcript or OpenAI not configured
        ChatRouter->>ChatRouter: Return error message
    end
    
    ChatRouter-->>Frontend: Chat response JSON
    Frontend-->>User: Display AI message
```

## 3. Search Functionality Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant SearchRouter
    participant Database

    User->>Frontend: Enter search query
    Frontend->>SearchRouter: POST /api/search
    SearchRouter->>SearchRouter: Create search term with wildcards
    
    SearchRouter->>Database: Query videos (title ILIKE + transcript ILIKE)
    Database-->>SearchRouter: Matching video records
    
    SearchRouter->>SearchRouter: Calculate relevance scores
    note over SearchRouter: Title match = 1.0<br/>Transcript match = 0.5<br/>Extract content snippets
    
    SearchRouter->>SearchRouter: Sort by relevance score
    SearchRouter-->>Frontend: Search results with snippets
    Frontend-->>User: Display search results
```

## 4. Timestamp Generation Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant TimestampsRouter
    participant Database
    participant OpenAI

    User->>Frontend: Request timestamps
    Frontend->>TimestampsRouter: GET /api/timestamps/{video_id}
    TimestampsRouter->>Database: Query Video by video_id
    Database-->>TimestampsRouter: Video with transcript
    
    alt Transcript exists and OpenAI configured
        TimestampsRouter->>OpenAI: Send completion request
        note over TimestampsRouter,OpenAI: System prompt requesting<br/>timestamp breakdown<br/>+ video transcript
        OpenAI-->>TimestampsRouter: AI-generated timestamps
        TimestampsRouter->>TimestampsRouter: Parse timestamps from response
    else No transcript or OpenAI not configured
        TimestampsRouter->>TimestampsRouter: Return error response
    end
    
    TimestampsRouter-->>Frontend: Timestamps array or error
    Frontend-->>User: Display timestamp navigation
```

## 5. Error Handling Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant VideoRouter
    participant TranscriptService
    participant ExternalAPI

    User->>Frontend: Submit invalid/private video URL
    Frontend->>VideoRouter: POST /api/video/process
    VideoRouter->>VideoRouter: Extract video ID (fails)
    VideoRouter-->>Frontend: HTTP 400 "Invalid YouTube URL"
    
    alt Valid URL but private video
        VideoRouter->>TranscriptService: Process video
        TranscriptService->>ExternalAPI: Try youtube-transcript-api
        ExternalAPI-->>TranscriptService: TranscriptsDisabled exception
        
        TranscriptService->>ExternalAPI: Try yt-dlp method
        ExternalAPI-->>TranscriptService: Extraction failed
        
        TranscriptService->>ExternalAPI: Try manual extraction
        ExternalAPI-->>TranscriptService: 403 Forbidden
        
        TranscriptService-->>VideoRouter: Return (None, "no transcript available")
        VideoRouter->>VideoRouter: Save video with null transcript
        VideoRouter-->>Frontend: Video data with limited functionality
    end
    
    Frontend-->>User: Show appropriate error message
```

## Key Interaction Patterns

### 1. Direct Router Pattern
- All business logic is handled directly in FastAPI routers
- No separate service layer - routers instantiate services as needed
- Direct database operations using SQLAlchemy async sessions

### 2. Error Handling Pattern
- HTTPException raised for client errors (400, 404)
- Graceful degradation when external services fail
- Multiple fallback methods for transcript extraction

### 3. External API Integration Pattern
- Direct async calls to OpenAI API using AsyncOpenAI client
- Multi-method transcript extraction with fallbacks
- Environment variable configuration for API keys

### 4. Database Pattern
- Simple async PostgreSQL operations
- Single Video model with video_id, title, transcript fields
- No caching layer - direct database queries

### 5. Stateless API Design
- Each request is independent
- Session ID used only for chat context identification
- No persistent session storage

## Performance Considerations

1. **Async Operations**: All database and external API calls are async
2. **Direct Integration**: No middleware or service abstraction overhead
3. **Simple Queries**: Basic ILIKE queries for search functionality
4. **Stateless Design**: No session management complexity
5. **Fallback Strategies**: Multiple methods for transcript extraction ensure reliability
