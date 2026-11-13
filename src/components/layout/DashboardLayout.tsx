import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Pill,
  LayoutDashboard,
  Search,
  GitCompare,
  Bot,
  BarChart3,
  BookOpen,
  FileText,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  ShieldCheck,
  Users,
  History,
  Settings,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  portalType: 'doctor' | 'researcher' | 'admin';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, portalType }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/');
  };

  const doctorNav = [
    { name: 'Overview', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'Medicine Search', path: '/doctor/medicine-search', icon: Search },
    { name: 'Drug Comparison', path: '/doctor/compare', icon: GitCompare },
    { name: 'AI Research Assistant', path: '/doctor/ai-assistant', icon: Bot },
    { name: 'Research Library', path: '/doctor/research-library', icon: BookOpen },
    { name: 'Reports', path: '/doctor/reports', icon: FileText },
    { name: 'Profile', path: '/doctor/profile', icon: User },
  ];

  const researcherNav = [
    { name: 'Overview', path: '/researcher/dashboard', icon: LayoutDashboard },
    { name: 'Medicine Search', path: '/researcher/medicine-search', icon: Search },
    { name: 'Drug Comparison', path: '/researcher/compare', icon: GitCompare },
    { name: 'AI Assistant', path: '/researcher/ai-assistant', icon: Bot },
    { name: 'Analytics', path: '/researcher/analytics', icon: BarChart3 },
    { name: 'Research Library', path: '/researcher/research-library', icon: BookOpen },
    { name: 'Reports', path: '/researcher/reports', icon: FileText },
    { name: 'Profile', path: '/researcher/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Verification Requests', path: '/admin/verifications', icon: ShieldCheck },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: History },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems = portalType === 'doctor' ? doctorNav : portalType === 'researcher' ? researcherNav : adminNav;

  const getPortalTitle = () => {
    if (portalType === 'doctor') return 'Doctor Portal';
    if (portalType === 'researcher') return 'Researcher Workspace';
    return 'Admin Governance';
  };

  const getBadgeStyle = () => {
    if (portalType === 'admin') return 'bg-[#F6D8C8] text-[#8E4D2B] border-[#F6D8C8]';
    if (portalType === 'doctor') return 'bg-[#D9C9F0] text-[#5D4487] border-[#D9C9F0]';
    return 'bg-[#BDD7EE] text-[#2B5A82] border-[#BDD7EE]';
  };

  const getActiveItemStyle = (isActive: boolean) => {
    if (!isActive) {
      return 'text-[#72818A] hover:text-[#293B42] hover:bg-[#FAFBF9]';
    }
    if (portalType === 'admin') {
      return 'bg-[#F4EEFB] text-[#5D4487] font-semibold border-r-4 border-[#5D4487]';
    }
    return 'bg-[#EAF5ED] text-[#2E5A44] font-semibold border-r-4 border-[#2E5A44]';
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#E5EBE8] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#EAF5ED] flex items-center justify-center text-[#2E5A44]">
            <Pill className="w-4 h-4 -rotate-45" />
          </div>
          <span className="font-bold text-sm text-[#293B42]">DrugInsight AI</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
            {portalType.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg text-[#293B42] hover:bg-[#FAFBF9]"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E5EBE8] flex flex-col justify-between transition-transform duration-300 md:translate-x-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Header */}
        <div>
          <div className="h-20 flex items-center px-6 border-b border-[#E5EBE8] justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#EAF5ED] border border-[#A8CDB5]/40 flex items-center justify-center text-[#2E5A44]">
                <Pill className="w-4 h-4 -rotate-45" />
              </div>
              <div>
                <span className="font-bold text-base text-[#293B42]">DrugInsight <span className="text-[#2E5A44]">AI</span></span>
                <div className="text-[10px] text-[#72818A] tracking-wider uppercase font-semibold">{getPortalTitle()}</div>
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-[#72818A] hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Preview Pill */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EAF5ED] text-[#2E5A44] font-bold flex items-center justify-center text-sm flex-shrink-0">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#293B42] truncate">{user?.name}</div>
              <div className="text-[11px] text-[#72818A] truncate">{user?.institution || user?.email}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${getActiveItemStyle(isActive)}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-[#E5EBE8] space-y-2">
          <Link
            to="/medicines"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#72818A] hover:text-[#293B42] hover:bg-[#FAFBF9] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Public Database
            </span>
            <ChevronRight className="w-3 h-3 text-[#A8CDB5]" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Desktop Bar */}
        <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-[#E5EBE8] px-8 items-center justify-between sticky top-0 z-20">
          <div>
            <div className="text-xs font-semibold text-[#72818A] uppercase tracking-wider">
              {portalType === 'doctor' ? 'Clinical Research Suite' : portalType === 'researcher' ? 'Pharmaceutical Intelligence' : 'Regulatory Governance'}
            </div>
            <h1 className="text-lg font-bold text-[#293B42]">
              {location.pathname.split('/').pop()?.replace(/-/g, ' ').toUpperCase() || 'DASHBOARD'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-10 h-10 rounded-full border border-[#E5EBE8] bg-[#FAFBF9] hover:bg-white flex items-center justify-center text-[#72818A] hover:text-[#293B42] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E5EBE8] shadow-soft-lg p-3 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
                    <span className="text-xs font-bold text-[#293B42]">Platform Alerts</span>
                    <span className="text-[10px] text-[#72818A]">2 unread</span>
                  </div>
                  <div className="py-2 space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#EAF5ED] text-[#293B42]">
                      <div className="font-semibold text-[#2E5A44]">DailyMed Label Sync Complete</div>
                      <div className="text-[11px] text-[#72818A] mt-0.5">142 monographs updated with recent FDA safety revisions.</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FFF1D9] text-[#8F5C14]">
                      <div className="font-semibold">Educational Demo Mode Active</div>
                      <div className="text-[11px] text-amber-800 mt-0.5">All responses are simulated for demonstrative research purposes.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill */}
            <Link
              to={portalType === 'admin' ? '/admin/settings' : `/${portalType}/profile`}
              className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full border border-[#E5EBE8] hover:border-[#A8CDB5] bg-white transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#EAF5ED] text-[#2E5A44] font-bold text-xs flex items-center justify-center">
                {user?.name.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-semibold text-[#293B42] max-w-[120px] truncate">{user?.name}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle()}`}>
                {portalType.toUpperCase()}
              </span>
            </Link>
          </div>
        </header>

        {/* Dashboard Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Backdrop for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 md:hidden"
        />
      )}
    </div>
  );
};
