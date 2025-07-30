"use client";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <div className="form-content-wrapper">
      <h2 className="form-title">Crear cuenta</h2>
      <p className="form-subtitle">Completa la información</p>

      <form style={{ width: '100%', maxWidth: '384px' }}> 
        <div className="form-field">
          <label htmlFor="name" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="email" className="form-label">
            Correo:
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label htmlFor="password" className="form-label">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
          />
        </div>

        <div className="register-button-wrapper">
          <button
            type="submit"
            className="register-button"
          >
            Registrar
          </button>
        </div>
      </form>

      <div className="login-link-wrapper">
        <p className="login-link-text">
          ¿ya tienes cuenta?{" "}
          <Link href="/login" style={{ textDecoration: 'none' }}>
            inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}