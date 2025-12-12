import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authload, setAuthload] = useState(true);

  //Register User
  const createUser = (email, password) => {
    setAuthload(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //User SignIn
  const signinUser = (email, password) => {
    setAuthload(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  //User Logout
  const logOut = () => {
    setAuthload(true);
    return signOut(auth);
  };

  const signInGoogle = () => {
    setAuthload(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateProfile = () =>{
    return updateProfile;
  }

  //Observe user state
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthload(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    authload,
    createUser,
    signinUser,
    logOut,
    signInGoogle,
    updateProfile
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
  
};

export default AuthProvider;
