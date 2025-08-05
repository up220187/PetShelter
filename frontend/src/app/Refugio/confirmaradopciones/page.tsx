"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import EditDocumentIcon from "../../components/icon/EditDocumentIcon";
import CloseCircleIcon from "../../components/icon/CloseCircleIcon";

interface SolicitudAdopcion {
  _id: string;
  solIdUsuario: {
    _id: string;
    usuNombre: string;
    usuCorreo: string;
    usuTelefono?: string;
    usuDireccion?: string;
  };
  solIdMascota: {
    _id: string;
    masNombre: string;
    masRaza: string;
    masTipo: string;
    masImagen?: string;
    masEstado?: string;
    masSexo?: string;
    masTamaño?: string;
    masEsterilizado?: boolean;
    masComportamiento?: string;
    masEstadoSalud?: string;
    masNacimiento?: string;
  };
  solFechaSolicitud: string;
  solEstado: string;
  solFechaVisitaProgramada?: string;
}

export default function AdministrarSolicitudes() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudAdopcion | null>(null);
  const [formData, setFormData] = useState<Partial<SolicitudAdopcion>>({
    solEstado: "Pendiente",
  });

  // Efecto para verificar la autenticación y el rol del usuario
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!token) {
      console.log('AdministrarSolicitudes: No se encontró authToken de sesión. Redirigiendo al login.');
      router.push('/login');
      return;
    }

    if (user && user.usuRol !== 'refugio') {
      console.log('AdministrarSolicitudes: Usuario no autorizado. Rol:', user.usuRol);
      router.push('/unauthorized');
      return;
    }
  }, [token, isLoading, user, router]);

  // Obtener todas las solicitudes
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes`, {
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
          setSolicitudes(data);
        } else {
          console.error('La respuesta no es un array:', data);
          setSolicitudes([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener solicitudes:", err);
        setSolicitudes([]);
      });
  }, [token]);

  const resetForm = () => {
    setFormData({
      solEstado: "Pendiente",
    });
    setSelectedSolicitud(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = (solicitud: SolicitudAdopcion) => {
    setSelectedSolicitud(solicitud);
    
    setFormData({
      solEstado: solicitud.solEstado,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error();
      setSolicitudes((prev) => prev.filter((s) => s._id !== id));
      resetForm();
    } catch {
      alert("Error al eliminar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolicitud) return;

    // Preparar datos manteniendo los IDs obligatorios
    const dataToSend = {
      solIdUsuario: selectedSolicitud.solIdUsuario._id,
      solIdMascota: selectedSolicitud.solIdMascota._id,
      solEstado: formData.solEstado,
      solFechaSolicitud: selectedSolicitud.solFechaSolicitud,
    };

    console.log('Datos del formulario antes de enviar:', dataToSend);

    try {
      // 1. Actualizar la solicitud
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${selectedSolicitud._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log('Error del servidor:', errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const updated = await res.json();
      console.log('Datos actualizados recibidos:', updated);

      // 2. Si la solicitud fue aprobada, actualizar el estado de la mascota
      if (formData.solEstado === 'Aprobada') {
        const currentMascotaEstado = selectedSolicitud.solIdMascota?.masEstado;

        // Lógica simplificada: Disponible -> Adoptado directamente
        if (currentMascotaEstado === 'Disponible') {
          try {
            // Primero obtenemos todos los datos actuales de la mascota
            const mascotaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${selectedSolicitud.solIdMascota._id}`, {
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            });

            if (mascotaResponse.ok) {
              const mascotaCompleta = await mascotaResponse.json();
              
              // Preparamos los datos completos con el estado actualizado directamente a "Adoptado"
              const mascotaUpdateData = {
                ...mascotaCompleta,
                masEstado: 'Adoptado'
              };

              console.log(`Actualizando mascota ${selectedSolicitud.solIdMascota._id} de ${currentMascotaEstado} a Adoptado`);

              const mascotaRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${selectedSolicitud.solIdMascota._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify(mascotaUpdateData),
              });

              if (!mascotaRes.ok) {
                const errorText = await mascotaRes.text();
                console.error('Error al actualizar estado de la mascota:', errorText);
              } else {
                console.log('Estado de la mascota actualizado correctamente a Adoptado');
              }
            }
          } catch (error) {
            console.error('Error al obtener/actualizar datos de la mascota:', error);
          }
        }
      }

      // 3. Si la solicitud fue rechazada, regresar la mascota a "Disponible" (si estaba "Adoptado")
      if (formData.solEstado === 'Rechazada' && selectedSolicitud.solIdMascota?.masEstado === 'Adoptado') {
        try {
          // Primero obtenemos todos los datos actuales de la mascota
          const mascotaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${selectedSolicitud.solIdMascota._id}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });

          if (mascotaResponse.ok) {
            const mascotaCompleta = await mascotaResponse.json();
            
            // Preparamos los datos completos con el estado actualizado
            const mascotaUpdateData = {
              ...mascotaCompleta,
              masEstado: 'Disponible'
            };

            console.log(`Regresando mascota ${selectedSolicitud.solIdMascota._id} a Disponible por rechazo`);

            const mascotaRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${selectedSolicitud.solIdMascota._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: JSON.stringify(mascotaUpdateData),
            });

            if (!mascotaRes.ok) {
              const errorText = await mascotaRes.text();
              console.error('Error al actualizar estado de la mascota:', errorText);
            } else {
              console.log('Estado de la mascota regresado a Disponible');
            }
          }
        } catch (error) {
          console.error('Error al obtener/actualizar datos de la mascota:', error);
        }
      }

      // 4. Refrescar la lista completa
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSolicitudes(data);
          const updatedSolicitud = data.find(s => s._id === selectedSolicitud._id);
          if (updatedSolicitud) {
            setSelectedSolicitud(updatedSolicitud);
            setFormData({
              solEstado: updatedSolicitud.solEstado,
            });
          }
        }
      })
      .catch(err => console.error('Error al refrescar datos:', err));

    } catch (error) {
      console.error('Error completo:', error);
      // Removemos el alert para que sea silencioso como pediste
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No especificada";
    try {
      const fecha = new Date(dateString);
      if (isNaN(fecha.getTime())) return "Fecha inválida";
      
      // Formatear usando la zona horaria local para evitar problemas de UTC
      const day = String(fecha.getDate()).padStart(2, '0');
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const year = fecha.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return "Error en fecha";
    }
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Título principal */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-500">Administrar Solicitudes de Adopción</h1>
      </div>

      <div className="flex gap-6">
        {/* Lista de solicitudes */}
        <div className="w-1/3 bg-yellow-100 rounded-lg shadow p-4 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Solicitudes de Usuarios</h2>
          </div>

          {solicitudes.length ? (
          <ul className="space-y-4">
            {solicitudes.map((solicitud) => (
              <li
                key={solicitud._id}
                className={`flex items-center gap-3 p-3 rounded hover:bg-yellow-100 transition border ${
                  selectedSolicitud?._id === solicitud._id ? "bg-yellow-200 border-yellow-400" : "border-gray-200"
                }`}
              >
                <img
                  src={solicitud.solIdMascota?.masImagen || "/placeholder.jpg"}
                  alt={solicitud.solIdMascota?.masNombre || "Mascota"}
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  onClick={() => handleSelect(solicitud)}
                />
                <div className="flex-1 cursor-pointer" onClick={() => handleSelect(solicitud)}>
                  <p className="font-semibold text-sm">
                    {solicitud.solIdUsuario?.usuNombre}
                  </p>
                  <p className="text-xs text-gray-600">
                    Mascota: {solicitud.solIdMascota?.masNombre}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Solicitud:</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      solicitud.solEstado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      solicitud.solEstado === 'Aprobada' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {solicitud.solEstado}
                    </span>
                  </div>
                  {solicitud.solIdMascota?.masEstado && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Mascota:</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        solicitud.solIdMascota.masEstado === 'Disponible' ? 'bg-green-100 text-green-800' :
                        solicitud.solIdMascota.masEstado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {solicitud.solIdMascota.masEstado}
                      </span>
                    </div>
                  )}
                </div>
                <button onClick={() => handleSelect(solicitud)} title="Editar">
                  <EditDocumentIcon width={20} height={20} stroke="#1E40AF" />
                </button>
                <button onClick={() => handleDelete(solicitud._id)} title="Eliminar">
                  <CloseCircleIcon width={20} height={20} stroke="#DC2626" />
                </button>
              </li>
            ))}
          </ul>
          ) : (
            <p className="text-gray-500">No hay solicitudes de adopción pendientes en este momento.</p>
          )}
        </div>

        {/* Formulario de detalles */}
        <div className="w-2/3 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {selectedSolicitud ? "Detalles de la Solicitud" : "Selecciona una Solicitud"}
          </h2>        {selectedSolicitud ? (
          <div>
            {/* Información de la solicitud */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-bold text-lg mb-3">Datos del Solicitante</h3>
                <p><strong>Nombre:</strong> {selectedSolicitud.solIdUsuario?.usuNombre}</p>
                <p><strong>Email:</strong> {selectedSolicitud.solIdUsuario?.usuCorreo}</p>
                <p><strong>Teléfono:</strong> {selectedSolicitud.solIdUsuario?.usuTelefono || "No especificado"}</p>
                <p><strong>Dirección:</strong> {selectedSolicitud.solIdUsuario?.usuDireccion || "No especificada"}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">Datos de la Mascota</h3>
                <div className="flex items-start gap-4">
                  <img
                    src={selectedSolicitud.solIdMascota?.masImagen || "/placeholder.jpg"}
                    alt={selectedSolicitud.solIdMascota?.masNombre}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><strong>Nombre:</strong> {selectedSolicitud.solIdMascota?.masNombre}</p>
                      <p><strong>Raza:</strong> {selectedSolicitud.solIdMascota?.masRaza}</p>
                      <p><strong>Tipo:</strong> {selectedSolicitud.solIdMascota?.masTipo}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedSolicitud.solIdMascota?.masEstado === 'Disponible' ? 'bg-green-100 text-green-800' :
                          selectedSolicitud.solIdMascota?.masEstado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedSolicitud.solIdMascota?.masEstado || 'No especificado'}
                        </span>
                      </p>
                      <p><strong>Sexo:</strong> {selectedSolicitud.solIdMascota?.masSexo || 'No especificado'}</p>
                      <p><strong>Tamaño:</strong> {selectedSolicitud.solIdMascota?.masTamaño || 'No especificado'}</p>
                      <p><strong>Esterilizado:</strong> {selectedSolicitud.solIdMascota?.masEsterilizado ? 'Sí' : 'No'}</p>
                      <p><strong>Comportamiento:</strong> {selectedSolicitud.solIdMascota?.masComportamiento || 'No especificado'}</p>
                    </div>
                    {selectedSolicitud.solIdMascota?.masEstadoSalud && (
                      <p className="mt-2 text-sm"><strong>Estado de Salud:</strong> {selectedSolicitud.solIdMascota.masEstadoSalud}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de edición */}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Estado:</label>
                <select 
                  name="solEstado" 
                  value={formData.solEstado || ""} 
                  onChange={handleChange} 
                  className="admin-form-input"
                >
                  {/* Si la solicitud está Pendiente, mostrar todas las opciones */}
                  {selectedSolicitud.solEstado === 'Pendiente' && (
                    <>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                    </>
                  )}
                  
                  {/* Si la solicitud está Aprobada, solo permitir Aprobada o Rechazada */}
                  {selectedSolicitud.solEstado === 'Aprobada' && (
                    <>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                    </>
                  )}
                  
                  {/* Si la solicitud está Rechazada, permitir todas las opciones para poder corregir */}
                  {selectedSolicitud.solEstado === 'Rechazada' && (
                    <>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Fecha de Solicitud:</label>
                <input 
                  type="text" 
                  value={formatDate(selectedSolicitud.solFechaSolicitud)} 
                  disabled 
                  className="admin-form-input bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Información sobre el comportamiento del sistema */}
              <div className="col-span-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Información del Sistema</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Aprobar solicitud:</strong> Cambia el estado de la mascota de "Disponible" directamente a "Adoptado"</li>
                  <li>• <strong>Rechazar solicitud:</strong> Si la mascota estaba "Adoptado", regresa a "Disponible"</li>
                  <li>• <strong>Estados de mascota:</strong> Disponible ↔ Adoptado (flujo simplificado)</li>
                  <li>• <strong>Restricción:</strong> Una vez aprobada, solo se puede cambiar a "Rechazada" (no se puede regresar a "Pendiente")</li>
                </ul>
              </div>

              <div className="col-span-2 flex justify-between">
                <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-white px-6 py-2 rounded">
                  Actualizar Solicitud
                </button>
                <button type="button" className="text-gray-600 underline" onClick={resetForm}>
                  Cancelar edición
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Selecciona una solicitud de la lista para ver los detalles de la mascota y del solicitante.</p>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

