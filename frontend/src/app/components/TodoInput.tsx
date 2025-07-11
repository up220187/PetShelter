'use client'

import {useState, useEffect} from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/tasks'

export default function TodoInput({}) {
    const [count, setCount] = useState(0);
    const [tasks, setTasks] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    //const tasks = ['Item 1', 'Item 2', 'Item 3']
    // Promesa
    useEffect(() => {
        axios.get(API_URL)
        .then(res => setTasks(res.data))
        .catch(err => console.log('Error al cargar tareas:', err));
    },[]);

    const handClick = async() => {

        try {
            const res = await axios.post(API_URL, {task: inputValue});
            setTasks(res.data.tasks); //actualiza lista con respuesta del backend
            setInputValue(''); //limpia el input
        } catch (err){
            console.log('Error al agregar tarea:', err);
        }

        //setTasks([...tasks, inputValue]);  //agrega a el arreglo en valor del input
        //setInputValue('');                  // limpia el input

    };

    const handleDelete = async(index: number) => {
        try{
            const res = await axios.delete(`${API_URL}/${index}`);
            setTasks(res.data.tasks); //actualiza lista con respuesta del backend
        }catch (err){  
            console.log('Error al agregar tarea:', err);
        }
        //const newTasks = tasks.filter((_, i) => i !== index); //filtra las tareas para eliminar la tarea seleccionada
        //setTasks(newTasks); //actualiza el estado de las tareas
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

