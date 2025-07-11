'use client'

import { useRef } from 'react';

export default function Page() {
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleFocus = () => {
        inputRef.current?.focus(); //acceder al input DOM y enfoca
    };

    return(
        <main>
            <h1>useRef en Next</h1>
            <input ref={inputRef} type="text" placeholder='Escribe algo...'/>
            <br />
            <button onClick={handleFocus}>Enfocar input</button>
        </main>
    );
}