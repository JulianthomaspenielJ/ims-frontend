import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';


const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tempPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    tempPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    temp: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user details from localStorage
    const tempUserEmail = localStorage.getItem('tempUserEmail');
    const tempPassword = localStorage.getItem('tempPassword');

    if (!tempUserEmail || !tempPassword) {
      // If no temp data found, redirect to login
      navigate('/login');
      return;
    }

    setUserEmail(tempUserEmail);
    setForm(prev => ({ ...prev, tempPassword }));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const tempErrors = {
      tempPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Validation
    if (!form.tempPassword) {
      tempErrors.tempPassword = 'Temporary password is required';
      valid = false;
    }

    if (!form.newPassword) {
      tempErrors.newPassword = 'New password is required';
      valid = false;
    }

    if (!form.confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    }

    if (form.newPassword !== form.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(tempErrors);
    if (!valid) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          temporary_password: form.tempPassword,
          new_password: form.newPassword,
          confirm_new_password: form.confirmPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to change password');
      }

      // Clear temporary data from localStorage
      localStorage.removeItem('tempUserEmail');
      localStorage.removeItem('tempPassword');
      localStorage.removeItem('tempUserId');
      localStorage.removeItem('tempUserRole');

      // Show success message and redirect to login
      alert('Password changed successfully! Please login with your new password.');
      
      // Clear any remaining temporary data
      localStorage.removeItem('tempUserEmail');
      localStorage.removeItem('tempPassword');
      localStorage.removeItem('tempUserId');
      localStorage.removeItem('tempUserRole');
      
      navigate('/login');
    } catch (error) {
      console.error('Change password error:', error);
      setErrors({
        tempPassword: error.message || 'Failed to change password',
        newPassword: '',
        confirmPassword: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative">
      <div className="absolute bottom-0 w-full h-[60%] bg-[#181ed4] rounded-t-[20%] z-0"></div>

      <form className="z-10 w-full max-w-md bg-white shadow-2xl rounded-2xl p-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-[#181ed4] mb-6">Change Password</h2>
        
        {/* Information Message */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Welcome!</strong> You're using a temporary password. Please set a new password to continue.
          </p>
        </div>
        
        {/* User Email Display */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Changing password for:</p>
          <p className="font-medium text-gray-800">{userEmail}</p>
        </div>

        {/* Temporary Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-left ml-1">Temporary Password</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
            <input
              type={showPasswords.temp ? "text" : "password"}
              value={form.tempPassword}
              readOnly
              className="w-full py-2 outline-none pr-3 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, temp: !showPasswords.temp })}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPasswords.temp ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.tempPassword && <span className="text-red-500 text-sm ml-1">{errors.tempPassword}</span>}
        </div>

        {/* New Password Field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 text-left ml-1">New Password</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={form.newPassword}
              onChange={e => setForm({ ...form, newPassword: e.target.value })}
              className="w-full py-2 outline-none pr-3"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.newPassword && <span className="text-red-500 text-sm ml-1">{errors.newPassword}</span>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1 text-left ml-1">Confirm Password</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full py-2 outline-none pr-3"
            />
            <button
              type="button"
              onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              className="text-gray-500 hover:text-gray-700"
            >
              {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="text-red-500 text-sm ml-1">{errors.confirmPassword}</span>}
        </div>

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
              Changing Password...
            </>
          ) : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;