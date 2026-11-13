import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Pill,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Stethoscope,
  FlaskConical,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { DEMO_CREDENTIALS } from '../../data/mockUsers';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterLogin = (role: string, status?: string) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'researcher') navigate('/researcher/dashboard');
    else if (status === 'pending') navigate('/verification-status');
    else navigate('/medicines');
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const res = login(email);
      setIsLoading(false);
      if (res.success) {
        success('Welcome back to DrugInsight AI');
        const userRole = email.includes('admin')
          ? 'admin'
          : email.includes('doctor') || email.includes('vance')
          ? 'doctor'
          : email.includes('researcher') || email.includes('rostova')
          ? 'researcher'
          : 'public';
        redirectAfterLogin(userRole);
      } else {
        toastError(res.error || 'User not found. Try one-click demo login below.');
      }
    }, 400);
  };

  const handleDemoLogin = (roleKey: string) => {
    const loggedUser = demoLogin(roleKey);
    success(`Logged in as ${loggedUser.name} (${loggedUser.role.toUpperCase()})`);
    redirectAfterLogin(loggedUser.role, loggedUser.verificationStatus);
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-4xl border border-[#E5EBE8] shadow-soft-xl overflow-hidden">
        {/* Left Column: Visual & Welcome */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#EAF5ED] via-[#FAFBF9] to-[#F4EEFB] p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E5EBE8] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#D9C9F0]/25 blur-3xl pointer-events-none"></div>

          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-white border border-[#A8CDB5]/40 flex items-center justify-center text-[#2E5A44] shadow-xs">
                <Pill className="w-5 h-5 -rotate-45" />
              </div>
              <span className="font-bold text-lg text-[#293B42]">DrugInsight <span className="text-[#2E5A44]">AI</span></span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight leading-snug">
              Welcome to Your Pharmaceutical Workspace.
            </h2>
            <p className="text-xs sm:text-sm text-[#72818A] mt-3 leading-relaxed">
              Access DailyMed monographs, cross-drug comparative matrices, and verified AI research summaries.
            </p>
          </div>

          <div className="my-8 flex justify-center">
            <div className="w-44 h-44 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#A8CDB5]/40 p-4 shadow-soft flex flex-col items-center justify-center relative">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold text-[#293B42]">Role-Audited Platform</span>
              <span className="text-[10px] text-[#72818A] text-center mt-1">
                Clinical safety standards strictly enforced
              </span>
            </div>
          </div>

          <div className="text-xs text-[#72818A]">
            <span>Need a new account? </span>
            <Link to="/register" className="font-bold text-[#2E5A44] hover:underline">
              Create account
            </Link>
          </div>
        </div>

        {/* Right Column: Form & Demo Logins */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Sign In</h1>
              <p className="text-xs sm:text-sm text-[#72818A] mt-1">
                Enter your credentials or choose a pre-configured demo account below.
              </p>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleManualLogin} className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-semibold text-[#293B42] mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#72818A] absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. dr.vance@saintmaryshospital.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#293B42]">Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); toastError('Password reset is simulated. Use Demo buttons below.'); }} className="text-[11px] text-[#72818A] hover:text-[#2E5A44]">
                    Forgot password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#72818A] absolute left-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-[#72818A] hover:text-[#293B42] absolute right-3"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#72818A]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-[#E5EBE8] text-[#2E5A44] focus:ring-[#A8CDB5]"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Log In to Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Switcher (Crucial Requirement from Section 8) */}
            <div className="pt-6 border-t border-[#E5EBE8]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#5D4487]" />
                <span className="text-xs font-bold text-[#293B42] uppercase tracking-wider">
                  One-Click Demo Personas
                </span>
              </div>
              <p className="text-[11px] text-[#72818A] mb-3">
                Select any simulated persona to instantly inspect role permissions and dashboards:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_CREDENTIALS.map(demo => {
                  const icons: any = {
                    public: User,
                    doctor: Stethoscope,
                    researcher: FlaskConical,
                    admin: ShieldCheck,
                    pending: Clock
                  };
                  const Icon = icons[demo.role] || User;

                  const colorStyles: any = {
                    mint: 'hover:border-[#A8CDB5] hover:bg-[#EAF5ED]/50',
                    lavender: 'hover:border-[#D9C9F0] hover:bg-[#F4EEFB]/70',
                    blue: 'hover:border-[#BDD7EE] hover:bg-[#EEF5FB]/70',
                    peach: 'hover:border-[#F6D8C8] hover:bg-[#FDF3EE]/70'
                  };

                  return (
                    <button
                      key={demo.role}
                      type="button"
                      onClick={() => handleDemoLogin(demo.role)}
                      className={`p-3 rounded-2xl border border-[#E5EBE8] bg-[#FAFBF9] text-left transition-all ${colorStyles[demo.color] || ''} group`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-[#293B42]" />
                          <span className="text-xs font-bold text-[#293B42] group-hover:text-[#2E5A44]">
                            {demo.badge}
                          </span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#72818A] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-[10px] text-[#72818A] line-clamp-1">{demo.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
