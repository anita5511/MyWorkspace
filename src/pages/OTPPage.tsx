//workspace/src/pages/OTPPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { SignupFormData } from '../types';

const API_URL = import.meta.env.VITE_API_URL as string;

 const otpSchema = z.object({
   otp: z.string().length(6, 'Please enter the 6-digit code'),
 });

const OTPPage = () => {
  // grab name/email/password from SignUpPage
  const location = useLocation();
  const { name, email, password } = (location.state || {}) as {
    name: string;
    email: string;
    password: string;
  };
  const [showPassword, setShowPassword] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, error } = useAuth();
  const navigate = useNavigate();

  type OTPForm = z.infer<typeof otpSchema>;
  const { register, handleSubmit, formState: { errors, isSubmitting } }
    = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const onSubmit = async (data: OTPForm) => {
    setOtpError(null);
    try {
      const resp = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        email,
        otp: data.otp
      });
      if (resp.data.valid) {
        navigate('/face-verification', {
          state: { name, email, password }
        });
      } else {
        setOtpError('Invalid or expired OTP');
      }
    } catch (err: any) {
      console.error('OTP failed', err);
      setOtpError(err.response?.data?.message || 'Invalid or expired OTP');
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:px-10">
          <div className="mb-6">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Enter Verification Code
            </motion.h2>
            <motion.p 
              className="mt-2 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We’ve sent a 6-digit code to your email
            </motion.p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <div className="relative">
                   <input
                     id="otp"
                     type="text"
                     maxLength={6}
                     {...register('otp')}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="••••••••"
                  />
                {otpError && (
                  <p className="mt-1 text-sm text-red-600">{otpError}</p>
                )}
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>


              <div>
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </motion.div>

          <motion.div 
            className="mt-8 border-t border-gray-200 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col space-y-4">
              <h3 className="text-sm font-medium text-gray-700 text-center">By signing up, you agree to our:</h3>
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
                <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
