'use client'

import { useState } from "react"

export default function Page() {
    const [color , setColor] = useState("white");

    const changeColor = (newColor: string) => {
        setColor(newColor);

        //Element.div.target
    }

    return (
        <div style={{ height: "100vh", backgroundColor: color, textAlign: "center"}}>
            <h1>Cambiar color </h1>
            <button onClick={() => changeColor("lightblue")}>Azul</button>
            <button onClick={() => changeColor("lightgreen")}>Verde</button>
            <button onClick={() => changeColor("lightpink")}>Rosa</button>
            <button onClick={() => changeColor("white")}>Reset</button>
        </div>
    )
}

// Hooks

//useState    *Manejar el estado local del componente 

//useEffect=()=> { codigo, [color]}   *Manejar eventos secundarios 
                //componentDidMount  (efectos secundarios al montar el componente)
                //componentDidUpdate (actualización de efectos secundarios)
                //componentDidUnmount (limpieza de efectos secundarios)

//useRef      *Crea referencia mutable, para acceder a elementos del DOM

//useContext - redux *Acceder al estado global de react 
                // Padre - hijo - nieto - bisnieto
                // captura datos -> guarda -> facturas -> imprime -> cortes 
                // Props (propiedades o datos que pasamos de un componente a otro) 
                // Prop drilling (cuando se pasan las propiedades de un componente a otro, hasta llegar al componente que las necesita)

                // contexto global 

                //Redux es una librería que nos permite manejar el estado global de la aplicación (preferible usar)