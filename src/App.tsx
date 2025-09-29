
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SignIn } from './Pages/signin';
import { SignUp } from './Pages/signup';
import { Dashboard } from './Pages/dashboard';

function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial auth check
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthed(!!token);
      setIsLoading(false);
    };
    
    // Check auth immediately
    checkAuth();
    
    const syncAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthed(!!token);
    };
    
    // Listen for our custom auth change events and cross-tab storage updates
    window.addEventListener('auth-changed', syncAuth);
    window.addEventListener('storage', syncAuth);
    
    return () => {
      window.removeEventListener('auth-changed', syncAuth);
      window.removeEventListener('storage', syncAuth);
    };
  }, []);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  
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
        {/* Catch-all route - redirect unknown paths to appropriate page */}
        <Route
          path="*"
          element={isAuthed ? <Navigate to="/" replace /> : <Navigate to="/signin" replace />}
        />
      </Routes>
    </BrowserRouter>
   
   
 
  )
}

export default App
