// src/app/dashboard/customer/solicitar-visita/page.tsx
"use client"; // Marca este componente como un Client Component

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Asegúrate de que los estilos de react-datepicker están importados

export default function SolicitarVisitaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petName = searchParams.get('petName'); // Obtener el nombre de la mascota de la URL

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    motivation: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar errores al usuario
  const [successMessage, setSuccessMessage] = useState(''); // Para mostrar mensaje de éxito

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Función para filtrar las fechas disponibles (solo de lunes a viernes y no pasadas)
  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 es Domingo, 6 es Sábado
  };

  const filterPastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establece la hora a 00:00:00 para comparar solo la fecha
    return date >= today && isWeekday(date);
  };

  // Función para generar las horas disponibles (de 8 AM a 4 PM, cada hora, no pasadas)
  const generateTimeSlots = (date: Date | null) => {
    const slots = [];
    const now = new Date();
    const isToday = date && date.toDateString() === now.toDateString();

    for (let hour = 8; hour <= 16; hour++) { // De 8 AM (8) a 4 PM (16)
      const slotTime = new Date();
      slotTime.setHours(hour, 0, 0, 0); // Establece la hora del slot

      // Si es hoy, filtra las horas que ya pasaron
      if (isToday && slotTime <= now) {
        continue;
      }
      slots.push(slotTime);
    }
    return slots;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar errores anteriores
    setSuccessMessage(''); // Limpiar mensajes de éxito anteriores

    if (!selectedDate || !selectedTime) {
      setErrorMessage("Por favor, selecciona una fecha y hora para tu visita.");
      return;
    }

    const visitDateTime = new Date(selectedDate);
    visitDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());

    const visitData = {
      visFechaVisita: visitDateTime.toISOString().split('T')[0], // Formato YYYY-MM-DD
      visHoraVisita: selectedTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }), // Formato HH:MM
      visEstadoVisita: 'Pendiente', // Estado inicial
      adoptanteFullName: formData.fullName,
      adoptantePhone: formData.phone,
      adoptanteEmail: formData.email,
      adoptanteAddress: formData.address,
      motivation: formData.motivation
    };

    console.log("Datos de la visita que se intentarían enviar:", visitData);

    // --- Inicio de la simulación de envío ---
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de red
        setSuccessMessage(`¡Solicitud enviada para ${petName || 'la mascota'} el ${visitDateTime.toLocaleDateString()} a las ${selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}! Te contactaremos pronto.`);
        // Limpiar formulario
        setFormData({ fullName: '', phone: '', email: '', address: '', motivation: '' });
        setSelectedDate(null);
        setSelectedTime(null);
        // Opcional: router.push('/dashboard/customer/visits');
    } catch (error: any) {
        console.error('Error simulado al enviar la solicitud:', error);
        setErrorMessage('Hubo un error al procesar tu solicitud. Inténtalo de nuevo.');
    }
    // --- Fin de la simulación de envío ---
  };

  return (
    <div className="main-content-wrapper"> {/* Contenedor global para centrar */}
      <div className="adoption-form-page-container"> {/* El nuevo contenedor principal del formulario */}
        <h1 className="form-page-title"> {/* El nuevo título */}
          Solicitar Visita para {petName || 'una mascota'}
        </h1>

        {errorMessage && (
          <div className="error-message-box"> {/* Clase para errores */}
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="success-message-box"> {/* Clase para éxito */}
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid-columns"> {/* Usaré una clase para grid */}
          <div className="form-field full-width"> {/* Ajustado para tu CSS */}
            <label htmlFor="fullName" className="form-label">Nombre completo:</label>
            <input
              type="text"
              id="fullName"
              className="form-input" // Clase de tu CSS
              placeholder="Tu nombre completo"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone" className="form-label">Teléfono:</label>
            <input
              type="tel"
              id="phone"
              className="form-input" // Clase de tu CSS
              placeholder="Tu número de teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              className="form-input" // Clase de tu CSS
              placeholder="Tu correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field full-width">
            <label htmlFor="address" className="form-label">Dirección:</label>
            <input
              type="text"
              id="address"
              className="form-input" // Clase de tu CSS
              placeholder="Tu dirección completa"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field full-width">
            <label htmlFor="motivation" className="form-label">
              ¿Por qué quieres visitar a {petName || 'esta mascota'}?
            </label>
            <textarea
              id="motivation"
              className="form-input" // Usando form-input para textarea por simplicidad, puedes crear form-textarea si quieres estilos distintos
              rows={4}
              placeholder="Cuéntanos sobre tu motivación y si tienes experiencia con mascotas"
              value={formData.motivation}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Selector de fecha y hora */}
          <div className="form-field full-width">
            <label className="form-label">Selecciona Fecha de Visita:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              filterDate={filterPastDates}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              className="form-input" // Aplicando clase de tu CSS al input del DatePicker
              minDate={new Date()}
              required
            />
          </div>

          <div className="form-field full-width">
            <label className="form-label">Selecciona Hora de Visita (1 hora):</label>
            <DatePicker
              selected={selectedTime}
              onChange={(date: Date | null) => setSelectedTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={60}
              timeCaption="Hora"
              dateFormat="h:mm aa"
              placeholderText="Selecciona una hora"
              className="form-input" // Aplicando clase de tu CSS al input del DatePicker
              includeTimes={generateTimeSlots(selectedDate)}
              minTime={(() => { const d = new Date(); d.setHours(8, 0, 0, 0); return d; })()}
              maxTime={(() => { const d = new Date(); d.setHours(16, 0, 0, 0); return d; })()}
              required
            />
          </div>

        </form>
        <div className="register-button-wrapper"> {/* Clase para el wrapper del botón */}
          <button type="submit" className="register-button">
            Enviar Solicitud de Visita
          </button>
        </div>
      </div>
    </div>
  );
}