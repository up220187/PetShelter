// src/app/register/shelter/page.tsx
"use client";

import Link from "next/link";

export default function CreateShelterPage() {
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