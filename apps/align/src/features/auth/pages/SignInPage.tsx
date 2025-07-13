import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../shared/components';
import { useAuth } from '../../../hooks/useAuth';

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting sign in with:', email);
      const result = await signIn(email, password);
      console.log('Sign in result:', result);
      
      if (result.error) {
        console.error('Sign in error:', result.error);
        setError(result.error.message);
      } else {
        console.log('Sign in successful, navigating to dashboard');
        navigate('/');
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-200" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
      <div className="w-full max-w-md p-8 bg-slate-800/60 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 flex items-center justify-center">
              <Icon
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945"
                className="w-8 h-8 text-blue-400"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Sign in to Align
          </h1>
          <p className="text-slate-400">
            Strategic Goals & OKRs Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-slate-600/50 bg-slate-700/50 text-blue-500 focus:ring-blue-400" />
              <span className="ml-2 text-sm text-slate-400">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:from-sky-500/50 disabled:to-blue-500/50 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-600/50">
          <p className="text-xs text-slate-400 text-center">
            For development mode:{' '}
            <button
              onClick={() => {
                console.log('Setting up dev bypass...');
                // Set up development bypass flag and credentials
                localStorage.setItem('aesyros_dev_bypass', 'true');
                localStorage.setItem('aesyros_dev_organization_id', 'dev-org-123');
                localStorage.setItem('aesyros_dev_user_id', 'dev-user-123');
                console.log('Dev bypass flags set, reloading...');
                window.location.reload();
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Skip authentication (Dev Mode)
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;