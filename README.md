

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

<img width="1915" height="891" alt="Screenshot 2026-05-03 025710" src="https://github.com/user-attachments/assets/7a8491dd-05e6-48a9-84d1-73b41e31fafd" />
<img width="1919" height="905" alt="Screenshot 2026-05-07 101906" src="https://github.com/user-attachments/assets/880da11a-0c29-45c6-ae24-51f98221fcbd" />
<img width="1919" height="916" alt="Screenshot 2026-05-07 101846" src="https://github.com/user-attachments/assets/b847fd3f-6c11-4f4b-afb4-9ed13ca2ed7e" />
<img width="1919" height="915" alt="Screenshot 2026-05-07 101738" src="https://github.com/user-attachments/assets/e9891a88-e2d1-4170-838f-3f646fccc97c" />
<img width="1919" height="912" alt="Screenshot 2026-05-07 101555" src="https://github.com/user-attachments/assets/6a7e67d5-eea7-47fb-b7ed-cb957716eaa5" />
<img width="1919" height="882" alt="Screenshot 2026-05-07 101545" src="https://github.com/user-attachments/assets/f60c4581-bc02-43a9-90e1-8da286ce81a3" />
<img width="1919" height="878" alt="Screenshot 2026-05-07 101512" src="https://github.com/user-attachments/assets/d615cc51-e865-4656-b3a5-301db1bf96f2" />

# 📋 Team Task Manager
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
