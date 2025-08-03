import React from "react";
import Link from "next/link";
import { Search as SearchIcon, FilterList as FilterIcon } from "@mui/icons-material";

import VerMascotasButton from "../components/Adoptante/VerMascotas";
import SolicitarAdopcionButton from "../components/Adoptante/SolicitarAdopcion";
import AdministrarVisitaButton from "../components/Adoptante/AdministrarVisita";
import AdministrarPerfilButton from "../components/Adoptante/AdministrarPerfil";

export default function AdoptanteLayout({ children }: { children: React.ReactNode }) {
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