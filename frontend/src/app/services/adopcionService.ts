const API = process.env.NEXT_PUBLIC_API_URL;

export const crearSolicitudAdopcion = async (token: string, data: any) => {
  const res = await fetch(`${API}/solicitudes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al crear solicitud de adopción");
  }

  return res.json();
};

export const obtenerSolicitudesAdopcion = async (token: string) => {
  const res = await fetch(`${API}/solicitudes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener solicitudes de adopción");
  return res.json();
};

export const obtenerMisSolicitudesAdopcion = async (token: string) => {
  // Usar el nuevo endpoint específico para obtener solo las solicitudes del usuario autenticado
  const res = await fetch(`${API}/solicitudes/mis-solicitudes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener mis solicitudes de adopción");
  return res.json();
};

export const eliminarSolicitudAdopcion = async (token: string, id: string) => {
  const res = await fetch(`${API}/solicitudes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al eliminar solicitud de adopción");
  }

  return res.json();
};
