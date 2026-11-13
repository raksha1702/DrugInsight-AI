import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserRound,
  Stethoscope,
  FlaskConical,
  CheckCircle2,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Pill,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');

  // Step 2 Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register } = useAuth();
  const { success, warning } = useToast();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-400', 'bg-amber-400', 'bg-sky-400', 'bg-emerald-500'];

  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('You must agree to the terms of service and medical disclaimer.');
      return;
    }

    // Register user (in mock storage)
    register(name, email, selectedRole);
    setCurrentStep(3);
  };

  const handleStep3Finish = () => {
    if (selectedRole === 'public') {
      success('Account created! Welcome to DrugInsight AI.');
      navigate('/medicines');
    } else {
      warning('Please provide professional credential verification to unlock doctor/researcher tools.');
      navigate('/verify-professional');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Brand Header */}
      <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-white border border-[#A8CDB5]/40 flex items-center justify-center text-[#2E5A44] shadow-xs">
          <Pill className="w-5 h-5 -rotate-45" />
        </div>
        <span className="font-bold text-xl text-[#293B42]">DrugInsight <span className="text-[#2E5A44]">AI</span></span>
      </Link>

      <div className="max-w-3xl w-full bg-white rounded-4xl border border-[#E5EBE8] shadow-soft-xl p-8 sm:p-12 relative overflow-hidden">
        {/* Soft pastel ambient decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#EAF5ED]/50 blur-3xl pointer-events-none"></div>

        {/* Stepper Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#293B42] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1.5">
            Choose an account type to get started with verified medicine intelligence.
          </p>

          {/* Stepper Progress */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 1 ? 'text-[#2E5A44]' : 'text-[#72818A]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-[#2E5A44] text-white' : 'bg-[#E5EBE8] text-[#72818A]'}`}>
                1
              </span>
              <span>Choose Role</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-[#2E5A44]' : 'bg-[#E5EBE8]'}`}></div>
            <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 2 ? 'text-[#2E5A44]' : 'text-[#72818A]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-[#2E5A44] text-white' : 'bg-[#E5EBE8] text-[#72818A]'}`}>
                2
              </span>
              <span>Account Details</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-[#2E5A44]' : 'bg-[#E5EBE8]'}`}></div>
            <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 3 ? 'text-[#2E5A44]' : 'text-[#72818A]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-[#2E5A44] text-white' : 'bg-[#E5EBE8] text-[#72818A]'}`}>
                3
              </span>
              <span>Verify / Submit</span>
            </div>
          </div>
        </div>

        {/* STEP 1: Choose Role */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: General Public */}
              <div
                onClick={() => setSelectedRole('public')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedRole === 'public'
                    ? 'border-[#2E5A44] bg-[#EAF5ED]/60 shadow-soft scale-[1.02]'
                    : 'border-[#E5EBE8] bg-[#FAFBF9] hover:border-[#A8CDB5]'
                }`}
              >
                {selectedRole === 'public' && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#2E5A44] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center mb-4">
                    <UserRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#293B42] mb-1">General Public</h3>
                  <p className="text-xs text-[#72818A] leading-relaxed">
                    Explore medicine uses, side effects, and safety information from official sources.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5EBE8] text-[11px] font-semibold text-[#2E5A44]">
                  Instant Open Access
                </div>
              </div>

              {/* Option 2: Doctor */}
              <div
                onClick={() => setSelectedRole('doctor')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedRole === 'doctor'
                    ? 'border-[#5D4487] bg-[#F4EEFB]/70 shadow-soft scale-[1.02]'
                    : 'border-[#E5EBE8] bg-[#FAFBF9] hover:border-[#D9C9F0]'
                }`}
              >
                {selectedRole === 'doctor' && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#5D4487] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F4EEFB] text-[#5D4487] flex items-center justify-center mb-4">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#293B42] mb-1">Doctor</h3>
                  <p className="text-xs text-[#72818A] leading-relaxed">
                    Access detailed medicine comparisons, clinical citations, and research briefing tools.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5EBE8] text-[11px] font-semibold text-[#5D4487]">
                  Licensure Verification Required
                </div>
              </div>

              {/* Option 3: Pharmaceutical Researcher */}
              <div
                onClick={() => setSelectedRole('researcher')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                  selectedRole === 'researcher'
                    ? 'border-[#2B5A82] bg-[#EEF5FB]/70 shadow-soft scale-[1.02]'
                    : 'border-[#E5EBE8] bg-[#FAFBF9] hover:border-[#BDD7EE]'
                }`}
              >
                {selectedRole === 'researcher' && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#2B5A82] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF5FB] text-[#2B5A82] flex items-center justify-center mb-4">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#293B42] mb-1">Pharmaceutical Researcher</h3>
                  <p className="text-xs text-[#72818A] leading-relaxed">
                    Analyze pharmaceutical datasets, label timelines, and generate research reports.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5EBE8] text-[11px] font-semibold text-[#2B5A82]">
                  Affiliation Verification Required
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleStep1Continue}
                className="px-8 py-3 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Account Details */}
        {currentStep === 2 && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleStep2Submit}
            className="space-y-4 max-w-lg mx-auto"
          >
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Full Legal Name</label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#72818A] absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Dr. Marcus Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#72818A] absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. marcus.vance@saintmarys.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Password</label>
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

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1 h-1">
                    {[0, 1, 2, 3].map(level => (
                      <div
                        key={level}
                        className={`flex-1 rounded-full ${
                          level < strength ? strengthColors[strength - 1] : 'bg-[#E5EBE8]'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="text-[10px] text-[#72818A] text-right">
                    Strength: <span className="font-semibold text-[#293B42]">{strengthLabels[strength - 1] || 'Weak'}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293B42] mb-1">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#72818A] absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-[#72818A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={e => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5EBE8] text-[#2E5A44] focus:ring-[#A8CDB5]"
                />
                <span>
                  I agree to the DrugInsight AI Terms of Service and acknowledge that platform data is compiled strictly for educational and research inquiry.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full border border-[#E5EBE8] text-xs font-semibold text-[#72818A] hover:bg-[#FAFBF9] flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2"
              >
                <span>Complete Step 2</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.form>
        )}

        {/* STEP 3: Completion & Pathway */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#293B42]">Account Registered Successfully</h3>
              <p className="text-xs sm:text-sm text-[#72818A] mt-2 leading-relaxed">
                {selectedRole === 'public'
                  ? 'Your public access account is ready. You can immediately search and inspect all official DailyMed and openFDA monographs.'
                  : `You have selected the ${selectedRole.toUpperCase()} tier. To unlock comparative clinical matrices, AI research synthesis, and analytics, you must submit credential verification for administrator review.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-left space-y-1">
              <div><strong className="text-[#293B42]">Account:</strong> {name}</div>
              <div><strong className="text-[#293B42]">Email:</strong> {email}</div>
              <div><strong className="text-[#293B42]">Selected Tier:</strong> {selectedRole.toUpperCase()}</div>
              <div>
                <strong className="text-[#293B42]">Verification Status:</strong>{' '}
                <span className="font-semibold text-amber-700">
                  {selectedRole === 'public' ? 'Active' : 'Credential Submission Pending'}
                </span>
              </div>
            </div>

            <button
              onClick={handleStep3Finish}
              className="w-full py-3.5 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <span>{selectedRole === 'public' ? 'Enter Public Medicine Database' : 'Proceed to Professional Verification'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Bottom Link */}
        <div className="text-center text-xs text-[#72818A] mt-8 pt-6 border-t border-[#E5EBE8]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#2E5A44] hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
