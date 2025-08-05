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
