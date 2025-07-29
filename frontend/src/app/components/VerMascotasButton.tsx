import React from "react";

interface VerMascotasButtonProps {
  className?: string;
  divClassName?: string;
  onClick?: () => void;
}

export default function VerMascotasButton({ className, divClassName, onClick }: VerMascotasButtonProps) {
  return (
    <button 
      className={`relative w-[200px] h-[60px] bg-transparent ${className}`} 
      style={{ 
        boxShadow: '5px 5px 4px #00000040',
        border: 'none',
        outline: 'none'
      }}
      onClick={onClick}
    >
      <div className="relative h-[61px] -top-[1px]">
        <div 
          className="absolute left-0 top-[1px] w-[200px] h-[60px] bg-[#E5D585] rounded-[25px] opacity-80"
        />
        <div 
          className={`absolute left-0 top-0 w-[200px] h-[60px] text-[#261C14] text-[24px] font-normal text-center flex items-center justify-center ${divClassName}`}
          style={{ 
            fontFamily: 'Lato, sans-serif',
            letterSpacing: '0',
            lineHeight: 'normal'
          }}
        >
          Ver mascotas
        </div>
      </div>
    </button>
  );
}