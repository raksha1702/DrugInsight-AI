import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pill, ShieldCheck, Menu, X, User, LogOut, ChevronDown, Sparkles, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isDoctor, isResearcher, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToast();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Medicines', path: '/medicines' },
    { name: 'About', path: '/about' },
    { name: 'Safety', path: '/safety' },
    { name: 'Contact', path: '/contact' }
  ];

  const getPortalLink = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isResearcher) return '/researcher/dashboard';
    if (isDoctor) return '/doctor/dashboard';
    if (user?.verificationStatus === 'pending') return '/verification-status';
    return '/medicines';
  };

  const getRoleBadge = () => {
    if (isAdmin) return <span className="text-[11px] font-semibold bg-[#F6D8C8] text-[#8E4D2B] px-2 py-0.5 rounded-full">Admin</span>;
    if (isDoctor) return <span className="text-[11px] font-semibold bg-[#D9C9F0] text-[#5D4487] px-2 py-0.5 rounded-full">Doctor</span>;
    if (isResearcher) return <span className="text-[11px] font-semibold bg-[#BDD7EE] text-[#2B5A82] px-2 py-0.5 rounded-full">Researcher</span>;
    if (user?.verificationStatus === 'pending') return <span className="text-[11px] font-semibold bg-[#FFF1D9] text-[#8F5C14] px-2 py-0.5 rounded-full">Pending</span>;
    return <span className="text-[11px] font-semibold bg-[#EAF5ED] text-[#2E5A44] px-2 py-0.5 rounded-full">Public</span>;
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#FFFFFF]/85 backdrop-blur-md border-b border-[#E5EBE8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF5ED] border border-[#A8CDB5]/40 flex items-center justify-center text-[#2E5A44] shadow-sm group-hover:scale-105 transition-transform">
              <Pill className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#293B42]">DrugInsight</span>
              <span className="font-bold text-lg tracking-tight text-[#2E5A44] ml-1">AI</span>
              <div className="text-[10px] text-[#72818A] tracking-wider font-medium -mt-1 hidden sm:block">PHARMACEUTICAL INTELLIGENCE</div>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#EAF5ED] text-[#2E5A44] font-semibold'
                      : 'text-[#72818A] hover:text-[#293B42] hover:bg-[#FAFBF9]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Auth & CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full border border-[#E5EBE8] bg-[#FFFFFF] hover:border-[#A8CDB5] hover:shadow-card transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#EAF5ED] flex items-center justify-center text-[#2E5A44] text-xs font-semibold">
                    {user?.name.charAt(0) || 'U'}
                  </div>
                  <div className="text-left text-xs max-w-[120px] truncate font-medium text-[#293B42]">
                    {user?.name}
                  </div>
                  {getRoleBadge()}
                  <ChevronDown className="w-3.5 h-3.5 text-[#72818A]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FFFFFF] border border-[#E5EBE8] shadow-soft-lg p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-[#E5EBE8] mb-1">
                      <p className="text-xs font-semibold text-[#293B42] truncate">{user?.name}</p>
                      <p className="text-[11px] text-[#72818A] truncate">{user?.email}</p>
                      <div className="mt-1">{getRoleBadge()}</div>
                    </div>

                    <Link
                      to={getPortalLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#293B42] hover:bg-[#EAF5ED] hover:text-[#2E5A44] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#2E5A44]" />
                      <span>{isAdmin ? 'Admin Console' : isDoctor ? 'Doctor Workspace' : isResearcher ? 'Researcher Workspace' : 'My Dashboard'}</span>
                    </Link>

                    {user?.verificationStatus === 'none' && (
                      <Link
                        to="/verify-professional"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#5D4487] hover:bg-[#D9C9F0]/30 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#5D4487]" />
                        <span>Verify Professional ID</span>
                      </Link>
                    )}

                    <div className="border-t border-[#E5EBE8] my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-[#293B42] hover:text-[#2E5A44] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2E5A44] text-[#FFFFFF] text-sm font-semibold shadow-sm hover:bg-[#244836] hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#293B42] hover:bg-[#EAF5ED] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5EBE8] bg-[#FFFFFF] px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-[#EAF5ED] text-[#2E5A44] font-semibold'
                    : 'text-[#293B42] hover:bg-[#FAFBF9]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E5EBE8]">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#293B42]">{user?.name}</p>
                    <p className="text-xs text-[#72818A]">{user?.email}</p>
                  </div>
                  <div>{getRoleBadge()}</div>
                </div>
                <Link
                  to={getPortalLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#2E5A44] text-white text-sm font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Open Workspace</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-[#E5EBE8] text-sm font-semibold text-[#293B42]"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-[#2E5A44] text-white text-sm font-semibold"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
