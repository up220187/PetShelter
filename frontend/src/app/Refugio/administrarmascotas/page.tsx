"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { useAuth } from "../../context/AuthContext";

const enumOptions = {
  masSexo: ["Macho", "Hembra"],
  masTamaño: ["Pequeño", "Mediano", "Grande"],
  masComportamiento: ["Agresivo", "Asustadizo", "Juguetón", "Tranquilo"],
  masEstado: ["Disponible", "En Proceso", "Adoptado"],
  masTipo: ["Perro", "Gato", "Ave", "Reptil", "Roedor", "Otro"],
};

const AgregarMascota = () => {
  const { user, token } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    masNombre: "",
    masRaza: "",
    masNacimiento: "",
    masSexo: "",
    masTamaño: "",
    masEstadoSalud: "",
    masComportamiento: "",
    masEsterilizado: false,
    masEstado: "Disponible",
    masTipo: "",
    masImagen: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const mascotaData = {
        ...formData,
        masImagen: imageUrl,
        masIdRefugio: user?.usuId,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(mascotaData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al guardar la mascota");
      }

      alert("Mascota registrada con éxito");
      router.push("/Refugio");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Registrar Nueva Mascota</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="masNombre" type="text" placeholder="Nombre" className="input input-bordered w-full" onChange={handleChange} required />
        <input name="masRaza" type="text" placeholder="Raza" className="input input-bordered w-full" onChange={handleChange} />
        <input name="masNacimiento" type="date" className="input input-bordered w-full" onChange={handleChange} required />
        <select name="masSexo" className="select select-bordered w-full" onChange={handleChange} required>
          <option value="">Sexo</option>
          {enumOptions.masSexo.map((op) => <option key={op}>{op}</option>)}
        </select>
        <select name="masTamaño" className="select select-bordered w-full" onChange={handleChange} required>
          <option value="">Tamaño</option>
          {enumOptions.masTamaño.map((op) => <option key={op}>{op}</option>)}
        </select>
        <input name="masEstadoSalud" type="text" placeholder="Estado de salud" className="input input-bordered w-full" onChange={handleChange} />
        <select name="masComportamiento" className="select select-bordered w-full" onChange={handleChange} required>
          <option value="">Comportamiento</option>
          {enumOptions.masComportamiento.map((op) => <option key={op}>{op}</option>)}
        </select>
        <select name="masTipo" className="select select-bordered w-full" onChange={handleChange} required>
          <option value="">Tipo de mascota</option>
          {enumOptions.masTipo.map((op) => <option key={op}>{op}</option>)}
        </select>
        <label className="label cursor-pointer">
          <span className="label-text">¿Está esterilizado?</span>
          <input type="checkbox" name="masEsterilizado" className="checkbox" onChange={handleChange} />
        </label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full" />
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Guardando..." : "Registrar Mascota"}
        </button>
      </form>
    </div>
  );
};

export default AgregarMascota;
