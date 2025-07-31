"use client";
import Link from "next/link";
import Image from "next/image";
import paws from "/public/paws.png";
import logo2 from "/public/logo2.png";
import paws2 from "/public/paws2.png";

import {
  Chat as ChatIcon,
  LocalHospital as LocalHospitalIcon,
  Event as EventIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

export default function HomePage() {
  return (
    <main>
      {/* Sección principal */}
      <div className="home-container">
        <Image src={paws} alt="paws background" className="paws-bg" />
        <Image src={paws2} alt="paws2 flipped" className="paws2-right" />

        <div className="logo-wrapper">
          <Image src={logo2} alt="Pet Shelter logo" className="main-logo" />
        </div>

        <div className="buttons-wrapper">
          <Link href="/login" className="login-btn">
            Iniciar sesión
          </Link>
          <Link href="/register" className="register-btn">
            Crear cuenta
          </Link>
        </div>
      </div>

      {/* Sección de características */}
      <section className="features-section">
        <h2>¿Por qué adoptar con nosotros?</h2>
        <div className="features-row">
          <div className="feature-card">
            <ChatIcon sx={{ fontSize: 40, color: "#f97316" }} />
            <h3>Atención personalizada</h3>
            <p>Te acompañamos durante todo el proceso de adopción.</p>
          </div>
          <div className="feature-card">
            <LocalHospitalIcon sx={{ fontSize: 40, color: "#f97316" }} />
            <h3>Salud garantizada</h3>
            <p>Mascotas vacunadas y esterilizadas para tu tranquilidad.</p>
          </div>
          <div className="feature-card">
            <EventIcon sx={{ fontSize: 40, color: "#f97316" }} />
            <h3>Citas flexibles</h3>
            <p>Agenda tu visita según tu disponibilidad. ¡Fácil y rápido!</p>
          </div>
          <div className="feature-card">
            <SearchIcon sx={{ fontSize: 40, color: "#f97316" }} />
            <h3>Compatibilidad emocional</h3>
            <p>Encuentra la mascota que encaje contigo en energía y cariño.</p>
          </div>
        </div>
      </section>

      {/* Footer global al final de la página */}
      <footer className="main-footer">
        <p>Copyright © 2025. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
