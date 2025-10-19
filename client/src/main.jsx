//PATH: client\src\main.jsx

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // [추가]

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider> {/* [추가] 앱 전체를 AuthProvider로 감싸기 */}
      <App />
    </AuthProvider>
  </BrowserRouter>
)