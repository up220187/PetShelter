"use client"; 

import React, { useEffect } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 

import { useAuth } from "../context/AuthContext";

import AdministrarMascotasButton from "../components/Refugio/AdministrarMascotas";
import ConfirmarAdopcionesButton from "../components/Refugio/confirmarAdopciones";
import AdministrarSolicitudesButton from "../components/Refugio/AdministrarVisitas";
import AdministrarRefugioButton from "../components/Refugio/AdministrarRefugio";

export default function ShelterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    console.log('Sesión de refugio cerrada. Redirigiendo al login.');
    router.push('/login'); 
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('ShelterLayout: No se encontró authToken de sesión en localStorage. Redirigiendo al login.');
      router.push('/login');
    }
  }, [router]); 

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
            <button
              onClick={handleLogout}
              className="logout-button" 
              style={{ 
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