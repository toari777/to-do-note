//PATH: client\src\context\TaskContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        console.log(dateString)
        const response = await axios.get(`http://localhost:5000/api/tasks?date=${dateString}`);
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, [selectedDate]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, selectedDate, setSelectedDate }}>
      {children}
    </TaskContext.Provider>
  );
};