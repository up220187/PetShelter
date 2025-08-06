"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { crearSolicitudAdopcion, obtenerSolicitudesAdopcion, eliminarSolicitudAdopcion } from "../../services/adopcionService";
import { getMascotaPorId } from "../../services/mascotaService";

interface Mascota {
  _id: string;
  masNombre: string;
  masImagen?: string;
  masRaza: string;
  masTipo: string;
}

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

export default function SolicitarAdopcionPage() {
  const { token, user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();

  const idMascota = params.get("mascotaId") || "";
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarSolicitudes, setMostrarSolicitudes] = useState(false);

  // Cargar mascota si se proporciona ID
  useEffect(() => {
    if (!idMascota || !token) return;
    getMascotaPorId(idMascota, token)
      .then(setMascota)
      .catch(() => setMensaje("Error al cargar mascota"));
  }, [idMascota, token]);

  // Cargar solicitudes del usuario
  useEffect(() => {
    if (!token || !user) return;
    obtenerSolicitudesAdopcion(token)
      .then((data) => {
        // Filtrar solo las solicitudes del usuario actual
        const solicitudesUsuario = data.filter((sol: SolicitudAdopcion) => 
          sol.solIdUsuario._id === user.usuId
        );
        setSolicitudes(solicitudesUsuario);
      })
      .catch(() => setMensaje("Error al cargar solicitudes"));
  }, [token, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user || !user.usuId || !mascota) {
      setMensaje("Error: Usuario no autenticado o mascota no encontrada.");
      return;
    }

    setEnviando(true);

    const nuevaSolicitud = {
      solIdUsuario: user.usuId,
      solIdMascota: mascota._id,
      solFechaSolicitud: new Date().toISOString(),
      solEstado: "Pendiente"
    };

    try {
      await crearSolicitudAdopcion(token, nuevaSolicitud);
      setMensaje("Solicitud de adopción enviada exitosamente!");
      
      // Recargar solicitudes
      const data = await obtenerSolicitudesAdopcion(token);
      const solicitudesUsuario = data.filter((sol: SolicitudAdopcion) => 
        sol.solIdUsuario._id === user.usuId
      );
      setSolicitudes(solicitudesUsuario);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push("/Adoptantes/VerMascotas");
      }, 3000);
      
    } catch (err: any) {
      setMensaje("Error al enviar solicitud de adopción: " + (err.message || ""));
    } finally {
      setEnviando(false);
    }
  };

  const eliminarSolicitud = async (id: string) => {
    if (!token) return;
    
    try {
      await eliminarSolicitudAdopcion(token, id);
      setSolicitudes(solicitudes.filter(sol => sol._id !== id));
      setMensaje("Solicitud eliminada exitosamente");
    } catch (err: any) {
      setMensaje("Error al eliminar solicitud: " + (err.message || ""));
    }
  };

  useEffect(() => {
    if (mensaje && !mensaje.includes("exitosamente")) {
      const timer = setTimeout(() => setMensaje(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">
          Gestión de Adopciones
        </h1>
        <p className="text-gray-600">
          Administra tus solicitudes de adopción
        </p>
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setMostrarSolicitudes(false)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            !mostrarSolicitudes 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Nueva Solicitud
        </button>
        <button
          onClick={() => setMostrarSolicitudes(true)}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            mostrarSolicitudes 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Mis Solicitudes ({solicitudes.length})
        </button>
      </div>

      {/* Vista de solicitudes existentes */}
      {mostrarSolicitudes && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Solicitudes de Adopción</h2>
          
          {solicitudes.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-xl text-center">
              <p className="text-gray-600 text-lg">No tienes solicitudes de adopción</p>
              <button
                onClick={() => setMostrarSolicitudes(false)}
                className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Crear Primera Solicitud
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {solicitudes.map((solicitud) => (
                <div key={solicitud._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={solicitud.solIdMascota.masImagen || "/placeholder.jpg"}
                        alt={solicitud.solIdMascota.masNombre}
                        className="w-20 h-20 object-cover rounded-full border-2 border-orange-200"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {solicitud.solIdMascota.masNombre}
                        </h3>
                        <p className="text-gray-600">
                          {solicitud.solIdMascota.masRaza} • {solicitud.solIdMascota.masTipo}
                        </p>
                        <p className="text-sm text-gray-500">
                          Solicitado: {new Date(solicitud.solFechaSolicitud).toLocaleDateString('es-ES')}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                          solicitud.solEstado === 'Aprobada' ? 'bg-green-100 text-green-800' :
                          solicitud.solEstado === 'Rechazada' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {solicitud.solEstado}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => eliminarSolicitud(solicitud._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                        title="Eliminar solicitud"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                  
                  {solicitud.solFechaVisitaProgramada && (
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 font-medium">
                        📅 Visita programada: {new Date(solicitud.solFechaVisitaProgramada).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista de nueva solicitud */}
      {!mostrarSolicitudes && (
        <>
          {mascota && (
            <div className="flex items-center gap-6 mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg p-6 rounded-xl border-l-4 border-orange-500">
              <img
                src={mascota.masImagen || "/placeholder.jpg"}
                alt={mascota.masNombre}
                className="w-32 h-32 object-cover rounded-full border-4 border-orange-200 shadow-md"
              />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{mascota.masNombre}</h2>
                <p className="text-lg text-gray-600 mb-3">
                  {mascota.masRaza} • {mascota.masTipo}
                </p>
                <div className="bg-green-100 px-4 py-2 rounded-full inline-flex items-center">
                  <span className="text-green-800 font-medium">Disponible para adopción</span>
                </div>
              </div>
            </div>
          )}

          {!mascota && !idMascota && (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                💡 ¿Cómo solicitar una adopción?
              </h3>
              <p className="text-blue-700">
                Para solicitar la adopción de una mascota específica, ve a la sección "Ver Mascotas" 
                y haz clic en "Adoptar" en la mascota que te interese.
              </p>
              <button
                onClick={() => router.push("/Adoptantes/VerMascotas")}
                className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ver Mascotas Disponibles
              </button>
            </div>
          )}

          {mascota && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Datos del usuario
                  </h3>
                  <div className="space-y-1">
                    <p className="text-blue-700"><strong>Nombre:</strong> {user?.usuNombre}</p>
                    <p className="text-blue-700"><strong>Email:</strong> {user?.usuCorreo}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={enviando}
                  className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-xl transition-all duration-300 ${
                    enviando 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {enviando ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando solicitud...
                    </span>
                  ) : (
                    `Adoptar a ${mascota?.masNombre}`
                  )}
                </button>
              </form>
            </div>
          )}
        </>
      )}

      {mensaje && (
        <div
          className={`mt-6 p-6 rounded-xl text-center font-medium border-2 ${
            mensaje.includes("exitosamente")
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="text-lg">{mensaje}</div>
          {mensaje.includes("exitosamente") && (
            <div className="mt-4">
              <p className="text-sm text-green-600 mb-2">
                Tu solicitud ha sido enviada exitosamente
              </p>
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-xs text-green-700">
                  El refugio revisará tu solicitud y se pondrá en contacto contigo pronto.<br/>
                  Serás redirigido automáticamente en unos segundos...
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}