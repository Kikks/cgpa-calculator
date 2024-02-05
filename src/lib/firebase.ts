import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyASTm-1vbAkHSrf7T-p6jyGdXYkyrWw3i8',
  authDomain: 'cgpa-calculator-a4ed9.firebaseapp.com',
  projectId: 'cgpa-calculator-a4ed9',
  storageBucket: 'cgpa-calculator-a4ed9.appspot.com',
  messagingSenderId: '497443698423',
  appId: '1:497443698423:web:6f6c4edebcbfce234b05f2',
  measurementId: 'G-EM302V1Q6T',
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth };
export default app;
