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
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Iniciar como `true` es crucial.
  const router = useRouter();

  useEffect(() => {
    // onAuthStateChanged se dispara al cargar y cada vez que cambia el estado de auth.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Marcar como cargado solo después de la primera verificación.
      console.log(`[AuthContext] Estado de Auth verificado. Usuario: ${currentUser?.email || 'ninguno'}.`);
    });
    // Limpiar el listener cuando el componente se desmonte.
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // La redirección la maneja la página de login al tener éxito.
    } catch (error) {
      const authError = error as AuthError;
      console.error("[AuthContext] Error de Login:", authError.code, authError.message);
      // Re-lanzar el error para que la página de login pueda manejarlo.
      throw authError;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      // forzar una recarga completa en /login para limpiar cualquier estado.
      window.location.href = '/login';
    } catch (error) {
      console.error("[AuthContext] Error de Logout:", error);
    }
  }, []);

  const value = { user, loading, login, logout };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
