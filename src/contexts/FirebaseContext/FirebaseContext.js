import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Import Packages
 */
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import Loading from "../../components/Loading/Loading";

/**
 * Initialize our Firebase App
 */
const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

/**
 * Create Context for Provider
 */
export const FirebaseContext = createContext();

/**
 * Hook for Auth Context
 *
 * @returns Context
 */
export function useFirebase() {
  return useContext(FirebaseContext);
}

/**
 *
 * @param {Object} props
 * @returns
 */
export const FirebaseProvider = ({ children }) => {
  const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    useFetchStreams: false,
  });

  const auth = getAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginAnon = async (force = false) => {
    // If user is logged in and not anonymous, return
    if (auth.currentUser && !auth.currentUser.isAnonymous && !force) {
      return;
    }

    try {
      const { user } = await signInAnonymously(auth);

      return user;
    } catch (error) {
      console.log("Error logging in: ", error);
    }
  };

  const loginWithGoogle = async () => {
    // If user is logged in and not anonymous, return
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      return user;
    } catch (error) {
      console.log("Error logging in: ", error);
    }
  };

  /**
   * Email contains interactiveworkshops.com
   */
  const isAdmin = useMemo(() => {
    return (
      auth.currentUser &&
      auth.currentUser.email &&
      auth.currentUser.email.includes("interactiveworkshops.com")
    );
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await loginAnon();
      }

      if (user) {
        setIsLoggedIn(true);
      }
    });

    return unsubscribe;
  }, [auth]);

  if (!isLoggedIn) {
    return <Loading message="Connecting to database…" />;
  }

  /**
   *
   */
  return (
    <FirebaseContext.Provider
      value={{
        db,
        auth,
        loginWithGoogle,
        loginAnon,
        isAdmin,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
