import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDFJIIkN02HjrJ5bt5lAVn8kEHrKufw2ys",
  authDomain: "hostel-management-cdb24.firebaseapp.com",
  projectId: "hostel-management-cdb24",
  storageBucket: "hostel-management-cdb24.firebasestorage.app",
  messagingSenderId: "526790584311",
  appId: "1:526790584311:web:77edff0333c2121bb270f2",
  measurementId: "G-SQM367JGZN"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };