"use client";

import React, { useState } from "react";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export default function TestPage() {
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
      alert("Imagen subida correctamente ✅");
    } catch (err) {
      console.error(err);
      alert("❌ Error al subir imagen");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Probar Subida a Cloudinary</h1>

      <input type="file" accept="image/*" onChange={handleUpload} />

      {imageUrl && (
        <div className="mt-4">
          <p className="mb-2">Vista previa:</p>
          <img src={imageUrl} alt="Subida" className="w-48 h-48 rounded-full object-cover" />
        </div>
      )}
    </div>
  );
}
