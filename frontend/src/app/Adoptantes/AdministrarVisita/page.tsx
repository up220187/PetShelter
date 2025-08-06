"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import CloseCircleIcon from "../../components/icon/CloseCircleIcon";

// Importación dinámica de jsPDF para evitar problemas SSR
const generatePDF = async () => {
  const jsPDF = (await import('jspdf')).default;
  return jsPDF;
};

interface Visita {
  _id: string;
  visIdUsuario: {
    _id: string;
    usuNombre: string;
    usuCorreo: string;
  } | string;
  visIdMascota: {
    _id: string;
    masNombre: string;
    masImagen?: string;
  } | string;
  visIdRefugio: string;
  visFechaVisita: string;
  visHoraVisita: string;
  visEstadoVisita: string;
}

export default function AdministrarVisitasAdoptante() {
  const { token, user } = useAuth();
  const router = useRouter();

  const [visitas, setVisitas] = useState<Visita[]>([]);

  useEffect(() => {
    if (!token || !user?.usuId) return;
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitas`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const visitasUsuario = data.filter(visita => {
            if (typeof visita.visIdUsuario === 'object') {
              return visita.visIdUsuario._id === user.usuId;
            }
            return visita.visIdUsuario === user.usuId;
          });
          setVisitas(visitasUsuario);
        } else {
          console.error('La respuesta no es un array:', data);
          setVisitas([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener visitas:", err);
        setVisitas([]);
      });
  }, [token, user?.usuId]);

  const handleDelete = async (visitaId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitas/${visitaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setVisitas(prev => prev.filter(v => v._id !== visitaId));
      } else {
        console.error("Error al eliminar la visita");
      }
    } catch (error) {
      console.error("Error al eliminar visita:", error);
    }
  };

  const generarTicketPDF = async (visita: Visita) => {
    try {
      const jsPDF = await generatePDF();
      const docWidth = 210;
      const docHeight = 220; 
      const doc = new jsPDF('p', 'mm', [docWidth, docHeight]);

      // --- Cargar imágenes ---
      const loadImage = (src: string) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
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

      let logoImg: HTMLImageElement | undefined, pawsImg: HTMLImageElement | undefined;

      try {
        [logoImg, pawsImg] = await Promise.all([
          loadImage('/logo1.png'), 
          loadImage('/paws.png')   
        ]);
      } catch (error) {
        console.error("No se pudieron cargar todas las imágenes para el PDF:", error);
        console.log("Se generará un PDF sin las imágenes.");
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
      doc.text('Confirmación de Visita', docWidth / 2, 25, { align: 'center' });

      // --- Línea separadora y subtítulo ---
      doc.setDrawColor('#E5D585');
      doc.setLineWidth(1);
      doc.line(20, 45, docWidth - 20, 45);

      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#333333');
      doc.text('Detalles de tu Visita Programada', docWidth / 2, 55, { align: 'center' });

      // --- Información de la Visita ---
      let y = 70; 

      doc.setFontSize(14);
      doc.setTextColor('#444444');

      // ID de Visita
      doc.setFont('helvetica', 'bold');
      doc.text('ID Visita:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(`#${visita._id.slice(-8).toUpperCase()}`, 60, y);
      y += 10;

      // Estado
      doc.setFont('helvetica', 'bold');
      doc.text('Estado:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(visita.visEstadoVisita, 60, y);
      y += 10;

      // Mascota
      doc.setFont('helvetica', 'bold');
      doc.text('Mascota:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(getMascotaName(visita), 60, y);
      y += 10;

      // Fecha
      doc.setFont('helvetica', 'bold');
      doc.text('Fecha:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(formatDate(visita.visFechaVisita), 60, y);
      y += 10;

      // Hora
      doc.setFont('helvetica', 'bold');
      doc.text('Hora:', 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(visita.visHoraVisita, 60, y);
      y += 10;

      // Visitante
      doc.setFont('helvetica', 'bold');
      doc.text('Visitante:', 20, y);
      doc.setFont('helvetica', 'normal');
      const nombreVisitante = typeof visita.visIdUsuario === 'object' && visita.visIdUsuario 
        ? visita.visIdUsuario.usuNombre 
        : user?.usuNombre || 'Usuario';
      doc.text(nombreVisitante, 60, y);
      y += 15; 

      // --- Secciones adicionales ---
      const infoBoxY = y; 
      doc.setFillColor('#F9F9F9');
      doc.roundedRect(15, infoBoxY, docWidth - 30, 45, 5, 5, 'F');

      doc.setFontSize(12);
      doc.setTextColor('#555555');
      doc.setFont('helvetica', 'bold');
      doc.text('Información Importante:', 20, infoBoxY + 10);
      doc.setFont('helvetica', 'normal');
      doc.text('• Por favor, llega 10 minutos antes de tu visita.', 20, infoBoxY + 20);
      doc.text('• Trae identificación oficial.', 20, infoBoxY + 27);
      doc.text('• Prepara cualquier pregunta que tengas sobre la mascota.', 20, infoBoxY + 34);
      y = infoBoxY + 50; 

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
        doc.addImage(pawsImg, 'PNG', docWidth - 20 - pawsImgWidth, docHeight - pawsImgHeight + 5, pawsImgWidth, pawsImgHeight);
      }

      doc.setFontSize(10);
      doc.setTextColor('#888888');
      doc.text('Documento generado automáticamente por PetShelter.', 20, footerTextY);
      doc.text('Visítanos en www.PetShelter.com', 20, copyrightTextY);

      const nombreArchivo = `cita_mascota_${getMascotaName(visita).replace(/\s/g, '_')}_${formatDate(visita.visFechaVisita).replace(/\//g, '-')}.pdf`;
      doc.save(nombreArchivo);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el comprobante PDF. Por favor, inténtalo de nuevo.');
    }
  };

  const getMascotaName = (visita: Visita) => {
    if (typeof visita.visIdMascota === 'object' && visita.visIdMascota) {
      return visita.visIdMascota.masNombre;
    }
    return 'Mascota no encontrada';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Administrar Mis Visitas</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Mis Visitas</h2>

          {visitas.length ? (
            <div className="space-y-4">
              {visitas.map((visita) => (
                <div
                  key={visita._id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">Visita #{visita._id.slice(-6)}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          visita.visEstadoVisita === 'Confirmada' ? 'bg-green-100 text-green-800' :
                          visita.visEstadoVisita === 'Cancelada' ? 'bg-red-100 text-red-800' :
                          visita.visEstadoVisita === 'Realizada' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {visita.visEstadoVisita}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Mascota:</p>
                          <p className="font-medium">{getMascotaName(visita)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Fecha:</p>
                          <p className="font-medium">{formatDate(visita.visFechaVisita)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hora:</p>
                          <p className="font-medium">{visita.visHoraVisita}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex gap-2">
                      <button 
                        onClick={() => generarTicketPDF(visita)} 
                        title="Descargar comprobante PDF" 
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        📄
                      </button>
                      <button 
                        onClick={() => handleDelete(visita._id)} 
                        title="Eliminar visita" 
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <CloseCircleIcon width={20} height={20} stroke="#DC2626" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No tienes visitas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
}