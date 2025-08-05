"use client";

import React, { useEffect } from "react"; 
import Image from "next/image";
import { useRouter } from "next/navigation"; 


export default function ShelterDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.log('ShelterDashboardPage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
    }
  }, [router]); 


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