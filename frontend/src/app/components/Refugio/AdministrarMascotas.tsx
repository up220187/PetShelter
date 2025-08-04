"use client";
import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Mascota {
  _id: string;
  masNombre: string;
  masNacimiento: string;
  masSexo: string;
  masTamaño: string;
  masEstadoSalud: string;
  masComportamiento: string;
  masEsterilizado: boolean;
  masEstado: string;
  masIdTipoMascota: string;
  masIdRefugio: string;
}

export default function AdministrarMascotas() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [nuevaMascota, setNuevaMascota] = useState<Partial<Mascota>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/mascotas`, {
      headers: { Authorization: "Bearer " }
    })
      .then(res => res.json())
      .then(data => setMascotas(data))
      .catch(err => console.error("Error cargando mascotas:", err));
  }, []);

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
    setNuevaMascota({
      ...nuevaMascota,
      [name]: e.target.checked,
    });
  } else {
    setNuevaMascota({
      ...nuevaMascota,
      [name]: value,
    });
  }
};


  const handleCrearMascota = async () => {
    const res = await fetch(`${API_URL}/mascotas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer TU_TOKEN_AQUI"
      },
      body: JSON.stringify(nuevaMascota),
    });
    if (res.ok) {
      const nueva = await res.json();
      setMascotas(prev => [...prev, nueva]);
      setShowForm(false);
      setNuevaMascota({});
    } else {
      console.error("Error al crear mascota");
    }
  };

  const handleEliminarMascota = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta mascota?")) return;
    const res = await fetch(`${API_URL}/mascotas/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer TU_TOKEN_AQUI" }
    });
    if (res.ok) {
      setMascotas(prev => prev.filter(m => m._id !== id));
    } else {
      console.error("Error eliminando mascota");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Administrar Mascotas</h2>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowForm(true)}
      >
        Agregar Mascota
      </button>

      {showForm && (
        <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
          <h3 className="font-semibold mb-2">Nueva Mascota</h3>
          <div className="grid gap-2">
            <input name="masNombre" placeholder="Nombre" onChange={handleChange} />
            <input name="masNacimiento" type="date" onChange={handleChange} />
            <select name="masSexo" onChange={handleChange}>
              <option value="">Sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            <select name="masTamaño" onChange={handleChange}>
              <option value="">Tamaño</option>
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>
            <input name="masEstadoSalud" placeholder="Estado de salud" onChange={handleChange} />
            <select name="masComportamiento" onChange={handleChange}>
              <option value="">Comportamiento</option>
              <option value="Agresivo">Agresivo</option>
              <option value="Asustadizo">Asustadizo</option>
              <option value="Juguetón">Juguetón</option>
              <option value="Tranquilo">Tranquilo</option>
            </select>
            <label>
              <input type="checkbox" name="masEsterilizado" onChange={handleChange} />
              Esterilizado
            </label>
            <input name="masIdTipoMascota" placeholder="ID tipo mascota" onChange={handleChange} />
            <input name="masIdRefugio" placeholder="ID refugio" onChange={handleChange} />

            <button
              onClick={handleCrearMascota}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {mascotas.map((mascota) => (
          <div key={mascota._id} className="p-4 border rounded shadow">
            <h4 className="text-lg font-bold">{mascota.masNombre}</h4>
            <p>Sexo: {mascota.masSexo}</p>
            <p>Tamaño: {mascota.masTamaño}</p>
            <p>Salud: {mascota.masEstadoSalud}</p>
            <p>Estado: {mascota.masEstado}</p>
            <button
              onClick={() => handleEliminarMascota(mascota._id)}
              className="mt-2 text-red-500 underline"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
