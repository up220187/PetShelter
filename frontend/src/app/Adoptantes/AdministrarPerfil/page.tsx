// src/app/dashboard/customer/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react"; // Importa useState y useEffect
import { useRouter } from "next/navigation"; // Importa useRouter
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta a tu AuthContext
import Image from "next/image"; // Aunque no importamos una imagen, mantenemos la importación de Image por si acaso.

export default function AdoptanteProfilePage() {
  const { user, token, isLoading } = useAuth(); // Obtén user, token, e isLoading del contexto
  const router = useRouter(); // Inicializa el router

  // Efecto para verificar la autenticación y el rol del usuario
  useEffect(() => {
    // Si isLoading es true, significa que el contexto aún está intentando cargar el token de localStorage.
    // Esperamos a que termine antes de decidir si redirigir.
    if (isLoading) {
      return;
    }

    // Si isLoading es false y no hay token, significa que el usuario no está autenticado.
    if (!token) {
      console.log('AdoptanteProfilePage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
      return; // Detener la ejecución si no hay token
    }

    // Opcional: Si solo los adoptantes pueden acceder a esta página
    if (user && user.usuRol !== 'adoptante') {
      console.log('AdoptanteProfilePage: Usuario no autorizado. Rol:', user.usuRol);
      router.push('/unauthorized'); // O a otra página adecuada, como el dashboard del refugio
    }
  }, [token, isLoading, user, router]); // Dependencias del efecto: re-evaluar si token, isLoading, user o router cambian

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando información de autenticación...</p>
      </div>
    );
  }

  // Si no hay token o el rol no es 'adoptante' después de que la carga ha terminado,
  // no se renderiza el formulario (el useEffect ya habrá disparado la redirección)
  if (!token || (user && user.usuRol !== 'adoptante')) {
    return null; // O podrías renderizar un mensaje de "Acceso Denegado" aquí si lo prefieres antes de la redirección.
  }

  return (
    <div className="profile-management-container">
      <h1 className="profile-title">Administrar Perfil</h1>

      <div className="profile-grid">
        {/* Sección de la imagen de perfil (espacio en blanco para la foto), similar al logo del refugio */}
        <div className="profile-image-section">
          <div className="profile-picture-empty"></div>
          {/* Opcional: Input para subir foto de perfil */}
          <input type="file" id="profile-picture-upload" className="file-upload-input" />
          <label htmlFor="profile-picture-upload" className="file-upload-label">Subir Foto de Perfil</label>
        </div>

        {/* Sección del nombre del usuario (vacía), movida para que quede al lado de la descripción o en una celda propia */}
        <div className="profile-name-section">
          <h2 className="section-title">Nombre Completo</h2>
          <input type="text" id="name-user" className="profile-input" placeholder="Tu nombre completo" />
        </div>

        {/* Sección de contacto (vacía), similar a la sección de contacto del refugio */}
        <div className="profile-contact-section">
          <h2 className="section-title">Contacto</h2>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email:</label>
            <input type="email" id="email" className="profile-input" placeholder="tu.email@ejemplo.com" />
          </div>
          <div className="input-group">
            <label htmlFor="phone" className="input-label">Teléfono:</label>
            <input type="tel" id="phone" className="profile-input" placeholder="Ej: +52 55 1234 5678" />
          </div>
        </div>

        {/* Sección de descripción (vacía) */}
        <div className="profile-description-section">
          <h2 className="section-title">Descripción Personal</h2>
          <textarea
            id="description"
            className="profile-textarea"
            rows={4}
            placeholder="Cuéntanos un poco sobre ti y por qué quieres adoptar..."
          ></textarea>
        </div>

        {/* Sección de datos personales (vacía), similar a la dirección del refugio */}
        <div className="profile-personal-data-section">
          <h2 className="section-title">Datos Personales</h2>
          <div className="input-group">
            <label htmlFor="address" className="input-label">Dirección:</label>
            <input type="text" id="address" className="profile-input" placeholder="Tu dirección completa" />
          </div>
          {/* Puedes añadir más campos personales aquí, por ejemplo:
          <div className="input-group">
            <label htmlFor="age" className="input-label">Edad:</label>
            <input type="number" id="age" className="profile-input" placeholder="Tu edad" />
          </div>
          */}
        </div>

        {/* Sección de información adicional (vacía) */}
        <div className="profile-additional-info-section">
          <h2 className="section-title">Información Adicional</h2>
          <textarea
            id="additional-info"
            className="profile-textarea"
            rows={4}
            placeholder="Alguna información extra que quieras compartir (ej. experiencia con mascotas, espacio en casa)."
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