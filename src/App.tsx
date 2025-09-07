//src/App.tsx
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import OTPPage from './pages/OTPPage';
import FaceVerificationPage from './pages/FaceVerificationPage';
import FaceLoginVerifyPage from './pages/FaceLoginVerifyPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // Show splash screen for 4 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OTPPage />} />
      <Route path="/face-login-verify" element={<FaceLoginVerifyPage />} />
      <Route path="/face-verification" element={<FaceVerificationPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
