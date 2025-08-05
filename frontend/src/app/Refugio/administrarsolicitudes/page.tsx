// src/app/dashboard/shelter/requests/page.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Importa useEffect
import { useRouter } from "next/navigation"; // Importa useRouter
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta a tu AuthContext
import CheckButton from '../../components/icon/CheckButton';
import CloseCircleIcon from '../../components/icon/CloseCircleIcon';

export default function AdministrarSolicitudesPage() {
  const { user, token, isLoading } = useAuth(); // Obtén user, token, e isLoading del contexto
  const router = useRouter(); // Inicializa el router

  // Estado para la solicitud actualmente seleccionada
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Array de solicitudes vacío por defecto
  const allRequests = [
    // Simular algunas solicitudes para tener algo que mostrar y hacer clic
    // En un escenario real, esto vendría de una API
    /*
    { id: 1, adopterName: "Valeria Montes", adopterAge: 24, petName: "Pelusa", petBreed: "Siamés", petAge: "7 meses", petImage: "/images/pelusa.jpg" },
    { id: 2, adopterName: "Diego Cervantes", adopterAge: 32, petName: "Trueno", petBreed: "Labrador", petAge: "2 años", petImage: "/images/trueno.jpg" },
    { id: 3, adopterName: "Adriana Salteño", adopterAge: 23, petName: "Luna", petBreed: "Mestiza", petAge: "1 año", petImage: "/images/luna.jpg" },
    */
  ];

  // Efecto para verificar la autenticación y el rol del usuario
  useEffect(() => {
    // Si isLoading es true, significa que el contexto aún está intentando cargar el token de localStorage.
    // Esperamos a que termine antes de decidir si redirigir.
    if (isLoading) {
      return;
    }

    // Si isLoading es false y no hay token, significa que el usuario no está autenticado.
    if (!token) {
      console.log('AdministrarSolicitudesPage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
      return; // Detener la ejecución si no hay token
    }

    // Si hay token pero el rol no es 'refugio', redirigir o mostrar mensaje de acceso denegado
    if (user && user.usuRol !== 'refugio') {
      console.log('AdministrarSolicitudesPage: Usuario no autorizado. Rol:', user.usuRol);
      // Podrías redirigir a una página de "Acceso Denegado" o al dashboard principal
      router.push('/unauthorized'); // Crea una página para manejar esto o redirige a otro lado
    }
  }, [token, isLoading, user, router]); // Dependencias del efecto: re-evaluar si token, isLoading, user o router cambian

  // Función para seleccionar una solicitud y mostrar la info de la mascota
  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    // Aquí, en un caso real, buscarías los detalles completos de la mascota por request.petId
    // Para este placeholder, asumimos que 'request' ya trae la info básica de la mascota.
  };

  // Función para "cerrar" los detalles de la mascota y volver a la lista de solicitudes
  const handleClosePetDetails = () => {
    setSelectedRequest(null);
  };

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando información de autenticación...</p>
      </div>
    );
  }

  // Si no hay token o el rol no es 'refugio' después de que la carga ha terminado,
  // no se renderiza el formulario (el useEffect ya habrá disparado la redirección)
  if (!token || (user && user.usuRol !== 'refugio')) {
    return null; // O podrías renderizar un mensaje de "Acceso Denegado" aquí si lo prefieres antes de la redirección.
  }

  return (
    <div className="request-management-container">
      <h1 className="request-title">Administrar Solicitudes de Adopción</h1>

      <div className="request-grid">
        {/* Columna izquierda: Información de la mascota asociada a la solicitud seleccionada */}
        <div className="pet-info-section">
          {selectedRequest ? (
            <>
              {/* Botón para cerrar los detalles de la mascota */}
              <button className="close-pet-details" onClick={handleClosePetDetails}>
                <CloseCircleIcon /> {/* Icono de cerrar */}
              </button>
              {/* Aquí irían los detalles de la mascota específica de la solicitud */}
              <div className="pet-image-placeholder active"></div>
              <div className="pet-name-placeholder active"></div>
              <div className="pet-details-placeholder active">
                <p className="detail-line"></p> {/* Para raza */}
                <p className="detail-line"></p> {/* Para edad */}
                <p className="detail-line-full"></p> {/* Para descripción */}
                <p className="detail-line-form"></p> {/* Para el placeholder del formulario */}
              </div>
              <div className="request-actions">
                <button className="action-button accept-button">Aceptar Solicitud</button>
                <button className="action-button reject-button">Rechazar Solicitud</button>
              </div>
            </>
          ) : (
            <div className="no-request-selected-message">
              <p>Selecciona una solicitud de la lista para ver los detalles de la mascota y del solicitante.</p>
            </div>
          )}
        </div>

        {/* Columna derecha: Lista de solicitantes */}
        <div className="pending-requests-section">
          <h2 className="section-title">Solicitudes de {selectedRequest ? 'Adopción' : 'Usuarios'}</h2>
          {allRequests.length > 0 ? (
            <div className="requests-cards-container">
              {allRequests.map((request) => (
                <div key={request.id} className={`request-card ${selectedRequest && selectedRequest.id === request.id ? 'selected' : ''}`} onClick={() => handleSelectRequest(request)}>
                  <div className="card-header">
                    <div className="adopter-picture-placeholder"></div>
                    <span className="adopter-name-placeholder"></span>
                    <span className="adopter-age-placeholder"></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-requests-message">No hay solicitudes de adopción pendientes en este momento.</p>
          )}
        </div>
      </div>
    </div>
  );
}