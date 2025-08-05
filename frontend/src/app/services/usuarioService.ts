// src/services/usuarioService.ts
export const getUsuarioPorId = async (id: string, token: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener datos del usuario");
  return res.json();
};

export const actualizarUsuario = async (id: string, token: string, data: any) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar el perfil");
  return res.json();
};
