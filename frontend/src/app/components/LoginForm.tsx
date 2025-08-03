"use client";
import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="form-content-wrapper">
      <h2 className="form-title">Iniciar sesión</h2>
      <p className="form-subtitle">Ingresa tus credenciales</p>

      <form style={{ width: '100%', maxWidth: '384px' }}> 
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
            Ingresar
          </button>
        </div>
      </form>

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