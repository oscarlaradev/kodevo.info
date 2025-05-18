// src/context/AuthContext.tsx
"use client";

import type { User } from 'firebase/auth';
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  type ReactNode,
  useCallback
} from 'react';
import { auth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  type AuthError
} from 'firebase/auth';
import { useRouter } from 'next/navigation'; // For redirection

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting the user
      // router.push('/admin'); // Redirect handled by AdminLayout or login page itself
    } catch (error) {
      const authError = error as AuthError;
      console.error("Login error:", authError.message);
      alert(`Login failed: ${authError.message}`); // Simple alert for now
      setLoading(false); // Ensure loading is false on error
      throw authError; // Re-throw to be caught by form handler
    }
    // setLoading(false) will be handled by onAuthStateChanged or error case
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again."); // Simple alert
    } finally {
      setLoading(false);
    }
  }, [router]);

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
