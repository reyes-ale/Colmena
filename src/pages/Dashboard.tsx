import { Navigate } from "react-router";
import { useAuth } from "../lib/AuthContext";
import CreativoDashboard from "./creativo/CreativoDashboard";
import ClienteDashboard from "./cliente/ClienteDashboard";

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <p className="text-[#475569]">Cargando…</p>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  return profile.rol === "creativo" ? <CreativoDashboard profile={profile} /> : <ClienteDashboard profile={profile} />;
}
