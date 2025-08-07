import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

interface AdministrarPerfilButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function AdministrarPerfilButton({ className = "", onClick }: AdministrarPerfilButtonProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug: Verificar si el usuario tiene foto de perfil
  console.log('Usuario actual:', user);
  console.log('Foto de perfil:', user?.usuFotoPerfil);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (onClick) {
      onClick();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    console.log('Sesión cerrada. Redirigiendo al login.');
    router.push('/login');
  };

  const handleGoToProfile = () => {
    setIsDropdownOpen(false);
    // Verificar el rol del usuario para redirigir a la página correcta
    if (user?.usuRol === 'refugio') {
      router.push('/Refugio/administrarrefugio');
    } else {
      router.push('/Adoptantes/AdministrarPerfil');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleProfileClick}
        className={`
          w-24 h-24 rounded-full
          hover:ring-4 hover:ring-[#E5D585] hover:ring-opacity-50
          active:ring-2 active:ring-[#E5D585]
          transition-all duration-150 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-[#E5D585] focus:ring-opacity-50
          shadow-lg hover:shadow-xl
          ${className}
        `}
      >
        {/* Foto de perfil o ícono por defecto */}
        {user?.usuFotoPerfil ? (
          <img 
            src={user.usuFotoPerfil} 
            alt="Foto de perfil" 
            className="w-full h-full rounded-full object-cover border-2 border-white"
            onError={(e) => {
              // Si la imagen falla al cargar, mostrar el ícono por defecto
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-[#E5D585] rounded-full flex items-center justify-center border-2 border-white">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" stroke="#261C14" stroke-width="2" />
                      <path d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6" stroke="#261C14" stroke-width="2" stroke-linecap="round" />
                    </svg>
                  </div>
                `;
              }
            }}
          />
        ) : (
          // Si no hay foto de perfil, mostrar ícono por defecto
          <div className="w-full h-full bg-[#E5D585] rounded-full flex items-center justify-center border-2 border-white">
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" stroke="#261C14" strokeWidth="2" />
              <path
                d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6"
                stroke="#261C14"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <button
              onClick={handleGoToProfile}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M4 20c0-3.3137 3.134-6 7-6s7 2.6863 7 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Administrar Perfil
            </button>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}