import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useGetMe, useLogout } from "@workspace/api-client-react";
import { User } from "@workspace/api-client-react/src/generated/api.schemas";
import { useLocation } from "wouter";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  refetchUser: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { data: user, isLoading, isError, refetch } = useGetMe({
    query: {
      retry: false,
      staleTime: 60_000,
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        refetch();
        setLocation("/");
      }
    }
  });

  const logout = () => {
    localStorage.removeItem("ab_token");
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading: isLoading && !isError, logout, refetchUser: refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
