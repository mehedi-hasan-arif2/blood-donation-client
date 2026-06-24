import { createContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut 
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update profile name & photo
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    });
  };

  // Logout user
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = { user, loading, createUser, updateUserProfile, logOut };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;