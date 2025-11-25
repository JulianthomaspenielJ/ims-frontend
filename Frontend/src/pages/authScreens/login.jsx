import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';


const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    let tempErrors = { email: '', password: '' };

    if (!form.email) {
      tempErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      tempErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!form.password) {
      tempErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(tempErrors);
    if (!valid) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      // Debug log to check the response data
      console.log('Login response data:', data);
      
      // Handle temporary password case (status 202)
      if (response.status === 202 && data.isTemporaryPassword) {
        // Store temporary user data for the change password screen
        localStorage.setItem('tempUserEmail', data.user?.email || form.email);
        localStorage.setItem('tempPassword', form.password);
        localStorage.setItem('tempUserId', data.user?.id || '');
        localStorage.setItem('tempUserRole', data.user?.user_role || '');
        
        // Navigate to change password screen
        navigate('/change-password');
        return;
      }
      
      // Handle regular login error
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed. Please check your credentials.');
      }
      
      // Store the authentication tokens and user data
      // Check for both access_token and accessToken to handle different response formats
      const accessToken = data.access_token || data.accessToken;
      if (!accessToken) {
        throw new Error('No access token received in response');
      }
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', data.refresh_token || '');
      localStorage.setItem('user', JSON.stringify(data.user || {}));

      // Redirect based on user role
      const userRole = data.user.user_role.toLowerCase();
      switch(userRole) {
        case 'admin_ims':
          navigate('/admin');
          break;
        case 'company_admin':
          navigate('/product');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        email: 'Invalid credentials',
        password: 'Invalid credentials'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      setForgotPasswordMessage('Please enter your email address first');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setForgotPasswordMessage('Please enter a valid email address');
      return;
    }

    setIsForgotPasswordLoading(true);
    setForgotPasswordMessage('');

    try {
      const response = await fetch('http://localhost:8000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordMessage('If your email is registered, you will receive a verification code');
        // Navigate to reset password page after a short delay
        setTimeout(() => {
          navigate('/reset-password', { state: { email: form.email } });
        }, 2000);
      } else {
        // Still show success message for security reasons, but log the error
        console.error('Forgot password error:', data);
        setForgotPasswordMessage('If your email is registered, you will receive a verification code');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setForgotPasswordMessage('An error occurred. Please try again.');
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">


      <form className="z-10 w-full max-w-md bg-white shadow-2xl rounded-2xl p-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-[#181ed4] mb-6">Login</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-left ml-1">Email</label>
          <div className="border border-gray-300 rounded-lg px-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full py-2 outline-none"
            />
          </div>
          {errors.email && <span className="text-red-500 text-sm ml-1">{errors.email}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-left ml-1">Password</label>
          <div className="border border-gray-300 rounded-lg px-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              autoComplete="current-password"
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full py-2 outline-none pr-3" // Adjusted padding-right for consistency
            />
          </div>
          {errors.password && <span className="text-red-500 text-sm ml-1">{errors.password}</span>}
        </div>

        <div className="flex justify-between items-center text-sm mb-6">
          <label className="flex items-center text-gray-600">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <button 
            type="button" 
            onClick={handleForgotPassword}
            disabled={isForgotPasswordLoading}
            className="text-[#181ed4] hover:underline bg-transparent border-none p-0 cursor-pointer"
          >
            {isForgotPasswordLoading ? 'Sending...' : 'Forgot password?'}
          </button>
        </div>
        {forgotPasswordMessage && (
          <div className={`text-sm mb-4 p-2 rounded ${forgotPasswordMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {forgotPasswordMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#181ed4] text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center ${isLoading ? 'opacity-75' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : 'Login'}
        </button>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Don't have an account?</span>{' '}
          <Link to="/" className="text-[#181ed4] font-medium hover:underline">
            Create one
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;