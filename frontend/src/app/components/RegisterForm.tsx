"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!nombre || !correo || !contraseña) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuNombre: nombre,
          usuCorreo: correo,
          usuContraseña: contraseña,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    }
  };

  return (
    <div className="form-content-wrapper">
      <h2 className="form-title">Crear cuenta</h2>
      <p className="form-subtitle">Completa la información</p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '384px' }}>
        <div className="form-field">
          <label htmlFor="name" className="form-label">Nombre:</label>
          <input
            type="text"
            id="name"
            className="form-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">Correo:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        <div className="register-button-wrapper">
          <button type="submit" className="register-button">Registrar</button>
        </div>
      </form>

      {success && (
        <p className="text-green-600 mt-4 font-medium">
          Registro exitoso, redirigiendo...
        </p>
      )}

      {error && (
        <p className="text-red-600 mt-4 font-medium">
          {error}
        </p>
      )}

      <div className="login-link-wrapper">
        <p className="login-link-text">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ textDecoration: 'none' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
