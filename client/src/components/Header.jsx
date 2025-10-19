//PATH: client\src\components\Header.jsx

import axios from 'axios';
import { Notebook, CalendarDays } from "lucide-react"
import { useState, useRef, useEffect } from 'react';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { useAuthContext } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';

function Header() {


  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null); // [추가] 달력 영역을 참조하기 위한 ref

  const { authUser, setAuthUser } = useAuthContext();
  const { selectedDate, setSelectedDate } = useTask();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/logout');
      localStorage.removeItem("chat-user");
      setAuthUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
    }
    setIsCalendarOpen(false); // 날짜 선택 후 달력 닫기
  };

  return (
    <header className='max-w-4xl px-8 py-4 mb-6 bg-white mx-auto text-center rounded-3xl border-gray-300 border flex justify-between items-center'>
      <Notebook />

      {/* [수정] 달력 위치 기준을 잡기 위해 relative 속성 추가 및 ref 연결 */}
      <div className='relative' ref={calendarRef}>
        <div className='flex gap-6 items-baseline'>
          <h1 className='text-3xl'>
            {/* [수정] 상태에 저장된 날짜를 표시하도록 변경 */}
            {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })}
          </h1>
          {/* [수정] 클릭 시 달력 표시 여부 토글 */}
          <CalendarDays
            className='cursor-pointer'
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          />
        </div>

        {/* [추가] isCalendarOpen이 true일 때만 달력을 렌더링 */}
        {isCalendarOpen && (
          <div className="absolute top-full mt-2 right-0 z-10 bg-white border rounded-md shadow-lg">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </div>
        )}
      </div>

      {authUser && (
        <button
          onClick={handleLogout}
          className='text-white bg-gray-700 hover:bg-gray-800 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer'
        >
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;