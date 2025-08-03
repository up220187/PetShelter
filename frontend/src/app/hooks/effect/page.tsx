'use client'

import { useState, useEffect, use } from 'react';

export default function Page() {
    const [data, setData] = useState<string | null>(null);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        document.title = `contador ${count}`;
    }, [count]);

    useEffect(() => {
        setTimeout(() => {
            setData('Hello from API');
        }, 2000);
    }, []);


    return (
        <div> {data ? data : 'Loading...'}
            <p>Has hecho click {count} veces</p>
            <button onClick={() => setCount(count + 1)}>Incrementar</button>
        </div>
    )
}