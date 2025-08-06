const API = process.env.NEXT_PUBLIC_API_URL;

export const crearVisita = async (token: string, data: any) => {
  const res = await fetch(`${API}/visitas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al agendar visita");
  }

  return res.json();
};

export const obtenerHorasOcupadas = async (
  token: string,
  idMascota: string,
  fecha: string
) => {
  const res = await fetch(`${API}/visitas/ocupadas/${idMascota}/${fecha}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener horas ocupadas");
  return res.json(); // ['08:00', '09:00', '10:00']
};

export const obtenerTodasLasVisitas = async (token: string) => {
  const res = await fetch(`${API}/visitas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener visitas");
  return res.json();
};

export const actualizarVisita = async (token: string, visitaId: string, data: any) => {
  const res = await fetch(`${API}/visitas/${visitaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al actualizar visita");
  }

  return res.json();
};

export const eliminarVisita = async (token: string, visitaId: string) => {
  const res = await fetch(`${API}/visitas/${visitaId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error al eliminar visita");
  }

  return res.json();
};
