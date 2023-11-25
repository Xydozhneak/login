"use client"
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userWithPosts, setUserWithPosts] = useState(null);

  const updateUserWithPosts = (updatedUser) => {
    setUserWithPosts(updatedUser);
  };

  return (
    <UserContext.Provider value={{ userWithPosts, updateUserWithPosts }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};