// src/app/dashboard/customer/visits/page.tsx
"use client";

import React, { useEffect } from 'react'; // Importa useEffect
import { useRouter } from "next/navigation"; // Importa useRouter
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta a tu AuthContext

export default function AdministrarVisitasPage() {
  const { user, token, isLoading } = useAuth(); // Obtén user, token, e isLoading del contexto
  const router = useRouter(); // Inicializa el router

  // Array de visitas pendientes vacío por defecto
  const pendingVisits = []; // Ahora está vacío, sin ejemplos.

  // Efecto para verificar la autenticación y el rol del usuario
  useEffect(() => {
    // Si isLoading es true, significa que el contexto aún está intentando cargar el token de localStorage.
    // Esperamos a que termine antes de decidir si redirigir.
    if (isLoading) {
      return;
    }

    // Si isLoading es false y no hay token, significa que el usuario no está autenticado.
    if (!token) {
      console.log('AdministrarVisitasPage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
      return; // Detener la ejecución si no hay token
    }

    // Si hay token pero el rol no es 'adoptante', redirigir o mostrar mensaje de acceso denegado
    if (user && user.usuRol !== 'adoptante') {
      console.log('AdministrarVisitasPage: Usuario no autorizado. Rol:', user.usuRol);
      // Podrías redirigir a una página de "Acceso Denegado" o al dashboard principal
      router.push('/unauthorized'); // Crea una página para manejar esto o redirige a otro lado
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
  // no se renderiza el contenido (el useEffect ya habrá disparado la redirección)
  if (!token || (user && user.usuRol !== 'adoptante')) {
    return null; // O podrías renderizar un mensaje de "Acceso Denegado" aquí si lo prefieres antes de la redirección.
  }

  return (
    <div className="visit-management-container">
      <h1 className="visit-title">Administrar Mis Visitas</h1>

      {/* Columna derecha: Tarjetas de visitas pendientes */}
      <div className="pending-visits-section">
        <h2 className="section-title">Visitas Pendientes</h2>
        {pendingVisits.length > 0 ? (
          <div className="visits-cards-container">
            {pendingVisits.map((visit) => (
              <div key={visit.id} className="visit-card">
                <div className="card-header">
                  <span className="card-shelter-name">{visit.shelterName}</span>
                  <span className="card-pet-name">Mascota: {visit.petName}</span>
                </div>
                <div className="card-body">
                  <p>Fecha: {visit.date}</p>
                  <p>Hora: {visit.time}</p>
                </div>
                <div className="card-actions">
                  <button className="card-button view-button">Ver Detalles</button>
                  <button className="card-button cancel-button">Cancelar Visita</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-visits-message">No tienes visitas pendientes en este momento.</p>
        )}
      </div>
    </div>
  );
}