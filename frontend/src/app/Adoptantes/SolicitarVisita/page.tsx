"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { crearVisita, obtenerHorasOcupadas } from "../../services/visitaService";
import { getMascotaPorId } from "../../services/mascotaService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Mascota {
  _id: string;
  masNombre: string;
  masImagen?: string;
  masRaza: string;
  masTipo: string;
  // masIdRefugio ya no se usa
}

const horasDisponibles = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00"
];

export default function SolicitarVisitaPage() {
  const { token, user } = useAuth();
  const params = useSearchParams();

  const idMascota = params.get("mascotaId") || "";
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [hora, setHora] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!idMascota || !token) return;
    getMascotaPorId(idMascota, token)
      .then(setMascota)
      .catch(() => setMensaje("Error al cargar mascota"));
  }, [idMascota, token]);

  useEffect(() => {
    if (!fecha || !idMascota || !token) return;
    const fechaISO = fecha.toISOString().split("T")[0];
    obtenerHorasOcupadas(token, idMascota, fechaISO)
      .then(setHorasOcupadas)
      .catch(() => setHorasOcupadas([]));
  }, [fecha, idMascota, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user || !user.usuId || !mascota || !fecha || !hora) {
      setMensaje("Completa todos los campos.");
      return;
    }

    const nuevaVisita = {
      visIdUsuario: user.usuId,
      visIdMascota: mascota._id,
      visFechaVisita: fecha.toISOString().split("T")[0],
      visHoraVisita: hora,
      visEstadoVisita: "Confirmada",
    };

    try {
      await crearVisita(token, nuevaVisita);
      setMensaje("✅ Visita agendada correctamente");
      setFecha(null);
      setHora("");
    } catch (err: any) {
      setMensaje("❌ " + (err.message || "Error al agendar visita"));
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-orange-500">Solicitar Visita</h1>

      {mascota && (
        <div className="flex items-center gap-4 mb-6 bg-white shadow p-4 rounded-lg">
          <img
            src={mascota.masImagen || "/placeholder.jpg"}
            alt={mascota.masNombre}
            className="w-24 h-24 object-cover rounded-full border"
          />
          <div>
            <p className="text-xl font-semibold">{mascota.masNombre}</p>
            <p className="text-sm text-gray-600">
              {mascota.masRaza} • {mascota.masTipo}
            </p>
            <p className="text-sm text-gray-400">ID: {mascota._id}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block mb-1 font-medium">Fecha de visita</label>
          <DatePicker
            selected={fecha}
            onChange={setFecha}
            minDate={new Date()}
            placeholderText="Selecciona una fecha"
            dateFormat="yyyy-MM-dd"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {fecha && (
          <div>
            <label className="block mb-1 font-medium">Hora</label>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecciona una hora</option>
              {horasDisponibles.map((h) => (
                <option key={h} value={h} disabled={horasOcupadas.includes(h)}>
                  {h} {horasOcupadas.includes(h) ? "(Ocupada)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Agendar Visita
        </button>

        {mensaje && (
          <div
            className={`mt-4 text-sm ${
              mensaje.startsWith("✅")
                ? "text-green-600"
                : mensaje.startsWith("❌")
                ? "text-red-600"
                : "text-gray-700"
            }`}
          >
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
}
