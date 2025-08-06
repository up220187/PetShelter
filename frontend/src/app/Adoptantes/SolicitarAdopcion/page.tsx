"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { crearSolicitudAdopcion, obtenerMisSolicitudesAdopcion } from "../../services/adopcionService";
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
  solIdMascota: {
    _id: string;
    masNombre: string;
    masRaza: string;
    masTipo: string;
    masImagen?: string;
  };
  solFechaSolicitud: string;
  solEstado: string;
}

export default function SolicitarAdopcionPage() {
  const { token, user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();

  const idMascota = params.get("mascotaId") || "";
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [misSolicitudes, setMisSolicitudes] = useState<SolicitudAdopcion[]>([]);

  useEffect(() => {
    if (!idMascota || !token) return;
    getMascotaPorId(idMascota, token)
      .then(setMascota)
      .catch(() => setMensaje("Error al cargar mascota"));
  }, [idMascota, token]);

  // Cargar las solicitudes del usuario
  useEffect(() => {
    if (!token) return;
    obtenerMisSolicitudesAdopcion(token)
      .then(setMisSolicitudes)
      .catch(() => console.log("Error al cargar mis solicitudes"));
  }, [token]);

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aprobada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rechazada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aprobada':
        return '✅';
      case 'rechazada':
        return '❌';
      default:
        return '⏳';
    }
  };

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
      
      // Actualizar la lista de solicitudes
      obtenerMisSolicitudesAdopcion(token)
        .then(setMisSolicitudes)
        .catch(() => console.log("Error al actualizar solicitudes"));
      
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

  useEffect(() => {
    if (mensaje && !mensaje.includes("exitosamente")) {
      const timer = setTimeout(() => setMensaje(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Mis Solicitudes - Sección prominente al inicio */}
      {misSolicitudes.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            📋 Estado de mis Solicitudes de Adopción
          </h2>
          <div className="grid gap-4">
            {misSolicitudes.map((solicitud) => (
              <div
                key={solicitud._id}
                className={`p-4 rounded-lg border-2 transition-all ${getEstadoColor(solicitud.solEstado)}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={solicitud.solIdMascota?.masImagen || "/placeholder.jpg"}
                    alt={solicitud.solIdMascota?.masNombre}
                    className="w-20 h-20 object-cover rounded-full border-3 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">
                      {solicitud.solIdMascota?.masNombre}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {solicitud.solIdMascota?.masRaza} • {solicitud.solIdMascota?.masTipo}
                    </p>
                    <p className="text-sm text-gray-500">
                      📅 Solicitado el: {new Date(solicitud.solFechaSolicitud).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-center bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-2xl mb-2">{getEstadoIcon(solicitud.solEstado)}</div>
                    <div className="font-bold text-lg capitalize mb-2">
                      {solicitud.solEstado}
                    </div>
                    {solicitud.solEstado.toLowerCase() === 'aprobada' && (
                      <div className="bg-green-100 px-3 py-2 rounded-full">
                        <p className="text-sm font-semibold text-green-700">
                          ¡Felicitaciones!
                        </p>
                        <p className="text-xs text-green-600">
                          Tu adopción fue aprobada
                        </p>
                      </div>
                    )}
                    {solicitud.solEstado.toLowerCase() === 'rechazada' && (
                      <div className="bg-red-100 px-3 py-2 rounded-full">
                        <p className="text-sm font-semibold text-red-700">
                          No aprobada
                        </p>
                        <p className="text-xs text-red-600">
                          Puedes intentar con otra mascota
                        </p>
                      </div>
                    )}
                    {solicitud.solEstado.toLowerCase() === 'pendiente' && (
                      <div className="bg-yellow-100 px-3 py-2 rounded-full">
                        <p className="text-sm font-semibold text-yellow-700">
                          En revisión
                        </p>
                        <p className="text-xs text-yellow-600">
                          El refugio está evaluando tu solicitud
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">
          Solicitud de Adopción
        </h1>
        <p className="text-gray-600">
          Tu solicitud se enviará automáticamente
        </p>
      </div>

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
      )}
    </div>
  );
}