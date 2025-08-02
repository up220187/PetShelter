// src/app/dashboard/customer/view-pets/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter

export default function ViewPetsPage() {
  const [selectedPet, setSelectedPet] = useState(null);
  const router = useRouter(); // Inicializar router

  const availablePets = [
    // Simular algunas mascotas para tener algo que mostrar y hacer clic
    //{ id: 1, name: "Pelusa", gender: "Macho", age: "7 meses", breed: "Siamés", description: "Pelusa es un gato muy bonito al que le gusta socializar con las personas.", health: "Vacunado", imageUrl: "/images/cat_placeholder.jpg" },
    //{ id: 2, name: "Trueno", gender: "Hembra", age: "2 años", breed: "Labrador", description: "Trueno es muy enérgica y le encanta jugar a la pelota.", health: "Esterilizada, Vacunada", imageUrl: "/images/dog_placeholder.jpg" },
    //{ id: 3, name: "Luna", gender: "Hembra", age: "1 año", breed: "Mestiza", description: "Luna es muy cariñosa y se lleva bien con niños.", health: "Vacunada", imageUrl: "/images/cat_placeholder_2.jpg" },
    //{ id: 4, name: "Canela", gender: "Macho", age: "3 meses", breed: "Chihuahua", description: "Canela es un cachorro pequeño y juguetón.", health: "Primeras vacunas", imageUrl: "/images/dog_placeholder_2.jpg" },
    //{ id: 5, name: "Roco", gender: "Macho", age: "5 años", breed: "Bulldog", description: "Roco es tranquilo y le gusta pasar tiempo en casa.", health: "Vacunado", imageUrl: "/images/dog_placeholder_3.jpg" },
  ];

  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
  };

  // Cambiar esta función para redirigir a la página del formulario
  const handleSolicitarVisitaClick = () => {
    if (selectedPet) {
      // Redirige a la página de solicitar adopción, pasando el nombre de la mascota
      router.push(`/Adoptantes/SolicitarAdopcion?petName=${selectedPet.name}`);
    }
  };

  return (
    <div className="view-pets-container">
      <h1 className="view-pets-title">Mascotas Disponibles para Adopción</h1>

      <div className="view-pets-grid">
        {/* Columna izquierda: Lista de mascotas */}
        <div className="pets-list-section">
          <h2 className="section-title">Nuestras Mascotas</h2>
          {availablePets.length > 0 ? (
            <div className="pets-cards-container">
              {availablePets.map((pet) => (
                <div
                  key={pet.id}
                  className={`pet-card-summary ${selectedPet && selectedPet.id === pet.id ? 'selected' : ''}`}
                  onClick={() => handleSelectPet(pet)}
                >
                  {/* Asegúrate de tener imágenes de placeholder o rutas correctas */}
                  <div className="pet-summary-photo-placeholder" style={{ backgroundImage: `url(${pet.imageUrl})` }}></div>
                  <span className="pet-summary-name-text">{pet.name}</span>
                  <span className="pet-summary-gender-text">{pet.gender}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-pets-message">Lo sentimos, no hay mascotas disponibles para adopción en este momento.</p>
          )}
        </div>

        {/* Columna derecha: Detalles de la mascota seleccionada */}
        <div className="pet-details-section">
          {selectedPet ? (
            <>
              {/* Detalles de la mascota */}
              <div className="pet-details-header">
                <div className="pet-details-photo-placeholder active" style={{ backgroundImage: `url(${selectedPet.imageUrl})` }}></div>
                <div className="pet-details-basic-info">
                  <h2 className="pet-details-name-text">{selectedPet.name}</h2>
                  <p className="pet-details-gender-age-text">{selectedPet.gender}, {selectedPet.age}</p>
                </div>
              </div>
              <p className="pet-details-description-text">{selectedPet.description}</p>
              <p className="pet-details-health-text">Salud: {selectedPet.health}</p>
              <div className="pet-details-actions">
                <button className="solicitar-visita-button" onClick={handleSolicitarVisitaClick}>
                  Solicitar Visita
                </button>
              </div>
            </>
          ) : (
            <div className="no-pet-selected-message">
              <p>Selecciona una mascota de la lista para ver sus detalles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}