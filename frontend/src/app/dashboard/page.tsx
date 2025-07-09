'use client'

import {useState} from 'react';

export default function Page() {
    const [visible, setVisible] = useState(false);

    const toggle = () => {
        setVisible(!visible);
    };


    return (
        <div style={{ padding: '20px' , textAlign: 'center'}}>
            <h1>Mostrar / ocultar </h1>
            <button onClick={toggle}>
                {visible ? 'Ocultar' : 'Mostrar'}
            </button>

            {visible && <p>Este mensaje esta oculto</p> }
        
        </div>



    )
}