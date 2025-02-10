import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore"; 

// 🔹 Substitua com as credenciais do seu Firebase 🔹
const firebaseConfig = {
    apiKey: "AIzaSyASvux9JUmS9xwF88EGFcVkmYQ3ZYsi35c",
    authDomain: "expoappinstituto.firebaseapp.com",
    projectId: "expoappinstituto",
    storageBucket: "expoappinstituto.firebasestorage.app",
    messagingSenderId: "432338523762",
    appId: "1:432338523762:web:ab1224767db3be745ed4eb"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
