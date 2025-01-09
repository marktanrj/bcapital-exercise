# B Capital Exercise

## Prerequisites
Ensure you have the following installed:

- Docker
- pnpm v9.x
- Node.js v22.13.0 (via nvm)

## Local Development Setup

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

1.  Start PostgreSQL database 
    ```
    docker-compose up
    ```

1.  Install dependencies 
    ```
    pnpm install
    ```

1.  Start the server locally
    ```
    pnpm dev
    ```

