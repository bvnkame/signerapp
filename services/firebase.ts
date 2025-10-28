

// FIX: Corrected firebase imports to use scoped packages (@firebase/app, @firebase/auth) to resolve module export errors.
import { initializeApp } from '@firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  OAuthProvider
} from '@firebase/auth';

// IMPORTANT: Replace with your own Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');
const appleProvider = new OAuthProvider('apple.com');


export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const signInWithMicrosoft = async () => {
  try {
    await signInWithPopup(auth, microsoftProvider);
  } catch (error) {
    console.error("Error signing in with Microsoft", error);
  }
};

export const signInWithApple = async () => {
  try {
    await signInWithPopup(auth, appleProvider);
  } catch (error) {
    console.error("Error signing in with Apple", error);
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};