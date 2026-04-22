import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(result.message);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#020B14] flex items-center justify-center p-4 relative bg-cover bg-center"
      style={{ backgroundImage: "url('/landing-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#020B14]/80 z-0"></div>

      <div className="bg-white p-8 max-w-md w-full border border-slate-300 shadow-2xl z-10">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 bg-[#00E5FF] flex items-center justify-center border-2 border-black text-black">
            <span className="material-symbols-outlined text-[24px]">radar</span>
          </div>
          <h1 className="text-2xl font-bold text-black font-headline uppercase tracking-widest leading-none">OceanInsight</h1>
        </div>
        
        <h2 className="text-sm font-headline font-bold text-slate-600 mb-6 text-center uppercase tracking-widest">Tactical Network Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-black px-3 py-2 text-sm text-black focus:outline-none focus:bg-slate-50 transition-colors"
            />
          </div>
          <div>
             <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-700 mb-1">Password</label>
             <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-black px-3 py-2 text-sm text-black focus:outline-none focus:bg-slate-50 transition-colors"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-[#00E5FF] hover:bg-[#00A3B5] text-black border-2 border-black font-headline font-bold tracking-widest uppercase text-xs mt-4 transition-colors">
            Access System
          </button>
        </form>
        <p className="mt-6 text-center text-slate-600 text-xs font-medium">
          Unregistered operator? <Link to="/register" className="text-black font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
