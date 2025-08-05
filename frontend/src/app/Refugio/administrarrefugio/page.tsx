"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUsuarioPorId, actualizarUsuario } from "../../services/usuarioService";
import { getRefugioPorIdUsuario, actualizarRefugio } from "../../services/refugioService";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function AdminRefugioPage() {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    // Usuario
    usuCorreo: "",
    usuTelefono: "",
    usuFotoPerfil: "",
    // Refugio
    refNombre: "",
    refDescripcion: "",
    refDireccion: "",
    refHorarioAtencion: "",
    refId: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    const cargarDatos = async () => {
      try {
        const datosUsuario = await getUsuarioPorId(user.usuId, token);
        const datosRefugio = await getRefugioPorIdUsuario(user.usuId, token);

        setFormData({
          usuCorreo: datosUsuario.usuCorreo || "",
          usuTelefono: datosUsuario.usuTelefono || "",
          usuFotoPerfil: datosUsuario.usuFotoPerfil || "",
          refNombre: datosRefugio.refNombre || "",
          refDescripcion: datosRefugio.refDescripcion || "",
          refDireccion: datosRefugio.refDireccion || "",
          refHorarioAtencion: datosRefugio.refHorarioAtencion || "",
          refId: datosRefugio._id || "",
        });

        setImagePreview(datosUsuario.usuFotoPerfil || null);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, usuFotoPerfil: url }));
      setImagePreview(url);
    } catch {
      alert("Error al subir la imagen a Cloudinary");
    }
  };

  const handleSave = async () => {
    if (!user || !token) return;

    try {
      // 1. Actualizar usuario
      await actualizarUsuario(user.usuId, token, {
        usuCorreo: formData.usuCorreo,
        usuTelefono: formData.usuTelefono,
        usuFotoPerfil: formData.usuFotoPerfil,
      });

      // 2. Actualizar refugio
      await actualizarRefugio(user.usuId, token, {
        _id: formData.refId,
        refNombre: formData.refNombre,
        refDescripcion: formData.refDescripcion,
        refDireccion: formData.refDireccion,
        refHorarioAtencion: formData.refHorarioAtencion,
        refIdUsuario: user.usuId,
      });

      alert("Información del refugio actualizada correctamente");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("No se pudo actualizar el perfil");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando datos del refugio...</p>;

  return (
    <div className="create-shelter-container">
      <h1 className="shelter-title">Administrar Refugio</h1>

      <div className="shelter-grid">
        {/* Imagen */}
        <div className="shelter-logo-section">
          {imagePreview ? (
            <img src={imagePreview} alt="Foto del refugio" className="profile-picture-preview" />
          ) : (
            <div className="profile-picture-empty"></div>
          )}
          <input type="file" id="shelter-logo-upload" className="file-upload-input" onChange={handleImageUpload} />
          <label htmlFor="shelter-logo-upload" className="file-upload-label">Subir Foto del Refugio</label>
        </div>

        {/* Nombre del Refugio */}
        <div className="shelter-description-section">
          <h2 className="section-title">Nombre del Refugio</h2>
          <input
            type="text"
            name="refNombre"
            className="profile-input"
            value={formData.refNombre}
            onChange={handleChange}
          />
        </div>

        {/* Descripción */}
        <div className="shelter-description-section">
          <h2 className="section-title">Descripción</h2>
          <textarea
            name="refDescripcion"
            className="profile-textarea"
            rows={4}
            value={formData.refDescripcion}
            onChange={handleChange}
          />
        </div>

        {/* Dirección */}
        <div className="shelter-address-section">
          <h2 className="section-title">Dirección</h2>
          <input
            type="text"
            name="refDireccion"
            className="profile-input"
            value={formData.refDireccion}
            onChange={handleChange}
          />
        </div>

        {/* Horario */}
        <div className="shelter-address-section">
          <h2 className="section-title">Horario de Atención</h2>
          <input
            type="text"
            name="refHorarioAtencion"
            className="profile-input"
            value={formData.refHorarioAtencion}
            onChange={handleChange}
          />
        </div>

        {/* Contacto */}
        <div className="shelter-contact-section">
          <h2 className="section-title">Contacto</h2>
          <div className="input-group">
            <label className="input-label">Email:</label>
            <input
              type="email"
              name="usuCorreo"
              className="profile-input"
              value={formData.usuCorreo}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Teléfono:</label>
            <input
              type="tel"
              name="usuTelefono"
              className="profile-input"
              value={formData.usuTelefono}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="save-button" onClick={handleSave}>Guardar Cambios</button>
        <button className="cancel-button" onClick={() => window.location.reload()}>Cancelar</button>
      </div>
    </div>
  );
}
