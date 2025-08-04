"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuCorreo: email, usuContraseña: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      login(data.token, data.user);
      setSuccess(true);

      // Redirigir tras un breve delay para que se vea el mensaje
      setTimeout(() => {
        router.push("/Adoptantes");
      }, 1500);
    } catch (err) {
      setError("Usuario o contraseña incorrectos. Vuelve a intentarlo.");
    }
  };

  return (
    <div className="form-content-wrapper">
      <h2 className="form-title">Iniciar sesión</h2>
      <p className="form-subtitle">Ingresa tus credenciales</p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '384px' }}>
        <div className="form-field">
          <label htmlFor="email" className="form-label">Correo:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password" className="form-label">Contraseña:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="register-button-wrapper">
          <button type="submit" className="register-button">Ingresar</button>
        </div>
      </form>

      {success && (
        <p className="text-green-600 mt-4 font-medium">
          Login correcto. Redirigiendo...
        </p>
      )}
      {error && (
        <p className="text-red-600 mt-4 font-medium">
          {error}
        </p>
      )}

      <div className="login-link-wrapper">
        <p className="login-link-text">
          ¿No tienes cuenta?{" "}
          <Link href="/register" style={{ textDecoration: 'none' }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
