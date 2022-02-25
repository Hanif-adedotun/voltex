// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYlspvF0uu_Ubu2i6WqlgKLlipMnoTRZ8",
  authDomain: "voltex-9b3e0.firebaseapp.com",
  databaseURL: "https://voltex-9b3e0-default-rtdb.firebaseio.com",
  projectId: "voltex-9b3e0",
  storageBucket: "voltex-9b3e0.appspot.com",
  messagingSenderId: "1048360397392",
  appId: "1:1048360397392:web:a2840c0e123239ed03ff55",
  measurementId: "G-G34PEPSNP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);