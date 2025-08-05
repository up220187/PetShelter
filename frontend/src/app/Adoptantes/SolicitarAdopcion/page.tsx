"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Para obtener parámetros de la URL

export default function SolicitarAdopcionPage() {
  const searchParams = useSearchParams();
  const petName = searchParams.get('petName'); // Obtener el nombre de la mascota de la URL

  // Puedes añadir estado para manejar los campos del formulario si lo deseas
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    motivation: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejarías el envío del formulario, por ejemplo, a una API
    console.log("Formulario de adopción enviado:", formData, "para la mascota:", petName);
    alert(`Solicitud enviada para ${petName || 'la mascota'}. ¡Gracias!`);
    // Opcional: Redirigir al usuario a una página de confirmación o a la lista de mascotas
  };

  return (
    <div className="adoption-form-page-container">
      <h1 className="form-page-title">Solicitar Adopción</h1>

      <div className="adoption-form-container">
        <div className="form-header">
          <h3 className="form-title-adopcion">
            Formulario de Adopción para {petName || 'una mascota'}
          </h3>
          {/* Aquí podrías añadir un botón para regresar, si lo deseas */}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid-adopcion">
            <div className="form-group-adopcion full-width">
              <label htmlFor="fullName" className="form-label-adopcion">Nombre completo:</label>
              <input
                type="text"
                id="fullName"
                className="form-input-adopcion"
                placeholder="Tu nombre completo"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-adopcion">
              <label htmlFor="phone" className="form-label-adopcion">Teléfono:</label>
              <input
                type="tel"
                id="phone"
                className="form-input-adopcion"
                placeholder="Tu número de teléfono"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-adopcion">
              <label htmlFor="email" className="form-label-adopcion">Email:</label>
              <input
                type="email"
                id="email"
                className="form-input-adopcion"
                placeholder="Tu correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-adopcion full-width">
              <label htmlFor="address" className="form-label-adopcion">Dirección:</label>
              <input
                type="text"
                id="address"
                className="form-input-adopcion"
                placeholder="Tu dirección completa"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group-adopcion full-width">
              <label htmlFor="motivation" className="form-label-adopcion">
                ¿Por qué quieres adoptar a {petName || 'esta mascota'}?
              </label>
              <textarea
                id="motivation"
                className="form-textarea-adopcion"
                rows={4}
                placeholder="Cuéntanos sobre tu motivación y experiencia con mascotas"
                value={formData.motivation}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          <div className="form-actions-adopcion">
            <button type="submit" className="submit-adopcion-button">Enviar Solicitud</button>
          </div>
        </form>
      </div>
    </div>
  );
}