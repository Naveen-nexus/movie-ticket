import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Check if user is admin (use result.user or get from context)
        const userRole = result.user?.role;
        
        // Debug: Log the role
        console.log('Login result:', result);
        console.log('User role:', userRole);
        
        if (userRole === 'ADMIN') {
          toast.success('Admin login successful!');
          navigate('/admin');
        } else {
          toast.error(`Access denied. Admin account required. Your role: ${userRole || 'undefined'}`);
          setLoading(false);
        }
      } else {
        toast.error(result.error || 'Login failed');
        setLoading(false);
      }
    } catch (error) {
      toast.error('An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full filter blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-20 rounded-full filter blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative max-w-md w-full glass rounded-2xl shadow-2xl p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-secondary rounded-full mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <FaShieldAlt className="text-3xl text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold gradient-text">Admin Portal</h2>
          <p className="text-text-muted mt-2">Sign in to admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-dark dark:text-text-dark mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-text-dark dark:text-text-dark"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-dark dark:text-text-dark mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-text-dark dark:text-text-dark"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-secondary text-white font-bold rounded-lg btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner w-5 h-5 mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign In as Admin'
            )}
          </motion.button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-text-muted">
            Don't have an admin account?{' '}
            <Link to="/admin/register" className="text-secondary hover:text-secondary-600 font-semibold">
              Create Admin Account
            </Link>
          </p>
          <p className="text-text-muted">
            Regular user?{' '}
            <Link to="/login" className="text-primary hover:text-primary-600 font-semibold">
              User Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
