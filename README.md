# AI Code Reviewer — Backend

REST API for the AI Code Reviewer app. Handles authentication, stores projects, and proxies code snippets to Groq for review.

---

## Features

- **JWT authentication** — register, login, and protected routes via Bearer tokens
- **Code review endpoint** — sends user code to Groq and returns structured feedback
- **Project persistence** — every review is saved to MongoDB and tied to the user
- **Stateless API** — no sessions, fully token-based

---

## Tech Stack

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [Groq SDK](https://console.groq.com/) for AI-powered code reviews
- [JSON Web Tokens](https://github.com/auth0/node-jsonwebtoken) for auth
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing

---

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/hkumar1403/Ai-code-reviewer.git

# Install dependencies
npm install

# Create your environment file
```

### Environment Variables

Create a `.env` file in the root of the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-code-reviewer
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=gsk_...
```

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default: 3000) |
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWTs — use a long random string |
| `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com) |

### Running Locally

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## API Reference

### Auth

#### `POST /signup`
Create a new account.

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### `POST /login`
Log in and receive a JWT.

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGci..."
  }
}
```

---

### Projects

All project routes require an `Authorization: Bearer <token>` header.

#### `GET /projects`
Returns all projects for the authenticated user.

#### `POST /projects`
Submit code for review. Calls Groq and saves the result.

**Body:**
```json
{
  "code": "string"
}
```

**Response:**
```json
{
  "data": {
    "_id": "...",
    "code": "...",
    "review": "..."
  }
}
```

---

## Project Structure

```
src/
├── models/
│   ├── project.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   └── project.routes.js
├── middleware/
│   └── auth.middleware.js        # JWT verification
└── server.js             # Express app entry point
```

---

## Deployment

This backend is deployed on [Render](https://render.com).

Make sure to set all environment variables in Render's **Environment** tab before deploying. MongoDB Atlas network access should be set to allow all IPs (`0.0.0.0/0`) since Render uses dynamic IPs.

---

## Related

- [Frontend repo](https://github.com/hkumar1403/Ai-code-reviewer-frontend) — React + Vite client
