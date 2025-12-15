## Chat App

Simple real-time chat with a Node/Express backend, MongoDB, Socket.IO, and a static HTML/JS frontend.

### Prerequisites
- Node.js 18+
- No external database needed (in-memory, two-user demo)

### Setup
1. Install backend deps:
   - `cd backend`
   - `npm install`
2. Create a `.env` file in `backend/` with:
   - `PORT=5000`
   - `JWT_SECRET=change-me`

### Run
1. Start the API/socket server:
   - `npm start`
2. Serve the frontend (one option):
   - `cd ../frontend`
   - `npx serve .` (or open `index.html` directly with Live Server)

Open `index.html`, log in with either demo account, then pick the other user in chat to start messaging.

