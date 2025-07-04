export default function TodoList({}){

    const tasks = ['Item 1', 'Item 2', 'Item 3']
    return(
        <ul>
            {tasks.map((task,index) => (
            <li>
                {task}
            </li>
            ))}
 
        </ul>
    )
}