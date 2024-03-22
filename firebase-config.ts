import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBeLr7qSOmyc_Wt6VszEBb1YvPv0g75198",
  authDomain: "nrc-team.firebaseapp.com",
  projectId: "nrc-team",
  storageBucket: "nrc-team.appspot.com",
  messagingSenderId: "720491831457",
  appId: "1:720491831457:web:70ae82a4c64fe4c85810e0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const fileUpload = async (file: File) => {
  if (!file) {
    alert("Please choose a file first!");
  }
  const storageRef = ref(storage, `/files/${file.name}`);
  await uploadBytesResumable(storageRef, file);
  return await getDownloadURL(storageRef);
};
