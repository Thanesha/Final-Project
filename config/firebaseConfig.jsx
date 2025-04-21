// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyOP8g-MgZkLgkHAkwA2LWwBzdO18DdUA",
  authDomain: "mind-craft-3208d.firebaseapp.com",
  projectId: "mind-craft-3208d",
  storageBucket: "mind-craft-3208d.firebasestorage.app",
  messagingSenderId: "81484971598",
  appId: "1:81484971598:web:383319e237210f3ee60d1f",
  measurementId: "G-TFY6454XT1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if supported
const initAnalytics = async () => {
  const analyticsIsSupported = await isSupported();
  if (analyticsIsSupported) {
    return getAnalytics(app);
  }
  return null;
};
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
 });
export const db=getFirestore(app);

// const analytics = getAnalytics(app);
export const analytics = initAnalytics(app);

