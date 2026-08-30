import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadStoredProfile, signOutUsuario } from "./auth";
import type { UsuarioProfile } from "./types";

interface AuthContextValue {
  profile: UsuarioProfile | null;
  /** true solo mientras se lee el perfil guardado en localStorage al montar. */
  loading: boolean;
  setProfile: (profile: UsuarioProfile | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UsuarioProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfileState(loadStoredProfile());
    setLoading(false);
  }, []);

  const signOut = () => {
    signOutUsuario();
    setProfileState(null);
  };

  return <AuthContext.Provider value={{ profile, loading, setProfile: setProfileState, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
