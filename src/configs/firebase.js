import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_WEB_API_KEY,
  authDomain: `${process.env.REACT_APP_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

if (process.env.NODE_ENV === "development") {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

export const auth = getAuth(app);

export const appCheck = process.env.REACT_APP_RECAPTCHA_KEY
  ? initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.REACT_APP_RECAPTCHA_KEY,
      ),
      isTokenAutoRefreshEnabled: true,
    })
  : null;

export default app;
