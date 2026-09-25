import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, User, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(password);

  const getStrengthLabel = (str: number) => {
    if (!password) return { text: 'Empty', color: 'bg-slate-300' };
    if (str <= 1) return { text: 'Weak', color: 'bg-rose-500' };
    if (str <= 3) return { text: 'Moderate', color: 'bg-amber-500' };
    return { text: 'Strong', color: 'bg-emerald-500' };
  };

  const strengthInfo = getStrengthLabel(strength);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      error('Validation Error', 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      error('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      error('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      error('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      error('Terms Required', 'Please accept the Terms & Conditions.');
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName, email, password);
      success('Registration Successful', 'Your account has been created. Please sign in to continue.');
      navigate('/login');
    } catch (err: any) {
      error('Registration Failed', err?.message || 'An error occurred during account registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight font-mono text-slate-900">
              DataLeakGuard<span className="text-teal-600">-CV</span>
            </h2>
            <p className="text-[10px] text-slate-500">Evidence-Based Integrity Assurance</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 font-mono">Create an Account</h3>
          <p className="text-xs text-slate-500 mt-1">
            Register your operator credentials to access the ML assurance console.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Jordan Hayes"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="j.hayes@lab.edu"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                  <span>Strength: {strengthInfo.text}</span>
                  <span>{strength}/4 Criteria</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full ${
                        step <= strength ? strengthInfo.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-3.5 h-3.5 mt-0.5 rounded bg-white border-slate-300 text-teal-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 text-xs text-slate-600 cursor-pointer leading-normal select-none">
              I agree to the Terms & Conditions and understand that DataLeakGuard-CV provides project-defined integrity assurance diagnostics.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors mt-2 shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <span>Registering Account...</span>
            ) : (
              <>
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-700 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
