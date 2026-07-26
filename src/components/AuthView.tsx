import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { APP_BRAND } from '../../constants';
import { SparklesIcon } from '../../components/icons/SparklesIcon';

export const AuthView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Optionally show message if email confirmation is required
        setError('Đăng ký thành công! Đang đăng nhập...');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-emerald-600/20 p-3 rounded-xl border border-emerald-500/30">
             <SparklesIcon className="w-10 h-10 text-emerald-400" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
          {APP_BRAND.name}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Studio Kịch Bản Tự Động
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-emerald-900/20 sm:rounded-2xl border border-gray-800 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className={`p-3 rounded-md text-sm ${error.includes('thành công') ? 'bg-emerald-900/50 text-emerald-200 border border-emerald-800' : 'bg-red-900/50 text-red-200 border border-red-800'}`}>
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-black text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-black text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Hoặc</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
