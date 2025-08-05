import React from "react";

interface AdministrarPerfilButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function AdministrarPerfilButton({ className = "", onClick }: AdministrarPerfilButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 w-[170px] h-[60px]
        bg-[#E5D585] text-[#261C14]
        rounded-2xl text-[16px] font-normal
        shadow-[5px_5px_4px_rgba(0,0,0,0.25)]
        flex items-center justify-center gap-2
        hover:brightness-105 active:brightness-95
        transition duration-150 ease-in-out
        ${className}
      `}
      style={{ fontFamily: 'Lato, sans-serif' }}
    >
      {/* SVG icon: user/profile */}
      <svg
        width="24"
        height="24"
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
      Administrar perfil
    </button>
  );
}