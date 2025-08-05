"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, FilterList as FilterIcon } from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";

import VerMascotasButton from "../components/Adoptante/VerMascotas";
import SolicitarAdopcionButton from "../components/Adoptante/SolicitarAdopcion";
import AdministrarVisitaButton from "../components/Adoptante/AdministrarVisita";
import AdministrarPerfilButton from "../components/Adoptante/AdministrarPerfil";

export default function AdoptanteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout(); 
    console.log('Sesión cerrada. Redirigiendo al login.');
    router.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('Layout: No se encontró authToken de sesión en localStorage. Redirigiendo al login.');
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="adoptante-layout-container">
      <header className="adoptante-header">
        <div className="logo-section">
          <Link href="/Adoptantes">
            <img
              src="/logo2.png"
              alt="Pet Shelter Logo"
            />
          </Link>
        </div>
        <div className="search-and-nav-section">
          <div className="search-bar-wrapper">
            <input type="text" placeholder="Buscar..." className="search-input" />
            <FilterIcon sx={{ fontSize: 24 }} className="filter-icon" />
            <SearchIcon sx={{ fontSize: 24 }} className="search-icon" />
          </div>
          <nav className="adoptante-nav">
            <Link href="/Adoptantes/VerMascotas">
              <VerMascotasButton />
            </Link>
            <Link href="/Adoptantes/SolicitarAdopcion">
              <SolicitarAdopcionButton />
            </Link>
            <Link href="/Adoptantes/AdministrarVisita">
              <AdministrarVisitaButton />
            </Link>
            <Link href="/Adoptantes/AdministrarPerfil">
              <AdministrarPerfilButton />
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

      <main className="adoptante-main-content">
        {children}
      </main>

      <footer className="adoptante-footer">
        <p>Copyright © 2025. All Rights Reserved.</p>
      </footer>
    </div>
  );
}