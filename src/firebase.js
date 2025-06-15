// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (ya personalizada con tu clave)
const firebaseConfig = {
  apiKey: "AIzaSyCrB5XwcW3gK02CLgkF4knhwmk1LYQ_Z2c",
  authDomain: "torneo-moba.firebaseapp.com",
  projectId: "torneo-moba",
  storageBucket: "torneo-moba.appspot.com",
  messagingSenderId: "760036781085",
  appId: "1:760036781085:web:992427986c564aa0172af4" // <- Este dato sale al registrar tu app web
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usaremos en la app
export const auth = getAuth(app);
export const db = getFirestore(app);
