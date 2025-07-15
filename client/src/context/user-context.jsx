"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);

  // Load user-specific data when user changes
  useEffect(() => {
    if (isLoaded && user) {
      // You can load user-specific preferences here
      // For now, we'll just set basic user info
      setUserData({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
      });
    } else {
      setUserData(null);
    }
  }, [user, isLoaded]);

  const contextValue = {
    user,
    userData,
    isLoaded,
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
