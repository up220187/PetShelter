"use client";

import React, { useState } from 'react';
import jsPDF from 'jspdf';

//ejemplo
export default function AdministrarVisitasPage() {
  const [pendingVisits, setPendingVisits] = useState([
    { id: 1, shelterName: "Refugio Patitas Felices", address: "Calle Falsa 123, Ciudad del Sol", petName: "Buddy", date: "2025-08-10", time: "10:00 AM" },
    { id: 2, shelterName: "Amigos Caninos", address: "Avenida Siempreviva 742, Villa Esperanza", petName: "Princesa", date: "2025-08-12", time: "03:30 PM" },
    { id: 3, shelterName: "Casa Gatos y Perros", address: "Bulevar de los Sueños Rotos 45, Pueblo Mágico", petName: "Whiskers", date: "2025-08-15", time: "11:00 AM" },
  ]);

  // Función para manejar la cancelación de una visita
  const handleCancelVisit = (idToCancel) => {
    const updatedVisits = pendingVisits.filter(visit => visit.id !== idToCancel);
    setPendingVisits(updatedVisits);
    alert(`La visita ha sido cancelada exitosamente.`); 
  };

  const handleDownloadPdf = async (visit) => {
    const docWidth = 210;
    const docHeight = 220; 
    const doc = new jsPDF('p', 'mm', [docWidth, docHeight]);

    // --- Cargar imágenes ---
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = (error) => {
          console.error(`Error al cargar la imagen ${src}:`, error);
          reject(new Error(`Failed to load image: ${src}`));
        };
        img.src = src;
      });
    };

    let logoImg, pawsImg;

    try {
      [logoImg, pawsImg] = await Promise.all([
        loadImage('/logo1.png'), 
        loadImage('/paws.png')   
      ]);
    } catch (error) {
      console.error("No se pudieron cargar todas las imágenes para el PDF:", error);
      alert("No se pudieron cargar todas las imágenes para el PDF. Se generará un PDF sin ellas.");
    }

    // --- Encabezado ---
    doc.setFillColor('#FFF7ED');
    doc.rect(0, 0, docWidth, 40, 'F');

    if (logoImg) {
      doc.addImage(logoImg, 'PNG', 10, 10, 50, 20); 
    }

    // Título principal
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#f97316');
    doc.text('Confirmación de Cita', docWidth / 2, 25, { align: 'center' });

    // --- Línea separadora y subtítulo ---
    doc.setDrawColor('#E5D585');
    doc.setLineWidth(1);
    doc.line(20, 45, docWidth - 20, 45);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#333333');
    doc.text('Detalles de tu Visita Programada', docWidth / 2, 55, { align: 'center' });

    // --- Información de la Cita ---
    let y = 70; 

    doc.setFontSize(14);
    doc.setTextColor('#444444');

    // Refugio
    doc.setFont('helvetica', 'bold');
    doc.text('Refugio:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(visit.shelterName, 60, y);
    y += 10;

    // Dirección del Refugio
    doc.setFont('helvetica', 'bold');
    doc.text('Dirección:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(visit.address, 60, y);
    y += 10;

    // Mascota
    doc.setFont('helvetica', 'bold');
    doc.text('Mascota:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(visit.petName, 60, y);
    y += 10;

    // Fecha
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(visit.date, 60, y);
    y += 10;

    // Hora
    doc.setFont('helvetica', 'bold');
    doc.text('Hora:', 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(visit.time, 60, y);
    y += 15; 

    // --- Secciones adicionales ---
    const infoBoxY = y; 
    doc.setFillColor('#F9F9F9');
    doc.roundedRect(15, infoBoxY, docWidth - 30, 40, 5, 5, 'F');

    doc.setFontSize(12);
    doc.setTextColor('#555555');
    doc.setFont('helvetica', 'bold');
    doc.text('Información Importante:', 20, infoBoxY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text('• Por favor, llega 10 minutos antes de tu cita.', 20, infoBoxY + 20);
    doc.text('• Prepara cualquier pregunta que tengas sobre la mascota.', 20, infoBoxY + 27);
    y = infoBoxY + 45; 

    // Recuadro naranja
    const thanksBoxY = y; 
    doc.setFillColor('#FFFBEB');
    doc.roundedRect(15, thanksBoxY, docWidth - 30, 25, 5, 5, 'F');

    doc.setFontSize(14);
    doc.setTextColor('#f97316');
    doc.setFont('helvetica', 'bold');
    doc.text('¡Gracias por tu interés en la adopción!', docWidth / 2, thanksBoxY + 15, { align: 'center' });
    y = thanksBoxY + 30; 

    // --- Pie de página con Patitas y Texto ---
    const footerTextY = docHeight - 15;
    const copyrightTextY = docHeight - 10;
    const pawsImgHeight = 60;
    const pawsImgWidth = 35;

    if (pawsImg) {
      doc.addImage(pawsImg, 'PNG', docWidth - 20 - pawsImgWidth, docHeight - pawsImgHeight - -5, pawsImgWidth, pawsImgHeight);
    }

    doc.setFontSize(10);
    doc.setTextColor('#888888');
    doc.text('Documento generado automáticamente por PetShelter.', 20, footerTextY);
    doc.text('Visítanos en www.PetShelter.com', 20, copyrightTextY);

    doc.save(`cita_mascota_${visit.petName.replace(/\s/g, '_')}_${visit.date}.pdf`);
  };

  return (
    <div className="visit-management-container">
      <h1 className="visit-title">Administrar Mis Visitas</h1>

      <div className="pending-visits-section">
        <h2 className="section-title">Visitas Pendientes</h2>
        {pendingVisits.length > 0 ? (
          <div className="visits-cards-container">
            {pendingVisits.map((visit) => (
              <div key={visit.id} className="visit-card">
                <div className="card-header">
                  <span className="card-shelter-name">Mascota: {visit.petName}</span>
                </div>
                <div className="card-body">
                  <p>Fecha: {visit.date}</p>
                  <p>Hora: {visit.time}</p>
                </div>
                <div className="card-actions">
                  <button
                    className="card-button cancel-button"
                    onClick={() => handleCancelVisit(visit.id)} 
                  >
                    Cancelar Visita
                  </button>
                  <button
                    className="card-button download-pdf-button"
                    onClick={() => handleDownloadPdf(visit)}
                  >
                    Descargar PDF
                  </button>
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