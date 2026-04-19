import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// These values should ideally be in a .env file.
// For now, these are placeholders for the user to fill.
const firebaseConfig = {
  apiKey: "AIzaSyBaOTnB_3gqRsLF_qC99CTSTidzkEebgeU",
  authDomain: "laalwed.firebaseapp.com",
  projectId: "laalwed",
  storageBucket: "laalwed.firebasestorage.app",
  messagingSenderId: "344581588000",
  appId: "1:344581588000:web:2ccd7a8cb727e1547be845",
  measurementId: "G-KL3L0QBF6V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
