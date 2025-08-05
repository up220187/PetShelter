// src/app/dashboard/shelter/page.tsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // Asegúrate de la ruta correcta a tu AuthContext

export default function ShelterDashboardPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth(); // Obtén user, token, e isLoading del contexto

  useEffect(() => {
    // Si isLoading es true, significa que el contexto aún está intentando cargar el token de localStorage.
    // Esperamos a que termine antes de decidir si redirigir.
    if (isLoading) {
      return;
    }

    // Si isLoading es false y no hay token, significa que el usuario no está autenticado.
    if (!token) {
      console.log('ShelterDashboardPage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
      return; // Detener la ejecución si no hay token
    }

    // Si hay token pero el rol no es 'refugio', redirigir o mostrar mensaje de acceso denegado
    if (user && user.usuRol !== 'refugio') {
      console.log('ShelterDashboardPage: Usuario no autorizado. Rol:', user.usuRol);
      // Podrías redirigir a una página de "Acceso Denegado" o al dashboard principal
      router.push('/unauthorized'); // Crea una página para manejar esto o redirige a otro lado
    }
  }, [router, token, isLoading, user]); // Añadir token, isLoading, y user a las dependencias

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando información de autenticación...</p>
      </div>
    );
  }

  // Si no hay token o el rol no es 'refugio' después de que la carga ha terminado,
  // no se renderiza el contenido (el useEffect ya habrá disparado la redirección)
  if (!token || (user && user.usuRol !== 'refugio')) {
    return null; // O podrías renderizar un mensaje de "Acceso Denegado" aquí si lo prefieres antes de la redirección.
  }

  return (
    <div className="shelter-dashboard-content">
      <div className="shelter-left-content">
        <div className="shelter-text-overlay">
          <p>
            Gestiona fácilmente el perfil y las fotos de tus mascotas disponibles para adopción.
          </p>
          <p>Recibe, revisa y responde solicitudes de adopción desde un solo lugar.</p>
          <p className="shelter-mission-text">
            Automatiza tu proceso de adopción con formularios digitales y seguimiento en tiempo real. Ayuda a que más mascotas encuentren un hogar compartiendo sus historias.
          </p>
        </div>
        <Image
          src="/Dog.png"
          alt="Dog in background"
          layout="fill"
          objectFit="cover"
          className="background-dog-image"
        />
      </div>

      <div className="shelter-right-content">
        <Image
          src="/doggi.png"
          alt="Adopta un perro"
          width={300}
          height={400}
          className="adopta-perro-image"
        />
      </div>
    </div>
  );
}