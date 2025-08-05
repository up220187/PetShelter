// src/app/Adoptantes/page.tsx (o donde tengas tu AdoptanteDashboard)
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ¡Importa el useAuth hook de tu AuthProvider!
import { useAuth } from "../context/AuthContext";

export default function AdoptanteDashboard() {
  const router = useRouter();
  // Puedes usar useAuth aquí si necesitas el usuario o token,
  // pero para la redirección inicial solo necesitamos la verificación de localStorage.
  // const { user, token } = useAuth(); // Esto es opcional, si no usas user/token directamente aquí.

  useEffect(() => {
    // 1. Verificar si hay un token de autenticación en localStorage
    // AHORA LEE "authToken"
    const token = localStorage.getItem('authToken');

    // 2. Si no hay token, redirigir al usuario a la página de login
    if (!token) {
      console.log('AdoptanteDashboard: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
    }
  }, [router]);

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