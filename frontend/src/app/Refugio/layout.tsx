// src/app/dashboard/refugio/layout.tsx
"use client"; // Importar 'use client' para usar hooks y manejo de eventos del navegador

import React, { useEffect } from "react"; // Importar useEffect
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importar useRouter para la redirección

import { useAuth } from "../context/AuthContext";

import AdministrarMascotasButton from "../components/Refugio/AdministrarMascotas";
import ConfirmarAdopcionesButton from "../components/Refugio/confirmarAdopciones";
import AdministrarSolicitudesButton from "../components/Refugio/AdministrarSolicitudes";
import AdministrarRefugioButton from "../components/Refugio/AdministrarRefugio";

export default function ShelterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth(); // Usar el logout del contexto

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    console.log('Sesión de refugio cerrada. Redirigiendo al login.');
    router.push('/login'); // Asegúrate de que esta ruta '/login' es correcta
  };

  // Efecto para verificar el estado de la autenticación al cargar el componente
  // Esto previene que los usuarios accedan a rutas protegidas si no hay token
  useEffect(() => {
    // AHORA LEE "authToken"
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('ShelterLayout: No se encontró authToken de sesión en localStorage. Redirigiendo al login.');
      router.push('/login');
    }
    // Opcional: Podrías añadir lógica aquí para verificar el rol del usuario
    // si el token o el contexto de autenticación contienen la información del rol
    // const userString = localStorage.getItem('authUser');
    // if (userString) {
    //   const user = JSON.parse(userString);
    //   if (user.usuRol !== 'refugio') { // Asumiendo que 'refugio' es el rol adecuado
    //     console.log('Usuario no es un refugio. Redirigiendo a home o a login.');
    //     router.push('/'); // O a /login
    //   }
    // }
  }, [router]); // El efecto se ejecuta cuando el componente se monta y si el objeto router cambia.

  return (
    <div className="shelter-layout-container">
      <header className="shelter-header">
        <div className="logo-section">
          <Link href="/Refugio">
            <img
              src="/logo2.png"
              alt="Pet Shelter Logo"
            />
          </Link>
        </div>
        <div className="search-and-nav-sectionn">
          <nav className="shelter-nav">
            <Link href="/Refugio/administrarmascotas">
              <AdministrarMascotasButton />
            </Link>
            <Link href="/Refugio/confirmaradopciones">
              <ConfirmarAdopcionesButton />
            </Link>
            <Link href="/Refugio/administrarsolicitudes">
              <AdministrarSolicitudesButton />
            </Link>
            <Link href="/Refugio/administrarrefugio">
              <AdministrarRefugioButton />
            </Link>
            {/* Botón de Logout */}
            <button
              onClick={handleLogout}
              className="logout-button" // Puedes agregar estilos a esta clase en tu CSS
              style={{ // Estilos inline básicos para que sea visible
                padding: '10px 15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '20px',
                fontSize: '1rem',
              }}
            >
              Cerrar Sesión
            </button>
          </nav>
        </div>
      </header>

      <main className="shelter-main-content">
        {children}
      </main>

      <footer className="shelter-footer">
        <p>Copyright © 2025. All Rights Reserved.</p>
      </footer>
    </div>
  );
}