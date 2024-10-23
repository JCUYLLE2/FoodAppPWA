// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, memoryLocalCache } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Import voor Firebase Storage

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
let db;

try {
  db = initializeFirestore(app, {
    cache: persistentLocalCache()
  });
  console.log("Firestore initialized with persistent cache.");
} catch (err) {
  // Fallback in case persistentLocalCache() is not supported
  console.error("Persistent cache not supported, falling back to memory cache:", err);
  db = initializeFirestore(app, {
    cache: memoryLocalCache() // Falls back to memory-based caching
  });
}

export { db };

// Initialize Firebase Storage
const storage = getStorage();

export const getImageUrl = (imagePath) => {
  const imageRef = ref(storage, imagePath);
  return getDownloadURL(imageRef)
    .then((url) => {
      console.log("Image URL retrieved: ", url);
      return url;
    })
    .catch((error) => {
      console.error("Error fetching image URL: ", error);
      return null;
    });
};

// Voorbeeld van het gebruik van de functie:
getImageUrl('images/myImage.jpg');
