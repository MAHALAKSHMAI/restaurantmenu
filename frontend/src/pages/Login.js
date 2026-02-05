import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'cashier') navigate('/cashier');
      else if (user.role === 'kitchen') navigate('/kitchen');
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-6 font-inter">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="bg-emerald-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-emerald-200">
            🍴
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Resto<span className="text-emerald-600">POS</span>
          </h1>
          <p className="text-slate-400 font-semibold mt-2">Sign in to your dashboard</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@restopos.com"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot?</a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg ${
              loading 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In to POS'}
          </button>
        </form>

        {/* Footer Section */}
        <div className="mt-12 text-center pt-8 border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            &copy; 2024 RestoPOS System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
