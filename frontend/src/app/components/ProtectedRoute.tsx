"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar y no hay token o usuario
    if (!isLoading && (!token || !user)) {
      console.log('ProtectedRoute: Redirigiendo al login - Token:', !!token, 'User:', !!user);
      router.replace("/login");
    }
  }, [token, user, isLoading, router]);

  // Mostrar loading mientras se cargan los datos del localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  // Si no hay token o usuario después de cargar, no mostrar nada (se redirigirá)
  if (!token || !user) return null;

  return <>{children}</>;
}
