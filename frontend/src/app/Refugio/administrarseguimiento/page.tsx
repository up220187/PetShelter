"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import EditDocumentIcon from "../../components/icon/EditDocumentIcon";
import CloseCircleIcon from "../../components/icon/CloseCircleIcon";

interface Seguimiento {
  _id: string;
  segIdMascotas: {
    _id: string;
    masNombre: string;
    masImagen?: string;
  } | string;
  segIdUsuario: {
    _id: string;
    usuNombre: string;
    usuCorreo: string;
  } | string;
  segFecha: string;
  segFotos?: any;
  segComentarios: string;
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
  masEstado: string;
}

interface SeguimientoForm {
  segIdMascotas: string;
  segIdUsuario: string;
  segFecha: string;
  segComentarios: string;
}

export default function AdministrarSeguimiento() {
  const { token } = useAuth();
  const router = useRouter();

  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [solicitudesAprobadas, setSolicitudesAprobadas] = useState<any[]>([]);
  const [mascotasDisponibles, setMascotasDisponibles] = useState<Mascota[]>([]);
  const [selectedSeguimiento, setSelectedSeguimiento] = useState<Seguimiento | null>(null);
  const [formData, setFormData] = useState<SeguimientoForm>({
    segIdMascotas: "",
    segIdUsuario: "",
    segFecha: "",
    segComentarios: "",
  });

  // Obtener todos los seguimientos
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/seguimientos`, {
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
          setSeguimientos(data);
        } else {
          console.error('La respuesta no es un array:', data);
          setSeguimientos([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener seguimientos:", err);
        setSeguimientos([]);
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
          // Filtrar solo mascotas adoptadas para el seguimiento
          const mascotasAdoptadas = data.filter(mascota => mascota.masEstado === 'Adoptado');
          setMascotas(mascotasAdoptadas);
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

  // Obtener solicitudes aprobadas para vincular usuario-mascota
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
          // Filtrar solo solicitudes aprobadas
          const aprobadas = data.filter(solicitud => solicitud.solEstado === 'Aprobada');
          setSolicitudesAprobadas(aprobadas);
        } else {
          console.error('La respuesta de solicitudes no es un array:', data);
          setSolicitudesAprobadas([]);
        }
      })
      .catch(err => {
        console.error("Error al obtener solicitudes:", err);
        setSolicitudesAprobadas([]);
      });
  }, [token]);

  // Funciones helper para obtener nombres
  const getUserName = (seguimiento: Seguimiento) => {
    if (typeof seguimiento.segIdUsuario === 'object' && seguimiento.segIdUsuario?._id && seguimiento.segIdUsuario?.usuNombre) {
      return seguimiento.segIdUsuario.usuNombre;
    }
    
    if (typeof seguimiento.segIdUsuario === 'string') {
      const usuario = usuarios.find(u => u._id === seguimiento.segIdUsuario);
      return usuario?.usuNombre || `Usuario ID: ${seguimiento.segIdUsuario.slice(-6)}`;
    }
    
    return 'Usuario no encontrado';
  };

  const getMascotaName = (seguimiento: Seguimiento) => {
    if (typeof seguimiento.segIdMascotas === 'object' && seguimiento.segIdMascotas?._id && seguimiento.segIdMascotas?.masNombre) {
      return seguimiento.segIdMascotas.masNombre;
    }
    
    if (typeof seguimiento.segIdMascotas === 'string') {
      const mascota = mascotas.find(m => m._id === seguimiento.segIdMascotas);
      return mascota?.masNombre || `Mascota ID: ${seguimiento.segIdMascotas.slice(-6)}`;
    }
    
    return 'Mascota no encontrada';
  };

  const resetForm = () => {
    setFormData({
      segIdMascotas: "",
      segIdUsuario: "",
      segFecha: "",
      segComentarios: "",
    });
    setSelectedSeguimiento(null);
    setMascotasDisponibles([]);
  };

  // Filtrar mascotas basado en el usuario seleccionado
  const filtrarMascotasPorUsuario = (usuarioId: string) => {
    if (!usuarioId) {
      setMascotasDisponibles([]);
      return;
    }

    // Buscar las solicitudes aprobadas para este usuario
    const solicitudesDelUsuario = solicitudesAprobadas.filter(solicitud => {
      const solIdUsuario = typeof solicitud.solIdUsuario === 'object' 
        ? solicitud.solIdUsuario._id 
        : solicitud.solIdUsuario;
      return solIdUsuario === usuarioId;
    });

    // Obtener los IDs de las mascotas que este usuario adoptó
    const mascotasDelUsuario = solicitudesDelUsuario.map(solicitud => {
      const mascotaId = typeof solicitud.solIdMascota === 'object' 
        ? solicitud.solIdMascota._id 
        : solicitud.solIdMascota;
      return mascotaId;
    });

    // Filtrar las mascotas adoptadas para mostrar solo las de este usuario
    const mascotasFiltradas = mascotas.filter(mascota => 
      mascotasDelUsuario.includes(mascota._id)
    );

    setMascotasDisponibles(mascotasFiltradas);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Si se cambió el usuario, filtrar mascotas para ese usuario
    if (name === 'segIdUsuario') {
      filtrarMascotasPorUsuario(value);
      // Resetear la mascota seleccionada cuando cambie el usuario
      setFormData(prev => ({ ...prev, segIdMascotas: "" }));
    }
  };

  const handleSelect = (seguimiento: Seguimiento) => {
    setSelectedSeguimiento(seguimiento);
    
    // Manejar segIdUsuario de forma segura
    let usuarioId = "";
    if (typeof seguimiento.segIdUsuario === 'object' && seguimiento.segIdUsuario?._id) {
      usuarioId = seguimiento.segIdUsuario._id;
    } else if (typeof seguimiento.segIdUsuario === 'string') {
      usuarioId = seguimiento.segIdUsuario;
    }
    
    // Manejar segIdMascotas de forma segura
    let mascotaId = "";
    if (typeof seguimiento.segIdMascotas === 'object' && seguimiento.segIdMascotas?._id) {
      mascotaId = seguimiento.segIdMascotas._id;
    } else if (typeof seguimiento.segIdMascotas === 'string') {
      mascotaId = seguimiento.segIdMascotas;
    }
    
    setFormData({
      segIdUsuario: usuarioId,
      segIdMascotas: mascotaId,
      segFecha: seguimiento.segFecha?.split('T')[0] || "",
      segComentarios: seguimiento.segComentarios || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seguimientos/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setSeguimientos((prev) => prev.filter((s) => s._id !== id));
        resetForm();
      }
    } catch (error) {
      console.error("Error al eliminar seguimiento:", error);
    }
  };

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar fecha
    const selectedDate = new Date(formData.segFecha);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      return;
    }

    // Para nuevos seguimientos, validar que se haya seleccionado usuario y mascota
    if (!selectedSeguimiento && (!formData.segIdUsuario || !formData.segIdMascotas)) {
      return;
    }

    // Para seguimientos existentes, usar los IDs actuales
    const usuarioId = selectedSeguimiento 
      ? (typeof selectedSeguimiento.segIdUsuario === 'object' 
          ? selectedSeguimiento.segIdUsuario._id 
          : selectedSeguimiento.segIdUsuario)
      : formData.segIdUsuario;

    const mascotaId = selectedSeguimiento 
      ? (typeof selectedSeguimiento.segIdMascotas === 'object' 
          ? selectedSeguimiento.segIdMascotas._id 
          : selectedSeguimiento.segIdMascotas)
      : formData.segIdMascotas;

    const method = selectedSeguimiento ? "PUT" : "POST";
    const endpoint = selectedSeguimiento ? `/seguimientos/${selectedSeguimiento._id}` : "/seguimientos";

    // Preparar los datos para enviar
    const dataToSend = {
      ...formData,
      segIdUsuario: usuarioId, // Usar el ID correcto del usuario
      segIdMascotas: mascotaId, // Usar el ID correcto de la mascota
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
        // Recargar los seguimientos para ver los cambios
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al guardar el seguimiento:", error);
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
          <h1 className="text-3xl font-bold text-orange-600">Administrar Seguimiento</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Lista de seguimientos */}
          <div className="w-1/3 bg-white rounded-lg shadow p-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Seguimientos Registrados</h2>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition"
                title="Registrar nuevo seguimiento"
              >
                <span className="text-xl leading-none">＋</span> Nuevo
              </button>
            </div>

            {seguimientos.length ? (
              <ul className="space-y-4">
                {seguimientos.map((seguimiento) => (
                  <li
                    key={seguimiento._id}
                    className={`flex items-start gap-3 p-3 border rounded hover:bg-gray-50 transition ${
                      selectedSeguimiento?._id === seguimiento._id ? "bg-blue-50 border-blue-300" : "border-gray-200"
                    }`}
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => handleSelect(seguimiento)}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">Seguimiento #{seguimiento._id.slice(-6)}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Usuario:</p>
                          <p className="font-medium">{getUserName(seguimiento)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Mascota:</p>
                          <p className="font-medium">{getMascotaName(seguimiento)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Fecha:</p>
                          <p className="font-medium">{formatDate(seguimiento.segFecha)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Comentarios:</p>
                          <p className="font-medium text-xs truncate">{seguimiento.segComentarios || "Sin comentarios"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleSelect(seguimiento)} title="Editar" className="p-1">
                        <EditDocumentIcon width={20} height={20} stroke="#1E40AF" />
                      </button>
                      <button onClick={() => handleDelete(seguimiento._id)} title="Eliminar" className="p-1">
                        <CloseCircleIcon width={20} height={20} stroke="#DC2626" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay seguimientos registrados.</p>
            )}
          </div>

          {/* Formulario */}
          <div className="w-2/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSeguimiento ? "Editar Seguimiento" : "Registrar Nuevo Seguimiento"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Usuario:</label>
                {selectedSeguimiento ? (
                  // Si está editando un seguimiento, mostrar solo el usuario de ese seguimiento (no editable)
                  <input 
                    type="text" 
                    value={getUserName(selectedSeguimiento)} 
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                ) : (
                  // Si es un nuevo seguimiento, mostrar todos los usuarios disponibles
                  <select 
                    name="segIdUsuario" 
                    value={formData.segIdUsuario || ""} 
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
                )}
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Mascota:</label>
                {selectedSeguimiento ? (
                  // Si está editando un seguimiento, mostrar solo la mascota de ese seguimiento (no editable)
                  <input 
                    type="text" 
                    value={getMascotaName(selectedSeguimiento)} 
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    disabled
                    readOnly
                  />
                ) : (
                  // Si es un nuevo seguimiento, mostrar solo mascotas adoptadas por el usuario seleccionado
                  <select 
                    name="segIdMascotas" 
                    value={formData.segIdMascotas || ""} 
                    onChange={handleChange} 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!formData.segIdUsuario}
                  >
                    <option value="">
                      {!formData.segIdUsuario 
                        ? "Selecciona un usuario primero" 
                        : mascotasDisponibles.length === 0 
                          ? "Este usuario no tiene mascotas adoptadas" 
                          : "Seleccionar mascota adoptada"
                      }
                    </option>
                    {mascotasDisponibles.map((mascota) => (
                      <option key={mascota._id} value={mascota._id}>
                        {mascota.masNombre} (Adoptado)
                      </option>
                    ))}
                  </select>
                )}
                {!selectedSeguimiento && formData.segIdUsuario && mascotasDisponibles.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    Este usuario no tiene mascotas adoptadas para seguimiento.
                  </p>
                )}
                {!selectedSeguimiento && !formData.segIdUsuario && (
                  <p className="text-sm text-gray-500 mt-1">
                    Selecciona un usuario para ver sus mascotas adoptadas.
                  </p>
                )}
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium">Fecha del Seguimiento:</label>
                <input 
                  type="date" 
                  name="segFecha" 
                  value={formData.segFecha || ""} 
                  onChange={handleChange} 
                  max={getMinDate()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Solo se permiten fechas hasta hoy</p>
              </div>

              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium">Comentarios del Seguimiento:</label>
                <textarea 
                  name="segComentarios" 
                  value={formData.segComentarios || ""} 
                  onChange={handleChange} 
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe el estado actual de la mascota, comportamiento, salud, etc."
                  required
                />
              </div>

              <div className="col-span-2 flex justify-start">
                <button 
                  type="submit" 
                  className="bg-yellow-400 hover:bg-yellow-300 text-white px-6 py-2 rounded-md transition"
                >
                  {selectedSeguimiento ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
