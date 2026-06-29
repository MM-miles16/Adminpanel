"use client";
import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext({
  role: "admin",
  isAdmin: true,
  isOperator: false,
  isHost: false,
});

export function RoleProvider({ children }) {
  const [role, setRole] = useState("admin");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("admin_info");
      if (stored) {
        const info = JSON.parse(stored);
        setRole(info.role || "admin");
      }
    } catch {
      setRole("admin");
    }
  }, []);

  // Also listen for storage changes (e.g., after fresh login)
  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = sessionStorage.getItem("admin_info");
        if (stored) {
          const info = JSON.parse(stored);
          setRole(info.role || "admin");
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = {
    role,
    isAdmin: role === "admin",
    isOperator: role === "operator",
    isHost: role === "host",
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
