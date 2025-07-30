"use client";
import RegisterForm from "../components/RegisterForm";
import VerMascotas from "../components/Adoptante/VerMascotas";
import SolicitarAdopcion from "../components/Adoptante/SolicitarAdopcion";
import AdministrarVisita from "../components/Adoptante/AdministrarVisita";
import AdministrarPerfil from "../components/Adoptante/AdministrarPerfil";
import Footer from "../components/Footer";
import Buscador from "../components/Buscador";


export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Buscador />
      {/* Header hasta arriba que cubre todo */}
      
          <VerMascotas/>
          <SolicitarAdopcion />
          <AdministrarVisita />
          <AdministrarPerfil />
      
      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center pt-8">
        {/* Logo centrado */}
        <div className="text-center mb-8 z-10">
          <img 
            src="/logo1.png" 
            alt="Pet Shelter Logo" 
            className="w-64 h-auto mx-auto"
          />
        </div>

        {/* Imagen de huellas decorativas al lado del formulario */}
        <img
          src="/paws.png"
          alt="Huellas"
          className="absolute right-0 top-32 w-64 h-auto z-0"
        />

        {/* Formulario centrado */}
        <div className="relative z-10">
          <RegisterForm />
        </div>
      </div>
      <Footer />
    </div>
    
  );
}