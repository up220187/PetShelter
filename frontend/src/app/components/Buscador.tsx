import React from "react";

import SearchIcon from "./icon/SearchIcon";
import FilterFunnelIcon from "./icon/FilterFunnelIcon";

interface BuscadorProps {
  className?: string;
  placeholder?: string;
}

const Buscador: React.FC<BuscadorProps> = ({
  className = "",
  placeholder = "Buscar...",
}) => {
  return (
    <div className={`relative w-11/12 max-w-7xl mx-auto ${className}`}>
      {/* Cápsula de fondo crema más grande con borde negro delgado */}
      <div className="bg-[#FFF7D0] rounded-full h-14 px-4 flex items-center shadow-md border border-black">
        {/* Input con borde negro delgado */}
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 h-10 pl-4 pr-4 bg-white border border-black rounded-full text-sm text-black placeholder-gray-400 outline-none shadow-sm"
        />
        <FilterFunnelIcon />
        <SearchIcon />
      </div>
    </div>
  );
};

export default Buscador;