//PATH: client\src\pages\Login.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuthUser } = useAuthContext()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });
      localStorage.setItem("chat-user", JSON.stringify(res.data.user));
      setAuthUser(res.data.user);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.error || '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='flex items-center justify-center w-full h-screen bg-amber-50'>
      <form className='w-full max-w-sm bg-white p-8 rounded-2xl border-gray-300 border' onSubmit={handleSubmit}>
        <h1 className='text-3xl font-bold mb-8 text-center'>Login</h1>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

        <div className='mb-6'>
          <label htmlFor="email" className='mb-2 block font-medium'>Email</label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='block w-full border-gray-300 outline-none rounded-md p-2 border'
            placeholder='you@example.com'
          />
        </div>
        <div className='mb-8'>
          <label htmlFor="password" className='mb-2 block font-medium'>Password</label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='block w-full border-gray-300 outline-none rounded-md p-2 border'
            placeholder='••••••••'
          />
        </div>
        <button
          type="submit"
          className='block text-white bg-black rounded-md px-8 py-2 w-full mx-auto cursor-pointer hover:bg-black/80 transition-colors'
        >
          Login
        </button>
        {/* [추가] 회원가입 페이지로 이동하는 링크 */}
        <p className='text-center text-sm text-gray-600 mt-4'>
          Don't have an account?{' '}
          <Link to="/signup" className='font-medium text-blue-600 hover:underline'>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;