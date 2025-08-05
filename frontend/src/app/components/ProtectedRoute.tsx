"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar y no hay token
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [token, isLoading, router]);

  // Mostrar loading mientras se cargan los datos del localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si no hay token después de cargar, no mostrar nada (se redirigirá)
  if (!token) return null;

  return <>{children}</>;
}
