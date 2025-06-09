// assets/js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8SCov7jM7L11h0Np7JNjliFgMc3BK3qs",
  authDomain: "eventverix.firebaseapp.com",
  projectId: "eventverix",
  storageBucket: "eventverix.appspot.com",
  messagingSenderId: "477048721955",
  appId: "1:477048721955:web:a8fb9d688e0695b1ed5796",
  measurementId: "G-2XPBL4Y8LX"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export the database for use in other files
export { db };
