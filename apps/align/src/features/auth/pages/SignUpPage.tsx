import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../shared/components';
import { useAuth } from '../../../hooks/useAuth';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    organizationName: '',
    jobTitle: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // For now, we'll create a placeholder organization ID
      // In a real app, this would create the organization first
      const result = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        organization_id: 'new-org', // This would be created dynamically
        job_title: formData.jobTitle
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        navigate('/');
      }
    } catch (err) {
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
            Create your account
          </h1>
          <p className="text-slate-400">
            Start aligning your organization's goals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-200 mb-1.5">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-slate-200 mb-1.5">
              Organization name
            </label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="Your Company"
            />
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-slate-200 mb-1.5">
              Job title
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="CEO, Manager, etc."
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200 mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-400/20 text-white placeholder-slate-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 disabled:from-sky-500/50 disabled:to-blue-500/50 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;