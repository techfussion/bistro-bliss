// "use client";

// import React, { createContext, useContext, useState, ReactNode } from "react";

// interface UserType {
//   name: string;
//   email: string;
//   id: string;
//   role: "CUSTOMER" | "ADMIN";
// }

// interface AuthState {
//   isLoggedIn: boolean;
//   user: UserType | null;
// }

// interface AuthContextType {
//   auth: AuthState;
//   setAuth: (value: AuthState) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [auth, setAuth] = useState<AuthState>({ isLoggedIn: false, user: null });

//   return (
//     <AuthContext.Provider value={{ auth, setAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserType {
  email: string;
  firstName: string;
  lastName: string;
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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setAuth({
        isLoggedIn: true,
        user: JSON.parse(storedUser),
      });
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ isLoggedIn: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
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
