"use client";

import Image from "next/image";
// No necesitamos importar una imagen de placeholder si el espacio quedará en blanco.

export default function AdoptanteProfilePage() {
  return (
    <div className="profile-management-container">
      <h1 className="profile-title">Administrar Perfil</h1>

      <div className="profile-grid">
        {/* Sección de la imagen de perfil (espacio en blanco para la foto) */}
        <div className="profile-image-section">
          {/* Este div representará el espacio para la foto de perfil vacía */}
          <div className="profile-picture-empty"></div>
        </div>

        {/* Sección del nombre del usuario (vacía) */}
        <div className="profile-name-section">
          <h2 className="section-title">Nombre del Usuario</h2>
          {/* Campo de input vacío para el nombre */}
          <input type="text" id="name-user" className="profile-input" placeholder="Tu nombre" />
        </div>

        {/* Sección de descripción (vacía) */}
        <div className="profile-description-section">
          <h2 className="section-title">Descripción</h2>
          {/* Textarea vacío para la descripción */}
          <textarea
            id="description"
            className="profile-textarea"
            rows={4}
            placeholder="Cuéntanos un poco sobre ti y por qué quieres adoptar..."
          ></textarea>
        </div>

        {/* Sección de contacto (vacía) */}
        <div className="profile-contact-section">
          <h2 className="section-title">Contacto</h2>
          {/* Campos de input vacíos */}
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email:</label>
            <input type="email" id="email" className="profile-input" placeholder="tu.email@ejemplo.com" />
          </div>
          <div className="input-group">
            <label htmlFor="phone" className="input-label">Teléfono:</label>
            <input type="tel" id="phone" className="profile-input" placeholder="Ej: +52 55 1234 5678" />
          </div>
        </div>

        {/* Sección de información adicional (vacía) */}
        <div className="profile-additional-info-section">
          <h2 className="section-title">Información Adicional</h2>
          {/* Textarea vacío */}
          <textarea
            id="additional-info"
            className="profile-textarea"
            rows={4}
            placeholder="Alguna información extra que quieras compartir (ej. experiencia con mascotas, espacio en casa)."
          ></textarea>
        </div>

        {/* Sección de datos personales (vacía) */}
        <div className="profile-personal-data-section">
          <h2 className="section-title">Datos Personales</h2>
          {/* Campos de input vacíos */}
          <div className="input-group">
            <label htmlFor="address" className="input-label">Dirección:</label>
            <input type="text" id="address" className="profile-input" placeholder="Tu dirección" />
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="save-button">Guardar Cambios</button>
        <button className="cancel-button">Cancelar</button>
      </div>
    </div>
  );
}