<script type="module">
  // Import the functions you need from the SDKs you need
    import {initializeApp} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
    import {getAnalytics} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {apiKey}: "AIzaSyD8SCov7jM7L11h0Np7JNjliFgMc3BK3qs",
    authDomain: "eventverix.firebaseapp.com",
    projectId: "eventverix",
    storageBucket: "eventverix.firebasestorage.app",
    messagingSenderId: "477048721955",
    appId: "1:477048721955:web:a8fb9d688e0695b1ed5796",
    measurementId: "G-2XPBL4Y8LX"
  };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
</script>;
