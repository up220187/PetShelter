"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { crearVisita } from "../../services/visitaService";
import { getMascotaPorId } from "../../services/mascotaService";

interface Mascota {
  _id: string;
  masNombre: string;
  masImagen?: string;
  masRaza: string;
  masTipo: string;
}

export default function SolicitarVisitaPage() {
  const { token, user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();

  const idMascota = params.get("mascotaId") || "";
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Obtener fecha mínima (hoy)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Mapa de horarios para mostrar etiquetas amigables (8 AM a 4 PM)
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

  // Obtener horarios disponibles para una mascota en una fecha específica
  const obtenerHorariosDisponibles = async (mascotaId: string, fecha: string) => {
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
          visFechaVisita: fecha
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

  useEffect(() => {
    if (!idMascota || !token) return;
    getMascotaPorId(idMascota, token)
      .then(setMascota)
      .catch(() => setMensaje("Error al cargar mascota"));
  }, [idMascota, token]);

  useEffect(() => {
    if (!fecha || !idMascota || !token) return;
    obtenerHorariosDisponibles(idMascota, fecha);
    setHora(""); // Resetear hora cuando cambie la fecha
  }, [fecha, idMascota, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user || !user.usuId || !mascota || !fecha || !hora) {
      setMensaje("Error: Completa todos los campos.");
      return;
    }

    setEnviando(true);

    const nuevaVisita = {
      visIdUsuario: user.usuId,
      visIdMascota: mascota._id,
      visFechaVisita: fecha,
      visHoraVisita: hora,
      visEstadoVisita: "Confirmada",
    };

    try {
      await crearVisita(token, nuevaVisita);
      setMensaje("Visita agendada correctamente!");
      setFecha("");
      setHora("");
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        router.push("/Adoptantes/VerMascotas");
      }, 3000);
      
    } catch (err: any) {
      setMensaje("Error al agendar visita: " + (err.message || ""));
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    if (mensaje && !mensaje.includes("correctamente")) {
      const timer = setTimeout(() => setMensaje(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">
          Solicitar Visita
        </h1>
        <p className="text-gray-600">
          Agenda tu visita con la mascota
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
              <span className="text-green-800 font-medium">Disponible para visita</span>
            </div>
          </div>
        </div>
      )}

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Fecha de visita</label>
            <input 
              type="date" 
              value={fecha || ""} 
              onChange={(e) => setFecha(e.target.value)} 
              min={getMinDate()}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
              required
            />
          </div>

          {fecha && (
            <div>
              <label className="block mb-2 font-medium text-gray-700">Horario de visita</label>
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                required
                disabled={!fecha}
              >
                <option value="">
                  {!fecha 
                    ? "Selecciona una fecha primero" 
                    : horariosDisponibles.length === 0 
                      ? "No hay horarios disponibles" 
                      : "Seleccionar horario"
                  }
                </option>
                {horariosDisponibles.map((h) => (
                  <option key={h} value={h}>
                    {horariosLabels[h] || h}
                  </option>
                ))}
              </select>
              {fecha && horariosDisponibles.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No hay horarios disponibles para esta mascota en la fecha seleccionada.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando || !fecha || !hora}
            className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-xl transition-all duration-300 ${
              enviando || !fecha || !hora
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
                Agendando visita...
              </span>
            ) : (
              `Agendar visita con ${mascota?.masNombre}`
            )}
          </button>

          {mensaje && (
            <div
              className={`mt-6 p-6 rounded-xl text-center font-medium border-2 ${
                mensaje.includes("correctamente")
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <div className="text-lg">{mensaje}</div>
              {mensaje.includes("correctamente") && (
                <div className="mt-4">
                  <p className="text-sm text-green-600 mb-2">
                    Tu visita ha sido agendada exitosamente
                  </p>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="text-xs text-green-700">
                      Recibirás una confirmación y detalles adicionales pronto.<br/>
                      Serás redirigido automáticamente en unos segundos...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
