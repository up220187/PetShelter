const API = process.env.NEXT_PUBLIC_API_URL;

export const getMascotaPorId = async (id: string, token: string) => {
  const res = await fetch(`${API}/mascotas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener datos de la mascota");
  return res.json();
};
