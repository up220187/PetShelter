"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import EditDocumentIcon from "../../components/icon/EditDocumentIcon";
import CloseCircleIcon from "../../components/icon/CloseCircleIcon";

interface Mascota {
  _id: string;
  masNombre: string;
  masSexo: string;
  masImagen?: string;
  masRaza?: string;
  masNacimiento?: string;
  masTamaño?: string;
  masEstadoSalud?: string;
  masComportamiento?: string;
  masEsterilizado?: boolean;
  masEstado?: string;
  masTipo?: string;
}

export default function AdministrarMascotas() {
  const { token } = useAuth();
  const router = useRouter();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [selectedPet, setSelectedPet] = useState<Mascota | null>(null);
  const [formData, setFormData] = useState<Partial<Mascota>>({
    masNombre: "",
    masSexo: "Macho",
    masTipo: "Perro",
    masTamaño: "Mediano",
    masEstado: "Disponible",
    masComportamiento: "Tranquilo",
    masEsterilizado: false,
    masEstadoSalud: "",
    masRaza: "",
    masNacimiento: "",
    masImagen: "",
  });

  // ✅ Obtener todas las mascotas (sin token)
// ✅ Obtener todas las mascotas (requiere token)
useEffect(() => {
  if (!token) return; // Solo si hay token
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // ✅ token necesario
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
        console.error('La respuesta no es un array:', data);
        setMascotas([]);
      }
    })
    .catch(err => {
      console.error("Error al obtener mascotas:", err);
      setMascotas([]);
    });
    console.log("TOKEN en useEffect:", token);
}, [token]);


  const resetForm = () => {
    setFormData({
      masNombre: "",
      masSexo: "Macho",
      masTipo: "Perro",
      masTamaño: "Mediano",
      masEstado: "Disponible",
      masComportamiento: "Tranquilo",
      masEsterilizado: false,
      masEstadoSalud: "",
      masRaza: "",
      masNacimiento: "",
      masImagen: "",
    });
    setSelectedPet(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, masImagen: url }));
    } catch {
      alert("Error al subir imagen");
    }
  };
console.log("TOKEN:", token);

  const handleSelect = (pet: Mascota) => {
    setSelectedPet(pet);
    setFormData({ ...pet });
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("¿Seguro que quieres eliminar esta mascota?");
    if (!confirm) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error();
      alert("Mascota eliminada");
      setMascotas((prev) => prev.filter((m) => m._id !== id));
      resetForm();
    } catch {
      alert("Error al eliminar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = selectedPet ? "PUT" : "POST";
    const endpoint = selectedPet ? `/mascotas/${selectedPet._id}` : "/mascotas";

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      const saved = await res.json();
      alert(`Mascota ${selectedPet ? "actualizada" : "registrada"} correctamente`);

      if (selectedPet) {
        setMascotas((prev) => prev.map((m) => (m._id === saved._id ? saved : m)));
      } else {
        setMascotas((prev) => [...prev, saved]);
      }

      resetForm();
    } catch {
      alert("Error al guardar la mascota");
    }
  };

  return (
    <div className="flex p-6 gap-6 bg-gray-50 min-h-screen">
      {/* Lista de mascotas */}
      <div className="w-1/3 bg-white rounded-lg shadow p-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mascotas Registradas</h2>
          <button
            onClick={resetForm}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition"
            title="Registrar nueva mascota"
          >
            <span className="text-xl leading-none">＋</span> Nueva
          </button>
        </div>

        {mascotas.length ? (
          <ul className="space-y-4">
            {mascotas.map((pet) => (
              <li
                key={pet._id}
                className={`flex items-center gap-3 p-2 rounded hover:bg-yellow-100 transition ${
                  selectedPet?._id === pet._id ? "bg-yellow-200" : ""
                }`}
              >
                <img
                  src={pet.masImagen || "/placeholder.jpg"}
                  alt={pet.masNombre}
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                  onClick={() => handleSelect(pet)}
                />
                <div className="flex-1 cursor-pointer" onClick={() => handleSelect(pet)}>
                  <p className="font-semibold">{pet.masNombre}</p>
                  <p className="text-sm text-gray-600">{pet.masSexo}</p>
                </div>
                <button onClick={() => handleSelect(pet)} title="Editar">
                  <EditDocumentIcon width={24} height={24} stroke="#1E40AF" />
                </button>
                <button onClick={() => handleDelete(pet._id)} title="Eliminar">
                  <CloseCircleIcon width={24} height={24} stroke="#DC2626" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay mascotas registradas.</p>
        )}
      </div>

      {/* Formulario */}
      <div className="w-2/3 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          {selectedPet ? "Editar Mascota" : "Registrar Nueva Mascota"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="masNombre" placeholder="Nombre" value={formData.masNombre || ""} onChange={handleChange} className="input" />
          <input name="masRaza" placeholder="Raza" value={formData.masRaza || ""} onChange={handleChange} className="input" />
          <input type="date" name="masNacimiento" value={formData.masNacimiento || ""} onChange={handleChange} className="input" />

          <select name="masSexo" value={formData.masSexo || ""} onChange={handleChange} className="input">
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>

          <select name="masTamaño" value={formData.masTamaño || ""} onChange={handleChange} className="input">
            <option value="Pequeño">Pequeño</option>
            <option value="Mediano">Mediano</option>
            <option value="Grande">Grande</option>
          </select>

          <input name="masEstadoSalud" placeholder="Estado de Salud" value={formData.masEstadoSalud || ""} onChange={handleChange} className="input" />

          <select name="masComportamiento" value={formData.masComportamiento || ""} onChange={handleChange} className="input">
            <option value="Tranquilo">Tranquilo</option>
            <option value="Juguetón">Juguetón</option>
            <option value="Asustadizo">Asustadizo</option>
            <option value="Agresivo">Agresivo</option>
          </select>

          <select name="masTipo" value={formData.masTipo || ""} onChange={handleChange} className="input">
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Ave">Ave</option>
            <option value="Reptil">Reptil</option>
            <option value="Roedor">Roedor</option>
            <option value="Otro">Otro</option>
          </select>

          <select name="masEstado" value={formData.masEstado || ""} onChange={handleChange} className="input">
            <option value="Disponible">Disponible</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Adoptado">Adoptado</option>
          </select>

          <div className="flex items-center col-span-2 gap-2">
            <label className="text-sm">¿Esterilizado?</label>
            <input name="masEsterilizado" type="checkbox" checked={!!formData.masEsterilizado} onChange={handleChange} />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Imagen:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.masImagen && (
              <img src={formData.masImagen} alt="Preview" className="w-24 h-24 rounded-full object-cover mt-2" />
            )}
          </div>

          <div className="col-span-2 flex justify-between">
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-white px-4 py-2 rounded">
              {selectedPet ? "Actualizar" : "Registrar"}
            </button>
            {selectedPet && (
              <button type="button" className="text-gray-600 underline" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
