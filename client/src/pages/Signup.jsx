//PATH: client\src\pages\Signup.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // [수정] name 필드 유효성 검사 제거
    if (!email || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      // [수정] API 요청 시 name 필드 제거
      await axios.post('http://localhost:5000/api/users/signup', {
        email,
        password,
      });
      // 회원가입 성공 시 로그인 페이지로 이동합니다.
      navigate('/login');
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.error || '회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className='flex items-center justify-center w-full h-screen bg-amber-50'>
      <form className='w-full max-w-sm bg-white p-8 rounded-2xl border-gray-300 border' onSubmit={handleSubmit}>
        <h1 className='text-3xl font-bold mb-8 text-center'>Sign Up</h1>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

        {/* [수정] Name 입력 필드 전체 삭제 */}

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
          Create Account
        </button>
        <p className='text-center text-sm text-gray-600 mt-4'>
          Already have an account?{' '}
          <Link to="/login" className='font-medium text-blue-600 hover:underline'>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;