"use client";

import { useState, useEffect } from "react";

export default function TaskManager({ email }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/tasks");
    const data = await res.json();
    setTasks(data);
  };

  // Create or Update task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description };

    if (editingTask) {
      const res = await fetch(`/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        fetchTasks();
        setEditingTask(null);
      }
    } else {
      const res = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        fetchTasks();
      }
    }
    setTitle("");
    setDescription("");
  };

  // Delete task
  const handleDelete = async (id) => {
    const res = await fetch(`/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchTasks();
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome {email}, Task Manager</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {editingTask ? "Update Task" : "Add Task"}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setTitle("");
              setDescription("");
            }}
            className="bg-gray-500 text-white p-2 ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      <ul>
  {(Array.isArray(tasks) ? tasks : []).map((task) => (
    <li key={task._id} className="border p-2 mb-2 flex justify-between">
      <div>
        <h3 className="font-bold">{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <div>
        <button
          onClick={() => handleEdit(task)}
          className="bg-yellow-500 text-white p-1 mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(task._id)}
          className="bg-red-500 text-white p-1"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}
