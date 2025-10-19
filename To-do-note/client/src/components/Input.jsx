//PATH: client\src\components\Input.jsx

import { useTask } from '../context/TaskContext'
import axios from 'axios'

function Input() {
  const { tasks, setTasks, selectedDate } = useTask();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        task: {
          name: e.target.name.value,
          description: e.target.description.value,
          date: selectedDate.toISOString().split('T')[0]
        }
      });
      setTasks([...tasks, response.data]);
      e.target.reset();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  }

  return (
    <div className='w-1/2 flex items-center justify-center h-full'>
      <form className='w-3/5 bg-white p-8 rounded-2xl border-gray-300 border' onSubmit={handleSubmit}>
        <div className='mb-8'>
          <label htmlFor="name" className='mb-2 block'>Name</label>
          <input
            name="name"
            id='name'
            type='text'
            className='block w-full border-1 border-gray-300 outline-none rounded-md p-2'>
          </input>
        </div>
        <div className='mb-8'>
          <label htmlFor="description" className='mb-2 block'>Description</label>
          <textarea
            name="description"
            id='description'
            className='block w-full border-1 border-gray-300 outline-none rounded-md p-2'
            rows={3}>
          </textarea>
        </div>
        <button className='block text-black bg-white border-1 border-black-500 rounded-md px-8 py-2 w-max mx-auto cursor-pointer hover:bg-black/5'>
          Add
        </button>
      </form>
    </div>
  )
}

export default Input