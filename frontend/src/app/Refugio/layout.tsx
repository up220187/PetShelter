import React from "react";
import Link from "next/link";

import AdministrarMascotasButton from "../components/Refugio/AdministrarMascotas";
import ConfirmarAdopcionesButton from "../components/Refugio/confirmarAdopciones";
import AdministrarSolicitudesButton from "../components/Refugio/AdministrarSolicitudes";
import AdministrarRefugioButton from "../components/Refugio/AdministrarRefugio";

export default function ShelterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <Link href="/dashboard/shelter/administrar-mascotas">
              <AdministrarMascotasButton />
            </Link>
            <Link href="/dashboard/shelter/confirmar-adopciones">
              <ConfirmarAdopcionesButton />
            </Link>
            <Link href="/dashboard/shelter/administrar-solicitudes">
              <AdministrarSolicitudesButton />
            </Link>
            <Link href="/dashboard/shelter/administrar-refugio">
              <AdministrarRefugioButton />
            </Link>
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