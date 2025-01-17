import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideFirebaseApp(() => initializeApp({"projectId":"angulartodo-fbcd1","appId":"1:579020935135:web:505d852ac3658f35fc3e6a","storageBucket":"angulartodo-fbcd1.firebasestorage.app","apiKey":"AIzaSyB5vpaHWphqGwN92SNQWkkwCR4Q_pDV9hw","authDomain":"angulartodo-fbcd1.firebaseapp.com","messagingSenderId":"579020935135","measurementId":"G-MQZZV3MBXF"})), provideAuth(() => getAuth()), provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideAnimationsAsync()]
};
