
# ChatGPT Clone

Simple chat app built with Next.js, Nest.js, PostgreSQL, Redis, and Vercel AI SDK.

&nbsp;
<img src="./images/demo.jpg" width="600" height="355" alt="Demo" />

## Prerequisites
Ensure you have the following installed:

- Docker
- pnpm v9.x
- Node.js v22.13.0 (via nvm)

## Tech Stack

- TypeScript - For type-safe development
- Next.js - Modern frontend React framework
- Nest.js - Node.js framework for scalable backend
- PostgreSQL - Relational database
- Redis - In-memory store for caching
- TailwindCSS - Styling
- Kysely - Type-safe SQL query builder for TypeScript
- Anthropic - LLM API integration
- Vercel AI SDK - Wrapper for AI chat functionalities

## Local Development Setup

#### Server setup

1. Go to server directory
    ```
    cd server
    ```

1. Set correct Nodejs version 
    ```
    nvm use
    ```

1. Configure your environment
    ```
    cp .env.example .env.development
    ```
    Important note: Add your `ANTHROPIC_API_KEY`

1.  Setup and start PostgreSQL db and Redis cache 
    ```
    docker-compose up
    ```

1.  Install dependencies 
    ```
    pnpm install
    ```

1.  Run database migrations
    ```
    pnpm db:migrate:dev
    ```

1.  Start the server locally
    ```
    pnpm dev
    ```

#### Website setup

1.  Go to website directory
    ```
    cd website
    ```

1. Configure your environment
    ```
    cp .env.example .env.local
    ```
    *note: no other changes needed*

1.  Install dependencies
    ```
    pnpm install
    ```

1.  Run website locally
    ```
    pnpm dev
    ```

## Local development links

1. App: http://localhost:3000
1. Swagger API Docs: http://localhost:4000/api

## Database Schema Design

![Models](./images/models.jpg)

Relationships
- One User can have many Chats (1:N)
- One Chat can have many Messages (1:N)

## Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer (Next.js)"]
        React["React Components"]
        API_Client["API Client"]
        Vercel_AI_UI["Vercel AI SDK UI"]
        useChat["useChat Hook"]
        streamText["streamText Utility"]
    end

    subgraph Server["Server Layer (NestJS)"]
        Controllers["REST Controllers"]
        Services["Services"]
        Vercel_AI_Core["Vercel AI SDK Core"]
        Cache_Module["Cache Module"]
        DB_Module["Database Module"]
        LLM_Client["LLM Client"]
    end

    subgraph External["External Services"]
        Anthropic["Anthropic API"]
    end

    subgraph Data["Data Layer"]
        Redis["Redis Cache"]
        PostgreSQL["PostgreSQL Database"]
    end

    %% Frontend connections
    React --> API_Client
    React --> useChat
    React --> streamText
    useChat --> Vercel_AI_UI
    streamText --> Vercel_AI_UI
    Vercel_AI_UI -->|SSE| Vercel_AI_Core
    
    %% API connections
    API_Client -->|HTTP/REST| Controllers
    
    %% Backend internal connections
    Controllers --> Services
    Vercel_AI_Core --> Services
    Services --> Cache_Module
    Services --> DB_Module
    Services --> LLM_Client
    LLM_Client -->|Vercel AI SDK Core| Anthropic
    
    %% Data layer connections
    Cache_Module -->|Redis Client| Redis
    DB_Module -->|Knex/Kysely| PostgreSQL

    %% Styling
    classDef frontend fill:#42b883,stroke:#333,stroke-width:2px,color:white
    classDef backend fill:#ea2845,stroke:#333,stroke-width:2px,color:white
    classDef database fill:#336791,stroke:#333,stroke-width:2px,color:white
    classDef cache fill:#dc382d,stroke:#333,stroke-width:2px,color:white
    classDef vercel fill:#000000,stroke:#333,stroke-width:2px,color:white
    classDef external fill:#4a47a3,stroke:#333,stroke-width:2px,color:white

    class React,API_Client frontend
    class Controllers,Services,Vercel_AI_Core,Cache_Module,DB_Module,LLM_Client backend
    class PostgreSQL database
    class Redis cache
    class Vercel_AI_UI,useChat,streamText vercel
    class Anthropic external
```

## Folder Structure

#### Server

```
src/                    # NestJS app
├── cache/              # Caching implementation
├── config/             # App configs
├── database/           # DB configs & services
├── llm/                # LLM wrappers
├── migrations/         # DB migrations
├── modules/            # Feature modules
│   ├── auth/
│   │   ├── dto/                    # data transfer objects
│   │   ├── auth.controller.ts     
│   │   ├── auth.guard.ts           # Session auth
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── auth.type.ts
│   ├── chat/                       # Chat CRUD
│   │   ├── chat.model.ts
│   │   └── chat.repository.ts
│   ├── message/                    # Message CRUD
│   ├── stream/                     # SSE stream
│   └── user/                       # User CRUD
├── scripts             # Migration scripts
├── types               
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts             # Entry point
```

#### Client

```
website/            
├── api/                # API integration (not Nextjs API) 
├── app/                # App router
│   ├── chat/               # Chat route
│   │   └── [id]/           # Chat Id
│   │       └── page.tsx    
│   ├── login/              # Login route
│   │   └── page.tsx        
│   ├── sign-up/            # Sign up route
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   └── ui/             # Shadcn UI components
├── constants/
├── hooks/              # Custom hooks
│   ├── auth/
│   ├── chat/
│   └── message/
├── lib/
├── providers/
├── public/
├── store/
├── .env.example
└── middleware.ts      # Handles protected routes 
```
