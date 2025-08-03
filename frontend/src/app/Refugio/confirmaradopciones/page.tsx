"use client";

import React, { useState } from 'react';
import CheckButton from '../../components/icon/CheckButton';
import CloseCircleIcon from '../../components/icon/CloseCircleIcon';

export default function ConfirmAdoptionsPage() {
  // Estado para el solicitante de adopción actualmente seleccionado
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Array de solicitantes de adopción (simulado)
  const allApplicants = [
    { id: 1, name: "Valeria Montes", age: 24, email: "valmon@gmail.com", description: "Apasionada de los gatos en búsqueda de un nuevo compañero.", allergies: "Alérgica a los perros.", imageUrl: "/images/valeria_montes.jpg" },
    { id: 2, name: "Diego Cervantes", age: 32, email: "diego.cerv@example.com", description: "Busca un perro activo para su estilo de vida.", allergies: "Ninguna.", imageUrl: "/images/diego_cervantes.jpg" },
    { id: 3, name: "Adriana Salteño", age: 23, email: "adriana.s@email.com", description: "Primera vez adoptando, muy emocionada.", allergies: "Polen.", imageUrl: "/images/adriana_salteno.jpg" },
    { id: 4, name: "Lily Wong", age: 75, email: "lily.wong@example.com", description: "Busca un compañero tranquilo y mayor.", allergies: "Plumas.", imageUrl: "/images/lily_wong.jpg" },
    { id: 5, name: "Óscar Miranda", age: 40, email: "oscar.miranda@email.com", description: "Familia con niños, busca un perro amigable.", allergies: "Ninguna.", imageUrl: "/images/oscar_miranda.jpg" },
  ];

  // Función para seleccionar un solicitante
  const handleSelectApplicant = (applicant) => {
    setSelectedApplicant(applicant);
  };

  // Funciones para manejar la confirmación o rechazo (lógica de backend iría aquí)
  const handleConfirmAdoption = () => {
    if (selectedApplicant) {
      alert(`Adopción de ${selectedApplicant.name} confirmada!`);
      // Lógica para actualizar el estado en el backend
      setSelectedApplicant(null); // Deseleccionar después de confirmar/rechazar
    }
  };

  const handleRejectAdoption = () => {
    if (selectedApplicant) {
      alert(`Adopción de ${selectedApplicant.name} rechazada.`);
      // Lógica para actualizar el estado en el backend
      setSelectedApplicant(null); // Deseleccionar después de confirmar/rechazar
    }
  };

  return (
    <div className="confirm-adoptions-container">
      <h1 className="confirm-adoptions-title">Confirmar Adopciones</h1>

      <div className="adoptions-grid">
        {/* Columna izquierda: Lista de Solicitantes */}
        <div className="applicants-list-section">
          <h2 className="section-title">Solicitantes</h2>
          {allApplicants.length > 0 ? (
            <div className="applicants-cards-container">
              {allApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className={`applicant-card-summary ${selectedApplicant && selectedApplicant.id === applicant.id ? 'selected' : ''}`}
                  onClick={() => handleSelectApplicant(applicant)}
                >
                  <div className="applicant-summary-photo" style={{ backgroundImage: `url(${applicant.imageUrl})` }}></div>
                  <span className="applicant-summary-name">{applicant.name}</span>
                  <span className="applicant-summary-age">{applicant.age} años</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-applicants-message">No hay solicitudes de adopción pendientes para confirmar.</p>
          )}
        </div>

        {/* Columna derecha: Detalles del Solicitante Seleccionado */}
        <div className="applicant-details-section">
          {selectedApplicant ? (
            <>
              <div className="applicant-details-actions-top">
                <button className="icon-button check-button" onClick={handleConfirmAdoption}>
                  <CheckButton />
                </button>
                <button className="icon-button close-button" onClick={handleRejectAdoption}>
                  <CloseCircleIcon />
                </button>
              </div>

              <div className="applicant-details-profile">
                <div className="applicant-details-photo" style={{ backgroundImage: `url(${selectedApplicant.imageUrl})` }}></div>
                <div className="applicant-details-header-info">
                  <h2 className="applicant-details-name">{selectedApplicant.name}</h2>
                  <p className="applicant-details-age">{selectedApplicant.age} años</p>
                  <p className="applicant-details-email">{selectedApplicant.email}</p>
                </div>
              </div>

              <div className="applicant-details-content-grid">
                <div className="applicant-details-box description-box">
                  <h3 className="box-title">Descripción</h3>
                  <p className="box-text">{selectedApplicant.description}</p>
                </div>
                <div className="applicant-details-box contact-box">
                  <h3 className="box-title">Contacto</h3>
                  <p className="box-text">{selectedApplicant.phone || 'No disponible'}</p> {/* Asumimos un campo phone en un futuro */}
                  <p className="box-text">{selectedApplicant.email}</p>
                </div>
                <div className="applicant-details-box personal-data-box">
                  <h3 className="box-title">Datos personales</h3>
                  <p className="box-text">Edad: {selectedApplicant.age}</p>
                  <p className="box-text">Alergias: {selectedApplicant.allergies || 'Ninguna'}</p>
                  {/* Otros datos personales si existieran */}
                </div>
              </div>
            </>
          ) : (
            <div className="no-applicant-selected-message">
              <p>Selecciona un solicitante de la lista para ver sus detalles y confirmar la adopción.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}