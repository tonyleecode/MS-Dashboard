import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrkEZEO-opwiNNzwc4lS1CxqbwyK_AhE8",
  authDomain: "gen-lang-client-0115316950.firebaseapp.com",
  projectId: "gen-lang-client-0115316950",
  storageBucket: "gen-lang-client-0115316950.firebasestorage.app",
  messagingSenderId: "1001036740225",
  appId: "1:1001036740225:web:9130adfd2de1f83229ff80",
  measurementId: "G-MG7S45X9P4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
