"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import EditDocumentIcon from "../../components/icon/EditDocumentIcon";
import CloseCircleIcon from "../../components/icon/CloseCircleIcon";

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

interface Usuario {
  _id: string;
  usuNombre: string;
  usuCorreo: string;
}

interface Mascota {
  _id: string;
  masNombre: string;
  masImagen?: string;
}

interface VisitaForm {
  visIdUsuario: string;
  visIdMascota: string;
  visFechaVisita: string;
  visHoraVisita: string;
  visEstadoVisita: string;
}

export default function AdministrarVisitas() {
  const { token } = useAuth();
  const router = useRouter();

  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [formData, setFormData] = useState<VisitaForm>({
    visIdUsuario: "",
    visIdMascota: "",
    visFechaVisita: "",
    visHoraVisita: "",
    visEstadoVisita: "Confirmada",
  });

  // Obtener todas las visitas
  useEffect(() => {
    if (!token) return;
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
          setVisitas(data);
        } else {
          console.error('La respuesta no es un array:', data);
          setVisitas([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener visitas:", err);
        setVisitas([]);
      });
  }, [token]);

  // Obtener usuarios para el select
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios`, {
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
          setUsuarios(data);
        } else {
          console.error('La respuesta de usuarios no es un array:', data);
          setUsuarios([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener usuarios:", err);
        setUsuarios([]);
      });
  }, [token]);

  // Obtener mascotas para el select
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas`, {
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
          setMascotas(data);
        } else {
          console.error('La respuesta de mascotas no es un array:', data);
          setMascotas([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener mascotas:", err);
        setMascotas([]);
      });
  }, [token]);

  // Funciones helper para obtener nombres
  const getUserName = (visita: Visita) => {
    // Si visIdUsuario es un objeto poblado
    if (typeof visita.visIdUsuario === 'object' && visita.visIdUsuario?._id && visita.visIdUsuario?.usuNombre) {
      return visita.visIdUsuario.usuNombre;
    }
    
    // Si es solo un ID string, buscar en el array de usuarios
    if (typeof visita.visIdUsuario === 'string') {
      const usuario = usuarios.find(u => u._id === visita.visIdUsuario);
      return usuario?.usuNombre || `Usuario ID: ${visita.visIdUsuario.slice(-6)}`;
    }
    
    return 'Usuario no encontrado';
  };

  const getMascotaName = (visita: Visita) => {
    // Si visIdMascota es un objeto poblado
    if (typeof visita.visIdMascota === 'object' && visita.visIdMascota?._id && visita.visIdMascota?.masNombre) {
      return visita.visIdMascota.masNombre;
    }
    
    // Si es solo un ID string, buscar en el array de mascotas
    if (typeof visita.visIdMascota === 'string') {
      const mascota = mascotas.find(m => m._id === visita.visIdMascota);
      return mascota?.masNombre || `Mascota ID: ${visita.visIdMascota.slice(-6)}`;
    }
    
    return 'Mascota no encontrada';
  };

  const resetForm = () => {
    setFormData({
      visIdUsuario: "",
      visIdMascota: "",
      visFechaVisita: "",
      visHoraVisita: "",
      visEstadoVisita: "Confirmada",
    });
    setSelectedVisita(null);
    setHorariosDisponibles([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Si cambió la mascota o fecha, obtener horarios disponibles
    // Solo si no está editando una visita existente (porque la mascota no se puede cambiar)
    if (name === 'visIdMascota' || name === 'visFechaVisita') {
      const mascotaId = name === 'visIdMascota' ? value : formData.visIdMascota;
      const fecha = name === 'visFechaVisita' ? value : formData.visFechaVisita;
      
      if (mascotaId && fecha) {
        obtenerHorariosDisponibles(mascotaId, fecha, selectedVisita?._id);
      }

      // Si cambió la mascota o fecha, resetear la hora seleccionada
      if (name === 'visIdMascota' || name === 'visFechaVisita') {
        setFormData(prev => ({ ...prev, visHoraVisita: "" }));
      }
    }
  };

  const handleSelect = (visita: Visita) => {
    setSelectedVisita(visita);
    
    // Manejar visIdUsuario de forma segura
    let usuarioId = "";
    if (typeof visita.visIdUsuario === 'object' && visita.visIdUsuario?._id) {
      usuarioId = visita.visIdUsuario._id;
    } else if (typeof visita.visIdUsuario === 'string') {
      usuarioId = visita.visIdUsuario;
    }
    
    // Manejar visIdMascota de forma segura
    let mascotaId = "";
    if (typeof visita.visIdMascota === 'object' && visita.visIdMascota?._id) {
      mascotaId = visita.visIdMascota._id;
    } else if (typeof visita.visIdMascota === 'string') {
      mascotaId = visita.visIdMascota;
    }
    
    const fecha = visita.visFechaVisita?.split('T')[0] || "";
    
    setFormData({
      visIdUsuario: usuarioId,
      visIdMascota: mascotaId,
      visFechaVisita: fecha,
      visHoraVisita: visita.visHoraVisita,
      visEstadoVisita: visita.visEstadoVisita,
    });

    // Obtener horarios disponibles para la mascota y fecha seleccionada
    if (mascotaId && fecha) {
      obtenerHorariosDisponibles(mascotaId, fecha, visita._id);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitas/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setVisitas((prev) => prev.filter((v) => v._id !== id));
        resetForm();
      }
    } catch (error) {
      console.error("Error al eliminar visita:", error);
    }
  };

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Obtener horarios disponibles para una mascota en una fecha específica
  const obtenerHorariosDisponibles = async (mascotaId: string, fecha: string, visitaActualId?: string) => {
    if (!mascotaId || !fecha || !token) {
      setHorariosDisponibles([]);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitas/horarios-disponibles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          visIdMascota: mascotaId,
          visFechaVisita: fecha,
          visitaActualId: visitaActualId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setHorariosDisponibles(data.horariosDisponibles || []);
      } else {
        console.error('Error al obtener horarios disponibles');
        setHorariosDisponibles([]);
      }
    } catch (error) {
      console.error('Error al obtener horarios disponibles:', error);
      setHorariosDisponibles([]);
    }
  };

  // Mapa de horarios para mostrar etiquetas amigables
  const horariosLabels: { [key: string]: string } = {
    "08:00": "8:00 AM - 9:00 AM",
    "09:00": "9:00 AM - 10:00 AM", 
    "10:00": "10:00 AM - 11:00 AM",
    "11:00": "11:00 AM - 12:00 PM",
    "12:00": "12:00 PM - 1:00 PM",
    "13:00": "1:00 PM - 2:00 PM",
    "14:00": "2:00 PM - 3:00 PM",
    "15:00": "3:00 PM - 4:00 PM",
  };

  // Validar si la hora está en el rango permitido
  const isValidTime = (time: string) => {
    return horariosDisponibles.includes(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar horario
    if (!isValidTime(formData.visHoraVisita)) {
      return;
    }
    
    // Validar fecha
    const selectedDate = new Date(formData.visFechaVisita);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return;
    }

    // Para nuevas visitas, validar que se haya seleccionado mascota y fecha
    if (!selectedVisita && (!formData.visIdMascota || !formData.visFechaVisita)) {
      return;
    }

    // Para visitas existentes, usar el ID de la mascota actual
    const mascotaId = selectedVisita 
      ? (typeof selectedVisita.visIdMascota === 'object' 
          ? selectedVisita.visIdMascota._id 
          : selectedVisita.visIdMascota)
      : formData.visIdMascota;

    const method = selectedVisita ? "PUT" : "POST";
    const endpoint = selectedVisita ? `/visitas/${selectedVisita._id}` : "/visitas";

    // Preparar los datos para enviar
    const dataToSend = {
      ...formData,
      visIdMascota: mascotaId, // Usar el ID correcto de la mascota
      visIdRefugio: "507f1f77bcf86cd799439011", // ID del refugio actual (esto debería venir del contexto del refugio)
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        // Recargar las visitas para ver los cambios
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al guardar la visita:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Título principal */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-orange-600">Administrar Visitas</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Lista de visitas */}
          <div className="w-1/3 bg-white rounded-lg shadow p-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Visitas Registradas</h2>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition"
                title="Registrar nueva visita"
              >
                <span className="text-xl leading-none">＋</span> Nueva
              </button>
            </div>

            {visitas.length ? (
              <ul className="space-y-4">
                {visitas.map((visita) => (
                  <li
                    key={visita._id}
                    className={`flex items-start gap-3 p-3 border rounded hover:bg-gray-50 transition ${
                      selectedVisita?._id === visita._id ? "bg-blue-50 border-blue-300" : "border-gray-200"
                    }`}
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => handleSelect(visita)}>
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
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Usuario:</p>
                          <p className="font-medium">{getUserName(visita)}</p>
                        </div>
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
                    
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleSelect(visita)} title="Editar" className="p-1">
                        <EditDocumentIcon width={20} height={20} stroke="#1E40AF" />
                      </button>
                      <button onClick={() => handleDelete(visita._id)} title="Eliminar" className="p-1">
                        <CloseCircleIcon width={20} height={20} stroke="#DC2626" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay visitas registradas.</p>
            )}
          </div>

          {/* Formulario */}
          <div className="w-2/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              {selectedVisita ? "Editar Visita" : "Registrar Nueva Visita"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Usuario:</label>
                <select 
                  name="visIdUsuario" 
                  value={formData.visIdUsuario || ""} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario._id} value={usuario._id}>
                      {usuario.usuNombre} ({usuario.usuCorreo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Mascota:</label>
                {selectedVisita ? (
                  // Si está editando una visita, mostrar solo la mascota de esa visita (no editable)
                  <input 
                    type="text" 
                    value={getMascotaName(selectedVisita)} 
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                ) : (
                  // Si es una nueva visita, mostrar todas las mascotas disponibles
                  <select 
                    name="visIdMascota" 
                    value={formData.visIdMascota || ""} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccionar mascota</option>
                    {mascotas.map((mascota) => (
                      <option key={mascota._id} value={mascota._id}>
                        {mascota.masNombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Fecha de Visita:</label>
                <input 
                  type="date" 
                  name="visFechaVisita" 
                  value={formData.visFechaVisita || ""} 
                  onChange={handleChange} 
                  min={getMinDate()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Horario de Visita:</label>
                <select 
                  name="visHoraVisita" 
                  value={formData.visHoraVisita || ""} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={!formData.visIdMascota || !formData.visFechaVisita}
                >
                  <option value="">
                    {!formData.visIdMascota || !formData.visFechaVisita 
                      ? "Selecciona mascota y fecha primero" 
                      : horariosDisponibles.length === 0 
                        ? "No hay horarios disponibles" 
                        : "Seleccionar horario"
                    }
                  </option>
                  {horariosDisponibles.map((horario) => (
                    <option key={horario} value={horario}>
                      {horariosLabels[horario] || horario}
                    </option>
                  ))}
                </select>
                {formData.visIdMascota && formData.visFechaVisita && horariosDisponibles.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    No hay horarios disponibles para esta mascota en la fecha seleccionada.
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium">Estado de la Visita:</label>
                <select 
                  name="visEstadoVisita" 
                  value={formData.visEstadoVisita || ""} 
                  onChange={handleChange} 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>

              <div className="col-span-2 flex justify-start">
                <button 
                  type="submit" 
                  className="bg-yellow-400 hover:bg-yellow-300 text-white px-6 py-2 rounded-md transition"
                >
                  {selectedVisita ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}