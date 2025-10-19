// PATH: client\src\App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthContext } from './context/AuthContext'; // [추가]
import Homepage from './pages/Homepage';

function App() {
  const { authUser } = useAuthContext(); // [추가]

  return (
    <Routes>
      <Route
        path="/"
        // authUser가 있으면 Task 페이지를, 없으면 /login으로 리디렉션
        element={authUser ? <Homepage /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        // authUser가 있으면 메인 페이지로, 없으면 Login 페이지를 보여줌
        element={authUser ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        // authUser가 있으면 메인 페이지로, 없으면 Signup 페이지를 보여줌
        element={authUser ? <Navigate to="/" /> : <Signup />}
      />
    </Routes>
  );
}

export default App;