# VC Interview Platform

A full-stack technical interview platform that combines real-time video calling, chat, and a collaborative code editor to simulate remote coding interviews.

## Features

- **Real-time Communication**: High-quality video and audio calls powered by [Stream Video](https://getstream.io/video/).
- **Integrated Chat**: Text chat functionality alongside video calls using [Stream Chat](https://getstream.io/chat/).
- **Collaborative Code Editor**: Interactive coding environment based on [Monaco Editor](https://microsoft.github.io/monaco-editor/).
- **Authentication**: Secure user authentication and management via [Clerk](https://clerk.com/).
- **Modern UI**: Polished interface built with Tailwind CSS and DaisyUI.
- **Full-Stack Architecture**: React frontend and Node.js/Express backend with MongoDB.

## Tech Stack

### Frontend

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4, DaisyUI
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router
- **Key SDKs**:
  - `@clerk/clerk-react` (Auth)
  - `@stream-io/video-react-sdk` (Video)
  - `stream-chat-react` (Chat)
  - `@monaco-editor/react` (Code Editor)
- **Testing**: Vitest, React Testing Library

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Key SDKs**:
  - `@clerk/express`
  - `@stream-io/node-sdk`
  - `inngest` (Event-driven background jobs)
- **Testing**: Jest, Supertest

### E2E Testing

- **Framework**: Playwright

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Connection String
- Accounts and API Keys for:
  - Clerk
  - Stream (Video & Chat)

### Environment Setup

#### Backend

Create a `.env` file in the `backend` directory:

```env
PORT=5000
DB_URL=mongodb+srv://... # Your MongoDB connection string
NODE_ENV=development # development | production | test

# Clerk Auth
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Stream (Video & Chat)
STREAM_API_KEY=...
STREAM_API_SECRET=...

# Inngest (Optional/If used)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Client Configuration
CLIENT_URL=http://localhost:5173
```

#### Frontend

Create a `.env` file in the `frontend` directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STREAM_API_KEY=...
VITE_API_BASE_URL=http://localhost:5000/api
```

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/codersjj/vc-interview.git
   cd vc-interview
   ```

2. **Install dependencies:**
   You can install dependencies for both frontend and backend manually or use the root helper script (if available).

   ```bash
   # Install Frontend Dependencies
   cd frontend
   npm install

   # Install Backend Dependencies
   cd ../backend
   npm install
   ```

### Running the Application

To run the full stack, you need to start both the backend server and the frontend development server.

1. **Start the Backend:**

   ```bash
   cd backend
   npm run dev
   ```

   The backend will start on `http://localhost:5000` (or your configured PORT).

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

### Testing

- **Frontend Unit Tests**:
  ```bash
  cd frontend && npm test
  ```
- **Backend Unit Tests**:
  ```bash
  cd backend && npm test
  ```
- **End-to-End Tests**:
  ```bash
  npx playwright test
  ```
