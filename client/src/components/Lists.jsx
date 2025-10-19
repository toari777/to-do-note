//PATH: client\src\components\Lists.jsx

import { RotateCw } from 'lucide-react';
import { useTask } from '../context/TaskContext'
import axios from 'axios'

function Lists() {
  const { tasks, setTasks } = useTask();

  const handleComplete = async (taskId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.map(t => t._id === taskId ? response.data : t));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  }

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  }

  const handleundo = async (taskId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/undo/${taskId}`);
      setTasks(tasks.map(t => t._id === taskId ? response.data : t));
    } catch (err) {
      console.error('Error undoing task:', err);
    }
  }

  return (
    <div className='w-1/2 px-20 py-20'>
      {tasks.map((task) => (
        <div
          key={task._id}
          className='bg-white p-6 mb-4 rounded-lg border-gray-300 border relative'
          style={task.completed ? { opacity: 0.3 } : {}}
        >
          <div className='mb-8'>
            <h2 className='text-xl font-bold mb-4'>{task.name}</h2>
            <p className='text-gray-500'>{task.description}</p>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => handleComplete(task._id)}
              className='text-white px-4 py-2 bg-green-600/80 rounded-xl text-sm cursor-pointer'
              style={task.completed ? { pointerEvents: 'none' } : {}}
            >
              Complete
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className='text-white px-4 py-2 bg-red-600/80 rounded-xl text-sm cursor-pointer'
              style={task.completed ? { pointerEvents: 'none' } : {}}
            >
              Delete
            </button>
          </div>
          {task.completed && <RotateCw className='absolute top-2 right-3 cursor-pointer' onClick={() => handleundo(task._id)} />}
        </div>
      ))}
    </div>
  )
}

export default Lists
