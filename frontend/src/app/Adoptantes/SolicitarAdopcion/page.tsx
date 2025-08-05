// src/app/dashboard/customer/solicitar-adopcion/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Importa useRouter
import { useAuth } from "../../context/AuthContext"; // Asegúrate de la ruta correcta a tu AuthContext

export default function SolicitarAdopcionPage() {
  const searchParams = useSearchParams();
  const petName = searchParams.get('petName'); // Obtener el nombre de la mascota de la URL

  const { user, token, isLoading } = useAuth(); // Obtén user, token, e isLoading del contexto
  const router = useRouter(); // Inicializa el router

  // Puedes añadir estado para manejar los campos del formulario si lo deseas
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    motivation: ''
  });

  // Efecto para verificar la autenticación y el rol del usuario
  useEffect(() => {
    // Si isLoading es true, significa que el contexto aún está intentando cargar el token de localStorage.
    // Esperamos a que termine antes de decidir si redirigir.
    if (isLoading) {
      return;
    }

    // Si isLoading es false y no hay token, significa que el usuario no está autenticado.
    if (!token) {
      console.log('SolicitarAdopcionPage: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
      return; // Detener la ejecución si no hay token
    }

    // Si hay token pero el rol no es 'adoptante', redirigir o mostrar mensaje de acceso denegado
    // Esta página es específicamente para que un "adoptante" solicite una adopción/visita.
    if (user && user.usuRol !== 'adoptante') {
      console.log('SolicitarAdopcionPage: Usuario no autorizado. Rol:', user.usuRol);
      // Podrías redirigir a una página de "Acceso Denegado" o al dashboard principal
      router.push('/unauthorized'); // Crea una página para manejar esto o redirige a otro lado
    }
  }, [token, isLoading, user, router]); // Dependencias del efecto: re-evaluar si token, isLoading, user o router cambian


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
    <div className="adoption-form-page-container">
      <h1 className="form-page-title">Solicitar Visita</h1>

      <div className="adoption-form-container">
        <div className="form-header">
          <h3 className="form-title-adopcion">
            Formulario de Visita para {petName || 'una mascota'}
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