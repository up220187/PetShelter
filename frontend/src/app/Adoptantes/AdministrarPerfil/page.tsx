"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUsuarioPorId, actualizarUsuario } from "../../services/usuarioService";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

export default function AdoptanteProfilePage() {
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    usuNombre: "",
    usuCorreo: "",
    usuTelefono: "",
    usuDireccion: "",
    usuFotoPerfil: "",
    extra: ""
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    getUsuarioPorId(user.usuId, token)
      .then((data) => {
        setFormData({
          usuNombre: data.usuNombre || "",
          usuCorreo: data.usuCorreo || "",
          usuTelefono: data.usuTelefono || "",
          usuDireccion: data.usuDireccion || "",
          usuFotoPerfil: data.usuFotoPerfil || "",
          extra: ""
        });
        setImagePreview(data.usuFotoPerfil || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar perfil:", err);
        setLoading(false);
      });
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
      await actualizarUsuario(user.usuId, token, formData);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="profile-management-container">
      <h1 className="profile-title">Administrar Perfil</h1>

      <div className="profile-grid">
        {/* Imagen */}
        <div className="profile-image-section">
          {imagePreview ? (
            <img src={imagePreview} alt="Foto de perfil" className="profile-picture-preview" />
          ) : (
            <div className="profile-picture-empty"></div>
          )}
          <input type="file" id="profile-picture-upload" className="file-upload-input" onChange={handleImageUpload} />
          <label htmlFor="profile-picture-upload" className="file-upload-label">Subir Foto de Perfil</label>
        </div>

        {/* Nombre */}
        <div className="profile-name-section">
          <h2 className="section-title">Nombre Completo</h2>
          <input type="text" name="usuNombre" className="profile-input" value={formData.usuNombre} onChange={handleChange} />
        </div>

        {/* Contacto */}
        <div className="profile-contact-section">
          <h2 className="section-title">Contacto</h2>
          <div className="input-group">
            <label className="input-label">Email:</label>
            <input type="email" name="usuCorreo" className="profile-input" value={formData.usuCorreo} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Teléfono:</label>
            <input type="tel" name="usuTelefono" className="profile-input" value={formData.usuTelefono} onChange={handleChange} />
          </div>
        </div>

        {/* Dirección */}
        <div className="profile-personal-data-section">
          <h2 className="section-title">Datos Personales</h2>
          <div className="input-group">
            <label className="input-label">Dirección:</label>
            <input type="text" name="usuDireccion" className="profile-input" value={formData.usuDireccion} onChange={handleChange} />
          </div>
        </div>

        {/* Información adicional */}
        <div className="profile-additional-info-section">
          <h2 className="section-title">Información Adicional</h2>
          <textarea
            name="extra"
            className="profile-textarea"
            rows={4}
            value={formData.extra}
            onChange={handleChange}
            placeholder="Ej. experiencia con mascotas, espacio disponible, etc."
          ></textarea>
        </div>
      </div>

      {/* Botones */}
      <div className="profile-actions">
        <button className="save-button" onClick={handleSave}>Guardar Cambios</button>
        <button className="cancel-button" onClick={() => window.location.reload()}>Cancelar</button>
      </div>
    </div>
  );
}
