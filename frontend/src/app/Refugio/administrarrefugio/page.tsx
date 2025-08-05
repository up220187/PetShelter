// src/app/register/shelter/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect } from "react"; // Importa useEffect
import { useRouter } from "next/navigation"; // Importa useRouter
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta a tu AuthContext

export default function CreateShelterPage() {
  const { user, token, isLoading } = useAuth(); // Obtén user, token, e isLoading del contexto
  const router = useRouter(); // Inicializa el router

  // Efecto para verificar la autenticación
  useEffect(() => {
    // Si isLoading es true, significa que el contexto aún está intentando cargar el token de localStorage.
    // Esperamos a que termine antes de decidir si redirigir.
    if (isLoading) {
      return;
    }

    // Si isLoading es false y no hay token, significa que el usuario no está autenticado.
    if (!token) {
      console.log('CreateShelterPage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
    }
    // Opcional: Si solo ciertos roles pueden acceder a esta página, podrías añadir:
    // if (user && user.usuRol !== 'refugio') {
    //   router.push('/unauthorized'); // o a otra página adecuada
    // }
  }, [token, isLoading, router]); // Dependencias del efecto: re-evaluar si token, isLoading, o router cambian

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando información de autenticación...</p>
      </div>
    );
  }

  // Si no hay token después de que la carga ha terminado, no se renderiza el formulario
  // (el useEffect ya habrá disparado la redirección)
  if (!token) {
    return null; // O podrías renderizar un mensaje de "Acceso Denegado"
  }

  // Si el usuario está autenticado, renderiza el contenido original de la página
  return (
    <div className="create-shelter-container">
      <h1 className="shelter-title">Administrar Refugio</h1>

      <div className="shelter-grid">
        {/* Sección de Logo/Imagen de perfil del Refugio (espacio en blanco) */}
        <div className="shelter-logo-section">
          <div className="shelter-picture-empty"></div>
          <input type="file" id="shelter-logo-upload" className="file-upload-input" />
          <label htmlFor="shelter-logo-upload" className="file-upload-label">Subir Logo/Foto</label>
        </div>

        {/* Sección de Descripción */}
        <div className="shelter-description-section">
          <h2 className="section-title">Descripción</h2>
          <textarea
            id="shelter-description"
            className="profile-textarea"
            rows={5}
            placeholder="Cuéntanos sobre la misión de tu refugio, historia, tipo de animales que rescatan, etc."
          ></textarea>
        </div>

        {/* Sección de Dirección (interpretando "Av. Independencia 123" como un campo de dirección) */}
        <div className="shelter-address-section">
          <h2 className="section-title">Dirección</h2>
          <input
            type="text"
            id="shelter-address"
            className="profile-input"
            placeholder="Av. Ejemplo 123, Colonia, Ciudad, País"
          />
        </div>

        {/* Sección de Contacto (al lado del logo en la imagen) */}
        <div className="shelter-contact-section">
          <h2 className="section-title">Contacto</h2>
          <div className="input-group">
            <label htmlFor="shelter-email" className="input-label">Email:</label>
            <input type="email" id="shelter-email" className="profile-input" placeholder="correo@túrefugio.org" />
          </div>
          <div className="input-group">
            <label htmlFor="shelter-phone" className="input-label">Teléfono:</label>
            <input type="tel" id="shelter-phone" className="profile-input" placeholder="Ej: +52 55 1234 5678" />
          </div>
        </div>

        {/* Sección de Información Adicional (interpretando "Info add." como un campo de texto amplio) */}
        <div className="shelter-additional-info-section">
          <h2 className="section-title">Información Adicional</h2>
          <textarea
            id="shelter-additional-info"
            className="profile-textarea"
            rows={5}
            placeholder="Horarios de visita, si aceptan voluntarios, requisitos especiales de adopción, etc."
          ></textarea>
        </div>
      </div>

      <div className="profile-actions">
        <button className="save-button">Guardar Cambios</button>
        <button className="cancel-button">Cancelar</button>
      </div>
    </div>
  );
}