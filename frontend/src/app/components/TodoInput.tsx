'use client'

import {useState} from 'react';

export default function TodoInput({}) {
    const [count, setCount] = useState(0);
    const [tasks, setTasks] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    //const tasks = ['Item 1', 'Item 2', 'Item 3']

    const handClick =() => {
        setTasks([...tasks, inputValue]);  //agrega a el arreglo en valor del input
        setInputValue('');                  // limpia el input

    };

    const handleDelete = (index: number) => {
        const newTasks = tasks.filter((_, i) => i !== index); //filtra las tareas para eliminar la tarea seleccionada
        setTasks(newTasks); //actualiza el estado de las tareas
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

            <p>tareas guardadas:</p>
            <ul>
            {tasks.map((task,index) => (
            <li>
                {task}
                <button onClick={() => handleDelete(index)} >Eliminar</button>    
            </li>
            ))}
 
        </ul>
        </div>  
    )
}

