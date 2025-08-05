import React from "react";

interface AdministrarSeguimientoButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function AdministrarSeguimientoButton({ className = "", onClick }: AdministrarSeguimientoButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 w-[200px] h-[60px]
        bg-[#E5D585] text-[#261C14]
        rounded-2xl text-[16px] font-normal
        shadow-[5px_5px_4px_rgba(0,0,0,0.25)]
        flex items-center justify-center
        hover:brightness-105 active:brightness-95
        transition duration-150 ease-in-out
        ${className}
      `}
      style={{ fontFamily: 'Lato, sans-serif' }}
    >
      Administrar seguimiento
    </button>
  );
}
