import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "boreal-skein-n8chg",
  appId: "1:311901869315:web:e12b1356e766a8fbc6c536",
  apiKey: "AIzaSyAL4Oe1EGMTQWNlVPOvG0abrMxDUAtTGIg",
  authDomain: "boreal-skein-n8chg.firebaseapp.com",
  storageBucket: "boreal-skein-n8chg.firebasestorage.app",
  messagingSenderId: "311901869315",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-khamarikabbo-46acdb96-0241-4ec9-a1bb-b0837d271b79");
