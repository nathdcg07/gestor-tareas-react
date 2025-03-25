import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Obtener tareas de la API
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Agregar tarea
  const addTask = async () => {
    if (taskName.trim() === "") return;

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/tasks", { name: taskName });
      setTaskName(""); // Limpiar input
      fetchTasks(); // Recargar tareas después de agregar
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    try {
      console.log("Intentando eliminar tarea con ID:", id);
      await axios.delete(`http://127.0.0.1:5000/api/tasks/${id}`);
      fetchTasks(); // Recargar tareas después de eliminar
      console.log("Tarea eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  // Editar tarea
  const updateTask = async (id, newName) => {
    try {
      console.log("Actualizando tarea con ID:", id);
      
      await axios.put(`http://127.0.0.1:5000/api/tasks/${id}`, 
        { name: newName }, 
        { headers: { "Content-Type": "application/json" } }
      );
  
      fetchTasks(); // Recarga la lista después de editar
      console.log("Tarea editada correctamente");
    } catch (error) {
      console.error("Error al editar la tarea:", error);
    }
  };
  

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center py-10'>
      <h1 className='text-3xl font-bold mb-6'>Gestor de tareas</h1>
      <div className='bg-white p-6 rounded-lg shadow-md w-96'>
        <input
          type='text'
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className='w-full p-2 border rounded-md mb-2'
          placeholder='Nueva tarea...'
        />
        <button onClick={addTask} className='w-full bg-blue-500 text-white py-2 hover:bg-blue-600'>Agregar tarea</button>
      </div>
      
      {/* Lista de tareas */}
      <ul className='mt-6 w-96'>
        {tasks.map(task => (
          <li key={task.id} className='flex justify-between items-center bg-white p-4 rounded-md shadow-sm mb-2'>
            <span>{task.name}</span>
            <button onClick={() => deleteTask(task.id)} className='text-red-500 hover:text-red-700'>Eliminar</button>
            <button onClick={() => updateTask(task.id, prompt("Nuevo nombre:", task.name))} className='text-blue-500 hover:text-blue-700'>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;