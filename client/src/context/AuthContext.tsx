"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserType {
  name: string;
  email: string;
  id: string;
  role: "CUSTOMER" | "ADMIN";
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserType | null;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: (value: AuthState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, user: null });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
