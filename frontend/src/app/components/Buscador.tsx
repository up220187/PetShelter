import React from "react";

interface BuscadorProps {
  className?: string;
  placeholder?: string;
}

const Buscador: React.FC<BuscadorProps> = ({
  className = "",
  placeholder = "Buscar...",
}) => {
  return (
    <div className={`relative w-full max-w-4xl ${className}`}>
      {/* Cápsula de fondo crema más grande */}
      <div className="bg-[#FFF7D0] rounded-full h-14 px-4 flex items-center shadow-md">
        {/* Input */}
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 h-10 pl-4 pr-4 bg-white border-none rounded-full text-sm text-black placeholder-gray-400 outline-none shadow-sm"
        />
      </div>
    </div>
  );
};

export default Buscador;