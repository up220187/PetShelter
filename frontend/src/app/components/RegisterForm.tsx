"use client";
import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
  };

  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl w-80 min-h-96 z-10">
      <h2 className="text-3xl font-bold mb-3 text-center text-black">
        Crear cuenta
      </h2>
      <p className="text-gray-400 text-center mb-8 text-sm">
        Completa la información
      </p>
      <form onSubmit={handleSubmit} className="space-y-16">
        <div className="text-center">
          <label className="block font-bold text-black mb-2 text-sm text-left">Nombre:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-56 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-0 focus:border-black text-black bg-white mx-auto"
            required
          />
        </div>
        <div className="text-center">
          <label className="block font-bold text-black mb-2 text-sm text-left">Correo:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-56 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-0 focus:border-black text-black bg-white mx-auto"
            required
          />
        </div>
        <div className="text-center">
          <label className="block font-bold text-black mb-2 text-sm text-left">Contraseña:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-56 px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-0 focus:border-black text-black bg-white mx-auto"
            required
          />
        </div>
        <div className="pt-20 text-center">
          <button
            type="submit"
            className="w-32 py-2 bg-[#FF8442] hover:bg-[#e0702f] text-white rounded-full font-bold transition duration-200"
          >
            Registrar
          </button>
        </div>
      </form>
      <p className="mt-12 text-center text-xs text-black">
        <span className="font-normal">ya tienes cuenta? </span>
        <a href="/login" className="font-bold underline hover:text-[#FF8442] transition duration-200">
          inicia sesión
        </a>
      </p>
    </div>
  );
}