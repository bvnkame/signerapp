

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
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-S4Jp1fC-mJx_SX18So63ArLIIIT1I8Q",
  authDomain: "signerapp-87443.firebaseapp.com",
  projectId: "signerapp-87443",
  storageBucket: "signerapp-87443.firebasestorage.app",
  messagingSenderId: "577481581859",
  appId: "1:577481581859:web:5dc479e9ab4ad05c399896",
  measurementId: "G-EYLK8MQCL3"
};

// Initialize Firebase
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