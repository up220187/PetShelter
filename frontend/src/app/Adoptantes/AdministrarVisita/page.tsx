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
      const doc = new jsPDF();
      
      // Configuración inicial
      doc.setFontSize(20);
      doc.setTextColor(255, 140, 0); // Color naranja
      doc.text('COMPROBANTE DE VISITA', 105, 30, { align: 'center' });
      
      // Línea decorativa
      doc.setDrawColor(255, 140, 0);
      doc.setLineWidth(2);
      doc.line(20, 40, 190, 40);
      
      // Información de la visita
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('DATOS DE LA VISITA:', 20, 60);
      
      doc.setFontSize(12);
      doc.text(`ID de Visita: #${visita._id.slice(-8).toUpperCase()}`, 20, 75);
      doc.text(`Estado: ${visita.visEstadoVisita}`, 20, 85);
      doc.text(`Fecha: ${formatDate(visita.visFechaVisita)}`, 20, 95);
      doc.text(`Hora: ${visita.visHoraVisita}`, 20, 105);
      
      // Información de la mascota
      doc.setFontSize(14);
      doc.text('DATOS DE LA MASCOTA:', 20, 125);
      
      doc.setFontSize(12);
      doc.text(`Nombre: ${getMascotaName(visita)}`, 20, 140);
      
      // Información del visitante
      doc.setFontSize(14);
      doc.text('DATOS DEL VISITANTE:', 20, 160);
      
      doc.setFontSize(12);
      if (typeof visita.visIdUsuario === 'object' && visita.visIdUsuario) {
        doc.text(`Nombre: ${visita.visIdUsuario.usuNombre}`, 20, 175);
        doc.text(`Correo: ${visita.visIdUsuario.usuCorreo}`, 20, 185);
      } else {
        doc.text(`Usuario: ${user?.usuNombre || 'No disponible'}`, 20, 175);
        doc.text(`Correo: ${user?.usuCorreo || 'No disponible'}`, 20, 185);
      }
      
      // Información adicional según el estado
      let yPos = 205;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      
      if (visita.visEstadoVisita === 'Confirmada') {
        doc.text('INSTRUCCIONES:', 20, yPos);
        yPos += 10;
        doc.text('• Presente este comprobante al llegar al refugio', 20, yPos);
        yPos += 8;
        doc.text('• Llegue 10 minutos antes de la hora programada', 20, yPos);
        yPos += 8;
        doc.text('• Traiga identificación oficial', 20, yPos);
      } else if (visita.visEstadoVisita === 'Realizada') {
        doc.text('Esta visita ha sido completada exitosamente.', 20, yPos);
      } else if (visita.visEstadoVisita === 'Cancelada') {
        doc.text('Esta visita ha sido cancelada.', 20, yPos);
      }
      
      // Pie de página
      yPos += 20;
      doc.text('Este documento sirve como comprobante de su visita programada.', 105, yPos, { align: 'center' });
      yPos += 8;
      doc.text('Para más información, contacte al refugio.', 105, yPos, { align: 'center' });
      
      // Fecha de generación
      yPos += 15;
      const fechaGeneracion = new Date().toLocaleDateString('es-ES');
      const horaGeneracion = new Date().toLocaleTimeString('es-ES');
      doc.text(`Documento generado el: ${fechaGeneracion} a las ${horaGeneracion}`, 105, yPos, { align: 'center' });
      
      // Descargar PDF
      const nombreArchivo = `Ticket_Visita_${getMascotaName(visita).replace(/\s+/g, '_')}_${formatDate(visita.visFechaVisita).replace(/\//g, '-')}.pdf`;
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