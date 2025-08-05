export const uploadToCloudinary = async (file: File): Promise<string> => {
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!preset || !cloud) throw new Error("Cloudinary no configurado correctamente");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error Cloudinary:", errorData);
    throw new Error(errorData.error?.message || "Fallo en la subida");
  }

  const data = await res.json();
  return data.secure_url;
};
