'use client'

import {useState} from 'react';

export default function TodoInput({}) {
    const [count, setCount] = useState(0);
    const [tasks, setTasks] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    //const tasks = ['Item 1', 'Item 2', 'Item 3']

    const handClick =() => {
        setCount(count + 1);
        console.log(':3', inputValue);
    };

    return(
        <div>
            <input
            type ="text"
            placeholder="Escribir una tarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}/>
            <button onClick={handClick}>Agregar</button>
            <label> {count} </label>
            <ul>
            {tasks.map((task,index) => (
            <li>
                {task}
            </li>
            ))}
 
        </ul>
        </div>  
    )
}

