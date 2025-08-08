"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/AuthContext";

export default function AdoptanteDashboard() {
  const router = useRouter();
  const { token, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Esperar a que termine de cargar
    
    if (!token || !user) {
      console.log('AdoptanteDashboard: No hay token de autenticación o usuario. Redirigiendo al login.');
      router.push('/login');
    }
  }, [router, token, isLoading, user]);

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