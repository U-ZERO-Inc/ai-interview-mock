import { Analytics, getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5jGVGFoV6vakgVAVkJ1yOFhlMzEGTBJA",
  authDomain: "interviewer-mvp-v1.firebaseapp.com",
  projectId: "interviewer-mvp-v1",
  storageBucket: "interviewer-mvp-v1.appspot.com",
  messagingSenderId: "1023486168878",
  appId: "1:1023486168878:web:a5e3ebd19542f4955e74bf",
};

export let ga: Analytics;

if (!getApps()?.length) {
  initializeApp(firebaseConfig);

  if (typeof window !== "undefined" && "measurementId" in firebaseConfig) {
    ga = getAnalytics();
  }
}

export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
