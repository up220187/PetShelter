// src/app/dashboard/customer/page.tsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext"; // Asegúrate de la ruta correcta a tu AuthContext

export default function AdoptanteDashboard() {
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
      console.log('AdoptanteDashboard: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
      return; // Detener la ejecución si no hay token
    }

    // Si hay token pero el rol no es 'adoptante', redirigir o mostrar mensaje de acceso denegado
    if (user && user.usuRol !== 'adoptante') {
      console.log('AdoptanteDashboard: Usuario no autorizado. Rol:', user.usuRol);
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

  // Si no hay token o el rol no es 'adoptante' después de que la carga ha terminado,
  // no se renderiza el contenido (el useEffect ya habrá disparado la redirección)
  if (!token || (user && user.usuRol !== 'adoptante')) {
    return null; // O podrías renderizar un mensaje de "Acceso Denegado" aquí si lo prefieres antes de la redirección.
  }

  return (
    <div className="shelter-dashboard-content">
      <div className="shelter-left-content">
        <Image
          src="/adoptaPerro.png"
          alt="Adopta un perro"
          width={300}
          height={400}
          className="adopta-perro-image"
        />
      </div>

      <div className="right-content">
        <div className="text-overlay">
          <p>
            Conecta con refugios locales y adopta con confianza, amor y
            responsabilidad.
          </p>
          <p className="agenda-text">
            Agenda visitas presenciales o virtuales directamente desde la
            plataforma.
          </p>
          <p className="mission-text">
            Nuestra misión: cambiar vidas, una adopción a la vez.
          </p>
        </div>
        <Image
          src="/backgroundDog.png"
          alt="Dog in background"
          layout="fill"
          objectFit="cover"
          className="background-dog-image"
        />
      </div>
    </div>
  );
}