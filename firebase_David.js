import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";



const firebase = {
    apiKey: "AIzaSyBr-bnB51kGATkmtbc5OcUnS8WwvXlZo28",
    authDomain: "pawfinder-96b5f.firebaseapp.com",
    projectId: "pawfinder-96b5f",
    storageBucket: "pawfinder-96b5f.firebasestorage.app",
    messagingSenderId: "723996256102",
    appId: "1:723996256102:web:927aa6f5b95b9887110aa7",
    measurementId: "G-0V2X5TM7DS"
};


const app = initializeApp(firebase);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
