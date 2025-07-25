import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDpBFvNvt_cffkMd-ARLk0QK9Cx0yJjPOY',
    authDomain: 'chat-app-f39a1.firebaseapp.com',
    databaseURL: 'https://chat-app-f39a1-default-rtdb.firebaseio.com',
    projectId: 'chat-app-f39a1',
    storageBucket: 'chat-app-f39a1.appspot.com',
    messagingSenderId: '1058806831069',
    appId: '1:1058806831069:android:f4919765c3a391f4dd0834',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const rtdb = getDatabase(app);
export const storage = getStorage(app);
