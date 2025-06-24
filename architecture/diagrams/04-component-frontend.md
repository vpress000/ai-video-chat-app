# Component Diagram - React Frontend

## Overview
This diagram shows the internal components of the React Frontend container and their interactions.

## Diagram

```mermaid
C4Component
    title Component Diagram - React Frontend

    Container(backend, "Backend API", "FastAPI", "REST API services")
    System_Ext(youtube_player, "YouTube Player", "Embedded player")
    
    Container_Boundary(frontend, "React Frontend - ACTUAL STRUCTURE") {
        Component(app, "App.tsx", "Main Component", "Central state management + useEffect")
        
        Component(video_player, "VideoPlayer", "Component", "YouTube embed player")
        Component(chat_interface, "ChatInterface", "Component", "Chat UI with message history")
        Component(search_input, "SearchInput", "Component", "Video search interface")
        Component(timestamp_links, "TimestampLinks", "Component", "Video navigation")
        
        Component(video_api, "videoApi.ts", "Service", "processVideo() + getVideoTimestamps()")
        Component(chat_api, "chatApi.ts", "Service", "sendMessage() + startNewSession()")
        Component(search_api, "searchApi.ts", "Service", "searchVideoContent()")
        Component(timestamps_api, "timestampsApi.ts", "Service", "generateTimestamps()")
        
        Component(types, "types/index.ts", "TypeScript", "Interface definitions")
        Component(video_utils, "videoUtils.ts", "Utilities", "Video helper functions")
        Component(app_css, "App.css", "Styles", "Application styling")
    }

    %% External integration
    Rel(video_player, youtube_player, "Embeds player", "YouTube Player API")

    %% Component hierarchy (ACTUAL from App.tsx)
    Rel(app, video_player, "Renders with currentVideo")
    Rel(app, chat_interface, "Renders with chatMessages")
    Rel(app, search_input, "Renders with handleSearch")
    Rel(app, timestamp_links, "Renders with timestamps")

    %% Service usage (ACTUAL imports in App.tsx)
    Rel(app, video_api, "processVideo() function")
    Rel(app, chat_api, "sendMessage() + startNewSession()")
    Rel(app, search_api, "searchVideoContent()")
    Rel(app, timestamps_api, "generateTimestamps()")
    
    %% API to Backend (ACTUAL ENDPOINTS)
    Rel(video_api, backend, "/api/video/process")
    Rel(chat_api, backend, "/api/chat/message")
    Rel(search_api, backend, "/api/search/content")
    Rel(timestamps_api, backend, "/api/timestamps/generate")    %% Utilities and types
    Rel(video_api, types, "TypeScript interfaces")
    Rel(chat_api, types, "ChatMessage interface")
    Rel(app, types, "Component props")
    
    %% Styling
    Rel(app, app_css, "Imports styles")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")    %% Utilities and types
    Rel(video_api, types, "TypeScript interfaces")
    Rel(chat_api, types, "ChatMessage interface")
    Rel(app, types, "Component props")
    
    %% Styling
    Rel(app, app_css, "Imports styles")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

    UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="1")
    
    UpdateElementStyle(app, $bgColor="#4A90E2", $fontColor="white")
    UpdateElementStyle(video_player, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(chat_ui, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(search_ui, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(timestamp_ui, $bgColor="#7ED321", $fontColor="white")
    UpdateElementStyle(video_api, $bgColor="#F5A623", $fontColor="white")
    UpdateElementStyle(chat_api, $bgColor="#F5A623", $fontColor="white")
    UpdateElementStyle(search_api, $bgColor="#F5A623", $fontColor="white")
```

## Component Responsibilities

### Core Components

#### App Component (`App.tsx`)
- **Purpose**: Main application orchestrator
- **Responsibilities**:
  - Global state management
  - Component composition and layout
  - Error boundary implementation
  - Loading state coordination
  - Session management

#### VideoPlayer Component (`components/VideoPlayer.tsx`)
- **Purpose**: YouTube video integration and control
- **Features**:
  - YouTube Player API integration
  - Video playback controls
  - Timestamp seeking
  - Video metadata display
  - Responsive video embedding

#### ChatInterface Component (`components/ChatInterface.tsx`)
- **Purpose**: Real-time chat interface
- **Features**:
  - Message display and formatting
  - User input handling
  - Auto-scrolling chat history
  - Typing indicators
  - Message status indicators

#### SearchInput Component (`components/SearchInput.tsx`)
- **Purpose**: Content search functionality
- **Features**:
  - Search query input with validation
  - Auto-complete suggestions
  - Search result highlighting
  - Advanced search filters
  - Search history

#### TimestampLinks Component (`components/TimestampLinks.tsx`)
- **Purpose**: Video navigation through timestamps
- **Features**:
  - Clickable timestamp generation
  - Video seeking integration
  - Timestamp formatting
  - Context-aware navigation
  - Bookmark functionality

### Service Layer

#### API Services
- **Video API Service** (`services/videoApi.ts`):
  - Video URL processing
  - Metadata fetching
  - Error handling for invalid URLs
  
- **Chat API Service** (`services/chatApi.ts`):
  - Chat message sending/receiving
  - Session management
  - Real-time communication
  
- **Search API Service** (`services/searchApi.ts`):
  - Search query execution
  - Result filtering and ranking
  - Search analytics
  
- **Timestamp API Service** (`services/timestampsApi.ts`):
  - Timestamp generation requests
  - Video time mapping
  - Navigation coordination

#### Utility Services
- **Embedding Service** (`services/embeddingService.ts`):
  - Video embedding logic
  - Player configuration
  - Responsive sizing
  
- **Video Utils** (`utils/videoUtils.ts`):
  - YouTube URL parsing
  - Video ID extraction
  - URL validation
  - Format conversion

### Data Management

#### State Management
- **Technology**: React Hooks (useState, useEffect, useContext)
- **Purpose**: Global application state
- **Managed State**:
  - Current video information
  - Chat conversation history
  - Search results and filters
  - UI state (loading, errors)
  - User session data

#### Type Definitions (`types/index.ts`)
- **Purpose**: TypeScript interface definitions
- **Includes**:
  - API response types
  - Component prop interfaces
  - State object definitions
  - Event handler types
  - Configuration objects

### Presentation Layer

#### CSS Modules (`App.css`, component styles)
- **Purpose**: Styling and responsive design
- **Features**:
  - Component-scoped styles
  - Responsive breakpoints
  - Theme variables
  - Animation definitions
  - Accessibility considerations

## Key Frontend Patterns

1. **Component Composition**: Building UI through small, reusable components
2. **Service Layer**: Abstracting API calls into dedicated service modules
3. **Custom Hooks**: Encapsulating stateful logic in reusable hooks
4. **Type Safety**: Full TypeScript integration for compile-time safety
5. **Responsive Design**: Mobile-first CSS with flexible layouts

## State Management Strategy

1. **Local State**: Component-level state using useState
2. **Lifted State**: Shared state managed in parent components
3. **Context API**: Global state for authentication and user preferences
4. **Service State**: API-related state managed in service modules
5. **Caching**: Client-side caching for frequently accessed data
