# Church Mobile App

A modern, mobile-first church application built with a Monorepo structure.

## Features
- **Bible Reader**: Multi-version support (English, Hindi, Telugu).
- **Daily Verse**: Automatic daily scripture with sharing options.
- **Quizzes**: Interactive scripture quizzes for Youth and Elders.
- **Content Hub**: Sermons (Audio/Video), Sunday School resources, and Media assets.
- **Communication**: Announcements, Events, and Live Streaming integration.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Capacitor (Mobile).
- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **Database**: PostgreSQL.
- **Tools**: Docker, Nx (compatible structure).

## getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd Kingdom Connect
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    -   `apps/api/.env`:
        ```env
        DATABASE_URL="postgresql://postgres:password@localhost:5432/church?schema=public"
        JWT_SECRET="your-secret-key"
        ```

4.  **Database Migration**:
    ```bash
    npm run prisma:generate -w apps/api
    npm run prisma:push -w apps/api
    ```

### Running Locally (Dev)

1.  **Start Backend**:
    ```bash
    cd apps/api
    npm run dev
    ```

2.  **Start Frontend**:
    ```bash
    cd apps/web
    npm run dev
    ```

3.  **Seed Data**:
    -   POST to `http://localhost:3000/api/v1/communication/seed`
    -   POST to `http://localhost:3000/api/v1/sermons/seed`

### Running with Docker

```bash
docker-compose up --build
```
This will start:
-   PostgreSQL on port 5432
-   API on port 3000
-   Frontend on port 5173

## Deployment
-   **API**: Deploy `apps/api` to any Node.js host (Render, Railway, AWS).
-   **Frontend**: Build `apps/web` (`npm run build`) and deploy `dist` folder to Vercel/Netlify.
-   **Mobile**: Sync with Capacitor (`npm run cap:sync`) and build via Android Studio/Xcode.

## License
MIT
