<div align="center">

# 📱 SocialFeed

### A full-stack mini social posting application built for a 3W internship assignment.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## ✨ Features

- 🔐 **Authentication** — Signup & Login with JWT tokens
- 📰 **Social Feed** — Browse all posts from every user
- ❤️ **Like Posts** — Optimistic UI (instant feedback, no waiting)
- 💬 **Comments** — Expandable comment tray with real-time append
- 🖼️ **Image Upload** — Upload post images via ImageKit CDN
- 🔍 **Search & Filter** — Filter feed by Most Liked, Most Commented
- 📱 **Mobile-First** — Fully responsive, inspired by TaskPlanet UI
- 🧭 **Bottom Navigation** — Feed · Profile · Create · Chat tabs

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework (Functional Components + Hooks) |
| React Router DOM v6 | Client-side routing |
| React Context API | Global state (Auth + Posts) |
| Axios | HTTP client |
| Vite | Build tool & dev server |
| Vanilla CSS Modules | Styling (no Tailwind) |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File upload middleware |
| ImageKit | Image CDN & storage |
| CORS | Cross-origin request handling |

---

## 📁 Project Structure

```
3Wassignment/
├── backend/
│   ├── server.js                  # Entry point
│   └── src/
│       ├── app.js                 # Express app setup
│       ├── config/
│       │   ├── db.js              # MongoDB connection
│       │   └── imagekit.js        # ImageKit config
│       ├── controllers/
│       │   ├── authController.js  # Register & Login
│       │   └── postController.js  # CRUD + Like + Comment
│       ├── middleware/
│       │   ├── authMiddleware.js  # JWT protect route
│       │   └── uploadMiddleware.js# Multer file handler
│       ├── models/
│       │   ├── User.js            # User schema
│       │   └── Post.js            # Post schema (with comments)
│       └── routes/
│           ├── authRoutes.js
│           └── postRoutes.js
│
└── frontend/
    ├── index.html
    ├── vercel.json                # SPA routing for Vercel
    └── src/
        ├── api/
        │   ├── axiosConfig.js     # Base URL + JWT interceptor
        │   ├── auth.js            # Auth API calls
        │   └── posts.js           # Post API calls
        ├── context/
        │   ├── AuthContext.jsx    # User session state
        │   └── PostsContext.jsx   # Feed + optimistic updates
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.jsx  # Header + bottom nav wrapper
        │   │   └── BottomNav.jsx  # Fixed bottom navigation
        │   ├── feed/
        │   │   ├── PostCard.jsx   # Single post card
        │   │   ├── PostList.jsx   # Mapped feed list
        │   │   └── PostFilters.jsx# Filter pill tabs
        │   └── comments/
        │       └── CommentTray.jsx# Expandable comment section
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── SignupPage.jsx
        │   ├── FeedPage.jsx
        │   ├── CreatePostPage.jsx
        │   ├── ProfilePage.jsx
        │   └── ChatPage.jsx
        └── styles/
            └── index.css          # Global design tokens + reset
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (or local MongoDB)
- ImageKit account

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/3Wassignment.git
cd 3Wassignment
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
PORT=5000
JWT_SECRET=your_super_secret_key_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
# Server running at http://localhost:5000
```

---

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run dev
# App running at http://localhost:5173
```

---

## 🌐 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | `{ username, email, password }` | Register new user |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | Login user |

**Response:**
```json
{
  "_id": "...",
  "username": "nilesh",
  "email": "nilesh@example.com",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### Post Routes — `/api/posts`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `GET` | `/api/posts/feed` | ❌ | — | Get all posts (newest first) |
| `POST` | `/api/posts/create-posts` | ✅ | `FormData { caption, image }` | Create a new post |
| `PUT` | `/api/posts/:id/like` | ✅ | — | Toggle like on a post |
| `POST` | `/api/posts/:id/comments` | ✅ | `{ text }` | Add a comment |

**Post object shape:**
```json
{
  "_id": "...",
  "user": { "_id": "...", "username": "nilesh" },
  "caption": "Hello world!",
  "imageUrl": "https://ik.imagekit.io/...",
  "likes": ["userId1", "userId2"],
  "comments": [
    { "_id": "...", "user": { "username": "john" }, "text": "Nice post!" }
  ],
  "createdAt": "2026-06-09T14:00:00.000Z"
}
```

---

## 🗄️ Database Schema

### User
```js
{
  username : String  (required, unique),
  email    : String  (required, unique),
  password : String  (hashed with bcryptjs),
}
```

### Post
```js
{
  user     : ObjectId  → ref: User,
  caption  : String,
  imageUrl : String,
  likes    : [ObjectId → ref: User],
  comments : [{
    user : ObjectId → ref: User,
    text : String,
  }],
  timestamps: true
}
```

---

## ☁️ Deployment

| Service | Platform | URL |
|---|---|---|
| 🌐 Frontend | Vercel | `https://your-app.vercel.app` |
| ⚙️ Backend | Render.com | `https://your-api.onrender.com` |
| 🗄️ Database | MongoDB Atlas | Cloud hosted |
| 🖼️ Images | ImageKit CDN | Cloud hosted |

> See the full deployment guide in [`DEPLOYMENT.md`](./DEPLOYMENT.md) or ask the project maintainer.

---

## 📸 Screenshots

> Login · Feed · Create Post · Profile screens are mobile-first (max-width 480px).

---

## 🔑 Environment Variables Summary

### Backend (`.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default: 5000) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public API key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |
| `FRONTEND_URL` | Your deployed frontend URL (for CORS) |

### Frontend (`.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend server base URL |

---

## 👤 Author

**Nilesh** — Internship Assignment @ 3W

---

## 📝 License

This project is built for educational / internship purposes.
