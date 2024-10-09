// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIip8cS19QQxtXz-aGR80_F9dCUUjVsBA",
  authDomain: "foodapppwa-cf8be.firebaseapp.com",
  projectId: "foodapppwa-cf8be",
  storageBucket: "foodapppwa-cf8be.appspot.com",
  messagingSenderId: "954578867382",
  appId: "1:954578867382:web:6b491c5dc450601714c217",
  measurementId: "G-XJGJPKVHP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Initialize Firestore with persistent cache
export const db = initializeFirestore(app, {
  cache: persistentLocalCache()
});

console.log("Firestore with persistent cache is initialized.");
