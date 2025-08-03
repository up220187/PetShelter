"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AddPetPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para leer parámetros de la URL
  const petId = searchParams.get('petId'); // Obtener el ID de la mascota de la URL

  // Simulación de datos de mascotas (deberías obtenerlos de tu backend)
  const allPets = [
    { id: '1', name: "Pelusa", gender: "Macho", age: "7 meses", breed: "Siamés", description: "Pelusa es un gato muy bonito al que le gusta socializar con las personas.", health: "Vacunado", imageUrl: "/images/cat_placeholder.jpg" },
    { id: '2', name: "Trueno", gender: "Hembra", age: "2 años", breed: "Labrador", description: "Trueno es muy enérgica y le encanta jugar a la pelota.", health: "Esterilizada, Vacunada", imageUrl: "/images/dog_placeholder.jpg" },
    { id: '3', name: "Luna", gender: "Hembra", age: "1 año", breed: "Mestiza", description: "Luna es muy cariñosa y se lleva bien con niños.", health: "Vacunada", imageUrl: "/images/cat_placeholder_2.jpg" },
    // Añade más mascotas si es necesario para pruebas
  ];

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    breed: '',
    description: '',
    health: '',
    imageUrl: ''
  });

  // useEffect para cargar datos si estamos en modo edición
  useEffect(() => {
    if (petId) {
      const petToEdit = allPets.find(pet => pet.id === petId);
      if (petToEdit) {
        setFormData({
          name: petToEdit.name,
          gender: petToEdit.gender,
          age: petToEdit.age,
          breed: petToEdit.breed,
          description: petToEdit.description,
          health: petToEdit.health,
          imageUrl: petToEdit.imageUrl
        });
      } else {
        // Opcional: manejar caso donde no se encuentra la mascota
        alert("Mascota no encontrada para editar.");
        router.push('/Refugio/administrarmascotas');
      }
    }
  }, [petId, router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (petId) {
      console.log("Mascota a actualizar (ID:", petId, "):", formData);
      alert(`Mascota "${formData.name}" actualizada exitosamente (simulado).`);
    } else {

      console.log("Nueva mascota a agregar:", formData);
      alert(`Mascota "${formData.name}" agregada exitosamente (simulado).`);
    }
    router.push('/Refugio/administrarmascotas'); 
  };

  const handleCancel = () => {
    router.push('/Refugio/administrarmascotas');
  };

  return (
    <div className="add-pet-page-container">
      <h1 className="add-pet-title">
        {petId ? 'Editar Mascota' : 'Añadir Nueva Mascota'}
      </h1>

      <div className="add-pet-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid-add-pet">
            {/* Campos del formulario */}
            <div className="form-group-add-pet full-width">
              <label htmlFor="name" className="form-label-add-pet">Nombre:</label>
              <input
                type="text"
                id="name"
                className="form-input-add-pet"
                placeholder="Nombre de la mascota"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-add-pet">
              <label htmlFor="gender" className="form-label-add-pet">Género:</label>
              <select
                id="gender"
                className="form-input-add-pet"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div className="form-group-add-pet">
              <label htmlFor="age" className="form-label-add-pet">Edad:</label>
              <input
                type="text"
                id="age"
                className="form-input-add-pet"
                placeholder="Ej: 7 meses, 2 años"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-add-pet full-width">
              <label htmlFor="breed" className="form-label-add-pet">Raza (opcional):</label>
              <input
                type="text"
                id="breed"
                className="form-input-add-pet"
                placeholder="Ej: Siamés, Labrador, Mestizo"
                value={formData.breed}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-add-pet full-width">
              <label htmlFor="description" className="form-label-add-pet">Descripción:</label>
              <textarea
                id="description"
                className="form-textarea-add-pet"
                rows={4}
                placeholder="Describe la personalidad y características de la mascota."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group-add-pet full-width">
              <label htmlFor="health" className="form-label-add-pet">Salud:</label>
              <input
                type="text"
                id="health"
                className="form-input-add-pet"
                placeholder="Ej: Vacunado, Esterilizado, Necesita tratamiento"
                value={formData.health}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-add-pet full-width">
              <label htmlFor="imageUrl" className="form-label-add-pet">URL de la Imagen (temporal):</label>
              <input
                type="text"
                id="imageUrl"
                className="form-input-add-pet"
                placeholder="http://ejemplo.com/imagen.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="Previsualización" className="image-preview" />
              )}
            </div>
          </div>

          <div className="form-actions-add-pet">
            <button type="button" className="cancel-add-pet-button" onClick={handleCancel}>
              Cancelar
            </button>
            <button type="submit" className="submit-add-pet-button">
              {petId ? 'Guardar Cambios' : 'Guardar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}