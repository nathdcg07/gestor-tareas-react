import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./index.css";

const motivationalQuotes = [
  "¡Tú puedes con todo! 💪",
  "Cada tarea completada es un paso más cerca 🏁",
  "Eres increíble, no lo olvides ✨",
  "Hazlo con amor y café ☕",
  "La constancia es tu superpoder 💫"
];

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [background, setBackground] = useState(() => {
    return localStorage.getItem("background") || "light";
  });

  useEffect(() => {
    fetchTasks();
    localStorage.setItem("background", background);
  }, [background]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/tasks");
      const active = response.data.filter((task) => !task.completed);
      const completed = response.data.filter((task) => task.completed);
      setTasks(active);
      setCompletedTasks(completed);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (taskName.trim() === "") return;

    try {
      await axios.post("http://127.0.0.1:5000/api/tasks", { name: taskName });
      setTaskName("");
      fetchTasks();
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const updateTask = async (id, newName) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/tasks/${id}`, { name: newName });
      fetchTasks();
    } catch (error) {
      console.error("Error al editar la tarea:", error);
    }
  };

  const completeTask = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/tasks/${id}`, { completed: true });
      fetchTasks();
    } catch (error) {
      console.error("Error al completar la tarea:", error);
    }
  };

  const toggleTheme = () => {
    setBackground((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={`min-h-screen p-6 transition-all duration-500 ${background === "light" ? "bg-gradient-to-tr from-pink-100 via-blue-100 to-purple-100 text-gray-800" : "bg-gray-900 text-gray-100"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Task Manager</h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-xl bg-indigo-400 hover:bg-indigo-500 text-white shadow-md"
        >
          {background === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro"}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Escribe tu tarea mágica... ✨"
          className="flex-grow px-6 py-3 border border-gray-600 bg-gray-900 rounded-xl text-white text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Agregar ✨
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-xl mb-6 animate-pulse">No hay tareas... ¡agrega una y brilla! 🌟</p>
      ) : (
        <div className="space-y-4 mb-10">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              className="flex justify-between items-center bg-white text-gray-800 p-4 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>{task.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => completeTask(task.id)}
                  className="text-sm bg-purple-400 hover:bg-purple-500 px-3 py-1 rounded-xl text-white"
                >
                  ✅ Hecho
                </button>
                <button
                  onClick={() => updateTask(task.id, prompt("Nuevo nombre:", task.name))}
                  className="text-sm bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded-xl text-white"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm bg-red-400 hover:bg-red-500 px-3 py-1 rounded-xl text-white"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">✨ Tareas Completadas</h2>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
                className="line-through opacity-50 bg-white text-gray-500 p-3 rounded-xl shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {task.name}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
