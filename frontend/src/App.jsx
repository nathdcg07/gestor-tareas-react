import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Cargar tareas desde el backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
    }
  };

  // Agregar una nueva tarea
  const addTask = async () => {
    if (!newTask) return;

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', { name: newTask });
      setTasks([...tasks, response.data]);
      setNewTask(''); // Limpiar el campo de entrada
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  };

  // Cargar tareas cuando el componente se monta
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Lista de tareas</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Escribe una nueva tarea"
      />
      <button onClick={addTask}>Agregar tarea</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
