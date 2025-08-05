const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRefugioPorIdUsuario = async (idUsuario: string, token: string) => {
  const res = await fetch(`${API_URL}/refugios/usuario/${idUsuario}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener datos del refugio");
  return await res.json();
};

export const actualizarRefugio = async (idUsuario: string, token: string, data: any) => {
  const res = await fetch(`${API_URL}/refugios/${data._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data, refIdUsuario: idUsuario }),
  });

  if (!res.ok) throw new Error("Error al actualizar datos del refugio");
  return await res.json();
};
