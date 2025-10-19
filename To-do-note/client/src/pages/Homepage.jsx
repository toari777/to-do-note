//PATH: client\src\pages\Homepage.jsx

import { TaskProvider } from '../context/TaskContext';
import Header from '../components/Header';
import Task from '../components/Task';

function Homepage() {
  return (
    <TaskProvider>
      <div className='bg-amber-50 w-full h-screen pt-4 flex flex-col'>
        <div>
          <Header />
        </div>
        <Task />
      </div>
    </TaskProvider>
  )
}

export default Homepage