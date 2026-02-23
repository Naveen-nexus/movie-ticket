import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaFilm } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-primary opacity-20 rounded-full filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <FaFilm className="text-3xl text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
          <p className="text-text-muted mt-2">Sign in to continue booking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-text-dark dark:text-text-dark mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text-dark dark:text-text-dark"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-text-dark dark:text-text-dark mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-dark-card dark:bg-dark-card border border-dark-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-text-dark dark:text-text-dark"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-primary text-white font-bold rounded-lg btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner w-5 h-5 mr-2" />
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-600 font-semibold">
            Sign Up
          </Link>
        </p>

        {/* Admin Login Link */}
        <p className="mt-2 text-center text-text-muted">
          <Link to="/admin/login" className="text-secondary hover:text-secondary-600 font-semibold">
            Admin Login
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-dark-card dark:bg-dark-card rounded-lg border border-dark-border">
          <p className="text-xs text-text-muted text-center">
            <strong>Demo:</strong> admin@cinema.com / admin123 (Admin)<br />
            user@cinema.com / user123 (User)
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
