
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiQS16X04aBXeyCobGEZh5Wgj3PATaIdk",
  authDomain: "reimagine-ai-2025.firebaseapp.com",
  projectId: "reimagine-ai-2025",
  storageBucket: "reimagine-ai-2025.firebasestorage.app",
  messagingSenderId: "322218327166",
  appId: "1:322218327166:web:588b97be138a4d97c5ac2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Enable persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase persistence error:", error);
});

export { 
  auth, 
  storage,
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
};
export type { User };
