// src/app/Refugio/page.tsx (o donde tengas tu ShelterDashboardPage)
"use client"; // Importar 'use client' para usar hooks

import React, { useEffect } from "react"; // Importar useEffect
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importar useRouter para la redirección

// No necesitas useAuth directamente aquí si solo es para la redirección,
// pero es bueno importarlo si en el futuro vas a mostrar información del usuario loggeado.
// import { useAuth } from "@/app/contexts/AuthContext"; // Asegúrate que esta ruta es correcta

export default function ShelterDashboardPage() {
  const router = useRouter();
  // const { user, token } = useAuth(); // Opcional, si no necesitas la información del usuario aquí

  useEffect(() => {
    // 1. Verificar si hay un token de autenticación en localStorage
    // ¡Asegúrate de que la clave coincide con la que usas en AuthContext!
    const token = localStorage.getItem('authToken');

    // 2. Si no hay token, redirigir al usuario a la página de login
    if (!token) {
      console.log('ShelterDashboardPage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
    }
    // Opcional: Podrías añadir lógica aquí para verificar el rol del usuario
    // para asegurarte de que solo los usuarios con rol 'refugio' accedan a esta página.
    // if (localStorage.getItem('authUser')) {
    //   const user = JSON.parse(localStorage.getItem('authUser') || '{}');
    //   if (user.usuRol !== 'refugio') {
    //     console.log('Usuario no es un refugio. Redirigiendo a home o a login.');
    //     router.push('/'); // O a /login, dependiendo de tu lógica de acceso
    //   }
    // } else {
    //   // Si no hay user en localStorage pero sí hay token, recargar para que AuthProvider lo maneje.
    //   // Esto es más para edge cases, normalmente AuthProvider ya lo carga.
    //   if (token) {
    //     console.log('Token presente pero no user en localStorage. Redirigiendo a home para recargar AuthProvider.');
    //     router.push('/'); // Esto hará que el AuthProvider intente cargar el usuario
    //   }
    // }

  }, [router]); // El efecto se ejecuta cuando el componente se monta y si el objeto router cambia.


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