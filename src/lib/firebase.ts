import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBKQi30oi4pZ2I4CPCPWdCMR3jzhWVcURM",
    authDomain: "toplutasima-aa2bd.firebaseapp.com",
    projectId: "toplutasima-aa2bd",
    storageBucket: "toplutasima-aa2bd.firebasestorage.app",
    messagingSenderId: "597205286990",
    appId: "1:597205286990:web:4a1092575c49526202c31f",
    measurementId: "G-0VGCR4J8E6"
};

// Initialize Firebase (avoid duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
