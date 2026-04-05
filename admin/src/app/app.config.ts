import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyCWjJsjgrxmV_o1ot5KXKOl0KBTpJEmmhs",
  authDomain: "project-shop-52f54.firebaseapp.com",
  projectId: "project-shop-52f54",
  storageBucket: "project-shop-52f54.appspot.com",
  messagingSenderId: "1025917776061",
  appId: "1:1025917776061:web:f2fc3a43423501312607d4",
  measurementId: "G-Z6Q0NPBMP0"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
