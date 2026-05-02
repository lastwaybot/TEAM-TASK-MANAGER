# 📋 Team Task Manager

A full-stack web application for creating projects, assigning tasks, and tracking progress with **role-based access control** (Admin / Member).

---

## ✨ Features

- **Authentication** — Signup & Login with Firebase Auth (Email/Password)
- **Role-Based Access** — Admin and Member roles with distinct permissions
- **Project Management** — Create projects, add members by email
- **Task Management** — Create tasks, assign to members, update status (Todo → In Progress → Done)
- **Dashboard** — Stats overview with total, completed, in-progress, and overdue task counts
- **Deadline Tracking** — Visual overdue indicators for missed deadlines
- **Responsive UI** — Clean, modern design that works on desktop and mobile

### Role Permissions

| Action | Admin | Member |
|---|---|---|
| Create projects | ✅ | ❌ |
| Add members to projects | ✅ | ❌ |
| Create tasks | ✅ | ❌ |
| View all tasks | ✅ | Own only |
| Update task status | ✅ | Own only |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Authentication | Firebase Auth |
| HTTP Client | Axios |
| Routing | React Router v6 |

---

## 📂 Folder Structure

```
Team Task Manager/
├── backend/
│   ├── config/
│   │   └── firebase.js          # Firebase Admin SDK init
│   ├── middleware/
│   │   └── auth.js              # Token verification middleware
│   ├── routes/
│   │   ├── users.js             # User registration & profile
│   │   ├── projects.js          # Project CRUD + member management
│   │   └── tasks.js             # Task CRUD + status updates
│   ├── server.js                # Express entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   └── TaskList.jsx     # Reusable task list
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Signup.jsx       # Signup page
│   │   │   ├── Dashboard.jsx    # Dashboard with stats
│   │   │   ├── Projects.jsx     # Projects listing
│   │   │   └── ProjectDetail.jsx # Project detail + tasks
│   │   ├── api.js               # Axios instance
│   │   ├── firebase.js          # Firebase client config
│   │   ├── App.jsx              # Router setup
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Firebase project with **Authentication** and **Firestore** enabled

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Email/Password** provider
4. Enable **Cloud Firestore** in production mode
5. Go to **Project Settings** → **Service Accounts** → Generate a new private key (download JSON)
6. Go to **Project Settings** → **General** → Copy your web app Firebase config

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your Firebase service account values:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your Firebase web app config:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## 📡 API Endpoints

All protected endpoints require `Authorization: Bearer <firebase-id-token>` header.

### Users

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/users/register` | Register user profile | Authenticated |
| GET | `/users/me` | Get current user profile | Authenticated |

### Projects

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/projects` | Create a project | Admin |
| GET | `/projects` | List user's projects | Authenticated |
| GET | `/projects/:id` | Get project details | Project member |
| POST | `/projects/:id/members` | Add member to project | Admin |

### Tasks

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/tasks` | Create a task | Admin |
| GET | `/tasks` | List tasks (filtered by role) | Authenticated |
| GET | `/tasks?projectId=xxx` | List tasks for a project | Authenticated |
| PUT | `/tasks/:id` | Update task status | Admin or Assignee |

---

## 🌐 Deployment

### Deploy Backend on Railway

1. Push `backend/` to a GitHub repository
2. Go to [Railway](https://railway.app/) → New Project → Deploy from GitHub
3. Select the repository and set the root directory to `backend`
4. Add environment variables in Railway dashboard:
   - `PORT` → `5000`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
5. Railway will auto-detect Node.js and deploy
6. Copy the generated deployment URL (e.g., `https://your-backend.up.railway.app`)

### Deploy Frontend on Railway

1. Push `frontend/` to a GitHub repository (can be same repo)
2. Create another Railway service → Deploy from GitHub
3. Set root directory to `frontend`
4. Add build command: `npm run build`
5. Add start command: `npx serve dist`
6. Add environment variables:
   - `VITE_API_URL` → your Railway backend URL
   - All `VITE_FIREBASE_*` variables
7. Deploy

### Alternative: Deploy Frontend on Firebase Hosting

```bash
cd frontend
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting    # Select "dist" as public directory, configure as SPA
firebase deploy
```

---

## 🔥 Firestore Collections

### `users`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### `projects`
```json
{
  "name": "Website Redesign",
  "createdBy": "uid123",
  "members": ["john@example.com", "jane@example.com"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### `tasks`
```json
{
  "title": "Design homepage",
  "description": "Create wireframes for the new homepage",
  "projectId": "project123",
  "assignedTo": "jane@example.com",
  "status": "todo",
  "deadline": "2024-02-01",
  "createdBy": "uid123",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 📝 Usage

1. **Sign up** as an Admin to manage projects and tasks
2. **Create a project** from the Projects page
3. Have team members **sign up** as Members
4. **Add members** to your project by their email
5. **Create tasks** and assign them to project members
6. Members can **update task status** (Todo → In Progress → Done)
7. Track progress on the **Dashboard**

---

## License

MIT
