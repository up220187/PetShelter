"use client"; 

import React, { useEffect } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation"; 

import { useAuth } from "../context/AuthContext";

import AdministrarMascotasButton from "../components/Refugio/AdministrarMascotas";
import ConfirmarAdopcionesButton from "../components/Refugio/confirmarAdopciones";
import AdministrarVisitasButton from "../components/Refugio/AdministrarVisitas";
// import AdministrarRefugioButton from "../components/Refugio/AdministrarRefugio";
import AdministrarSeguimientoButton from "../components/Refugio/AdministrarSeguimiento";
import AdministrarPerfilButton from "../components/Adoptante/AdministrarPerfil";

export default function ShelterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

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
            <Link href="/Refugio/administrarvisitas">
              <AdministrarVisitasButton />
            </Link>
            <Link href="/Refugio/administrarseguimiento">
              <AdministrarSeguimientoButton />
            </Link>
            {/* <Link href="/Refugio/administrarrefugio">
              <AdministrarRefugioButton />
            </Link> */}
            <AdministrarPerfilButton />
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