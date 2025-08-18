
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SignIn } from './Pages/signin';
import { SignUp } from './Pages/signup';
import { Dashboard } from './Pages/dashboard';

function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const syncAuth = () => setIsAuthed(!!localStorage.getItem('token'));
    // Listen for our custom auth change events and cross-tab storage updates
    window.addEventListener('auth-changed', syncAuth);
    window.addEventListener('storage', syncAuth);
    return () => {
      window.removeEventListener('auth-changed', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/signin"
          element={isAuthed ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthed ? <Navigate to="/" replace /> : <SignUp />}
        />
        <Route
          path="/"
          element={isAuthed ? <Dashboard /> : <Navigate to="/signin" replace />}
        />
      </Routes>
    </BrowserRouter>
   
   
 
  )
}

export default App
