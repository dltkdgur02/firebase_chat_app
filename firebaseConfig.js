// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: 'AIzaSyDpBFvNvt_cffkMd-ARLk0QK9Cx0yJjPOY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    databaseURL: 'https://chat-app-f39a1-default-rtdb.firebaseio.com/',
    projectId: 'chat-app-f39a1',
    storageBucket: 'chat-app-f39a1.firebasestorage.app',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: '1:1058806831069:android:f4919765c3a391f4dd0834',
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app); //Realtime Database 전용
export const auth = getAuth(app);