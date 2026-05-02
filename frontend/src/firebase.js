import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBw-DUOtB5WG4tI9Fgax3jDnd8rVTp9vrQ",
  authDomain: "team-task-manager-8cfb8.firebaseapp.com",
  projectId: "team-task-manager-8cfb8",
  storageBucket: "team-task-manager-8cfb8.firebasestorage.app",
  messagingSenderId: "161148662773",
  appId: "1:161148662773:web:8f0f316ea1a99126f766bc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
