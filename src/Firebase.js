// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc0D4P2Foz8ALLwWrFJAocrvAPN-hf1WU",
  authDomain: "whatsapp-clone-124ca.firebaseapp.com",
  projectId: "whatsapp-clone-124ca",
  storageBucket: "whatsapp-clone-124ca.appspot.com",
  messagingSenderId: "543514490275",
  appId: "1:543514490275:web:e9007514796df74ca29616",
};
const FirebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(FirebaseApp);
const auth = getAuth();
const gprovider = new GoogleAuthProvider();
export default db;
export { auth, gprovider };
// Initialize Firebase
