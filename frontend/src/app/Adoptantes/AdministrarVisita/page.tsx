"use client";

export default function AdministrarVisitasPage() {
  // Array de visitas pendientes vacío por defecto
  const pendingVisits = []; // Ahora está vacío, sin ejemplos.

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