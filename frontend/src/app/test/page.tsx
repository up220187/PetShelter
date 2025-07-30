"use client";
import RegisterForm from "../components/RegisterForm";
import AdministrarMascotasButton from "../components/Refugio/AdministrarMascotas";

export default function TestPage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      <div className="global-paws-background"></div>

      <div className="main-content-wrapper">

        <div className="logo-container">
          <img
            src="/logo1.png" 
            alt="Pet Shelter Logo"
          />
        </div>
        <AdministrarMascotasButton />
      </div>
    </div>
  );
}