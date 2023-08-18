import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9eYLp3hO_jx9ehZKwvQBUKXuhE2YLCgk",
  authDomain: "bookexchangehoaiphuong.firebaseapp.com",
  projectId: "bookexchangehoaiphuong",
  storageBucket: "bookexchangehoaiphuong.appspot.com",
  messagingSenderId: "259683272086",
  appId: "1:259683272086:web:8e4985848ad0c38bd389b7",
  measurementId: "G-BP70D234J9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const firestore = getFirestore();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export { auth, provider, firestore }