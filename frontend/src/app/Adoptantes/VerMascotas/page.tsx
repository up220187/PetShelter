// src/app/dashboard/customer/solicitar-adopcion/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

interface Mascota {
  _id: string;
  masNombre: string;
  masRaza: string;
  masTipo: string; // Cambiado de masTipoMascota a masTipo
  masSexo: string;
  masTamaño: string;
  masEstado: string;
  masComportamiento: string;
  masEstadoSalud: string;
  masNacimiento: string;
  masEsterilizado: boolean;
  masImagen?: string; // Cambiado de imageUrl a masImagen
}

export default function ViewPetsPage() {
  const [selectedPet, setSelectedPet] = useState<Mascota | null>(null);
  const [availablePets, setAvailablePets] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return; // Esperar a que termine de cargar

    if (!token) {
      console.error('No hay token de autenticación');
      setLoading(false);
      return;
    }

    const fetchMascotas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expirado o inválido
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Verificar que data sea un array antes de hacer filter
        if (Array.isArray(data)) {
          const disponibles = data.filter((m: Mascota) => m && m.masEstado === "Disponible");
          setAvailablePets(disponibles);
        } else {
          console.error('La respuesta no es un array:', data);
          setAvailablePets([]);
        }
      } catch (error: any) {
        console.error('Error al obtener mascotas:', error);
        setError(error.message || 'Error al cargar las mascotas');
        setAvailablePets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMascotas();
  }, [token, isLoading]);

  const handleSelectPet = (pet: Mascota) => {
    setSelectedPet(pet);
  };

  const handleSolicitarVisitaClick = () => {
    if (selectedPet) {
      // Assuming 'solicitar-visita' is the correct page for visit requests
router.push(`/Adoptantes/solicitarvisita?mascotaId=${selectedPet._id}&petName=${selectedPet.masNombre}`);
    }
  };

  // NEW: Handler for the "Solicitar Adopción" button
  const handleSolicitarAdopcionClick = () => {
    if (selectedPet) {
      // Assuming 'solicitar-adopcion' is the correct page for adoption requests
      // Make sure the path is correct based on your file structure
      router.push(`/dashboard/customer/solicitar-adopcion?petId=${selectedPet._id}&petName=${selectedPet.masNombre}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="view-pets-container">
        <h1 className="view-pets-title">Mascotas Disponibles para Adopción</h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-lg">Cargando mascotas...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-500 text-lg">{error}</div>
          </div>
        ) : (
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
                        backgroundImage: `url(${pet.masImagen || "/images/pet_placeholder.jpg"})`,
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
                      backgroundImage: `url(${selectedPet.masImagen || "/images/pet_placeholder.jpg"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "9999px", 
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
                  <button className="solicitar-adopcion-button" onClick={handleSolicitarAdopcionClick}>
                    Solicitar Adopción
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
        )}
      </div>
    </ProtectedRoute>
  );
}