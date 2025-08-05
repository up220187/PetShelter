"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "../../components/ProtectedRoute";

interface Mascota {
  _id: string;
  masNombre: string;
  masTipoMascota: string;
  masSexo: string;
  masTamaño: string;
  masEstado: string;
  masComportamiento: string;
  masEstadoSalud: string;
  masNacimiento: string;
  imageUrl?: string; // link a imagen real (si existe)
}

export default function ViewPetsPage() {
  const [selectedPet, setSelectedPet] = useState<Mascota | null>(null);
  const [availablePets, setAvailablePets] = useState<Mascota[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas`, {
      headers: {
        Authorization: "Bearer TU_TOKEN", // ⚠️ Reemplaza con token real desde contexto
      },
    })
      .then(res => res.json())
      .then(data => {
        const disponibles = data.filter((m: Mascota) => m.masEstado === "Disponible");
        setAvailablePets(disponibles);
      });
  }, []);

  const handleSelectPet = (pet: Mascota) => {
    setSelectedPet(pet);
  };

  const handleSolicitarVisitaClick = () => {
    if (selectedPet) {
      router.push(`/Adoptantes/SolicitarAdopcion?petId=${selectedPet._id}`);
    }
  };

  return (
    <ProtectedRoute>
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
                    key={pet._id}
                    className={`pet-card-summary ${selectedPet && selectedPet._id === pet._id ? 'selected' : ''}`}
                    onClick={() => handleSelectPet(pet)}
                  >
                    <div
                      className="pet-summary-photo-placeholder"
                      style={{
                        backgroundImage: `url(${pet.imageUrl || "/images/pet_placeholder.jpg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "9999px", // círculo
                      }}
                    ></div>
                    <span className="pet-summary-name-text">{pet.masNombre}</span>
                    <span className="pet-summary-gender-text">{pet.masSexo}</span>
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
                <div className="pet-details-header">
                  <div
                    className="pet-details-photo-placeholder active"
                    style={{
                      backgroundImage: `url(${selectedPet.imageUrl || "/images/pet_placeholder.jpg"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "9999px", // círculo
                    }}
                  ></div>
                  <div className="pet-details-basic-info">
                    <h2 className="pet-details-name-text">{selectedPet.masNombre}</h2>
                    <p className="pet-details-gender-age-text">
                      {selectedPet.masSexo}, {selectedPet.masTamaño}
                    </p>
                  </div>
                </div>
                <p className="pet-details-description-text">
                  Comportamiento: {selectedPet.masComportamiento}
                </p>
                <p className="pet-details-health-text">
                  Salud: {selectedPet.masEstadoSalud}
                </p>
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
    </ProtectedRoute>
  );
}
