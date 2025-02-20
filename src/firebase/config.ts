// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmsu3jbEGEf1i_b6zgabNi3AiOzk8kgNc",
  authDomain: "moneymind-972f5.firebaseapp.com",
  projectId: "moneymind-972f5",
  storageBucket: "moneymind-972f5.firebasestorage.app",
  messagingSenderId: "541933056330",
  appId: "1:541933056330:web:18139d077ec0478b85d1b3",
  measurementId: "G-8C5EDN3XNL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export {app};