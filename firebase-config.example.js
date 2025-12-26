// Copy this file to `firebase-config.js` and fill with your Firebase project values.
// Then include it in your pages before `firebase-manager.js`.

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Optional: export for module consumers (if using bundler)
if (typeof window !== 'undefined') window.FIREBASE_CONFIG = FIREBASE_CONFIG;
