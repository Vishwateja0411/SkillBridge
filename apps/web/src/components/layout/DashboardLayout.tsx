import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CheckSquare,
  MessageSquare,
  DollarSign,
  FolderKanban,
  Star,
  Settings,
  Users,
  ShieldCheck,
  AlertTriangle,
  History,
  PlusCircle,
  Building2,
  Bell,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const DashboardLayout: React.FC = () => {
  const { user, logout, quickLoginAs } = useAuth();
  const { unreadNotifCount } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full border border-slate-200">
          <div className="w-12 h-12 bg-indigo-50 text-brand-indigo rounded-xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Required</h2>
          <p className="text-sm text-slate-500 mb-6">Please log in or pick a quick demo persona to access this dashboard.</p>
          <div className="space-y-2">
            <button
              onClick={() => quickLoginAs('business')}
              className="w-full py-2.5 px-4 bg-brand-navy hover:bg-slate-800 text-white font-medium rounded-xl text-sm"
            >
              Sign in as Business (Alex Chen)
            </button>
            <button
              onClick={() => quickLoginAs('freelancer')}
              className="w-full py-2.5 px-4 bg-brand-indigo hover:bg-brand-indigo-dark text-white font-medium rounded-xl text-sm"
            >
              Sign in as Freelancer (Sarah Jenkins)
            </button>
            <Link
              to="/login"
              className="block text-center w-full py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              Go to Standard Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Items based on role
  let navItems: SidebarItem[] = [];

  if (user.role === 'freelancer') {
    navItems = [
      { label: 'Overview', href: '/freelancer/dashboard', icon: LayoutDashboard },
      { label: 'Find Projects', href: '/freelancer/projects', icon: Briefcase },
      { label: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
      { label: 'Active Contracts', href: '/freelancer/contracts', icon: CheckSquare },
      { label: 'Messages', href: '/freelancer/messages', icon: MessageSquare },
      { label: 'Portfolio', href: '/freelancer/portfolio', icon: FolderKanban },
      { label: 'Earnings & Payouts', href: '/freelancer/earnings', icon: DollarSign },
      { label: 'Reviews', href: '/freelancer/reviews', icon: Star },
      { label: 'Settings', href: '/freelancer/settings', icon: Settings },
    ];
  } else if (user.role === 'business') {
    navItems = [
      { label: 'Overview', href: '/business/dashboard', icon: LayoutDashboard },
      { label: 'Post a Project', href: '/business/projects/new', icon: PlusCircle },
      { label: 'My Projects', href: '/business/projects', icon: Briefcase },
      { label: 'Find Talent', href: '/business/find-freelancers', icon: Users },
      { label: 'Active Contracts', href: '/business/contracts', icon: CheckSquare },
      { label: 'Messages', href: '/business/messages', icon: MessageSquare },
      { label: 'Payments & Escrow', href: '/business/payments', icon: DollarSign },
      { label: 'Company Profile', href: '/business/company', icon: Building2 },
      { label: 'Settings', href: '/business/settings', icon: Settings },
    ];
  } else if (user.role === 'admin') {
    navItems = [
      { label: 'Platform Overview', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'User Directory', href: '/admin/users', icon: Users },
      { label: 'Dispute Arbitration', href: '/admin/disputes', icon: AlertTriangle },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
    ];
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-brand-navy text-white px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="SkillBridge" className="w-6 h-6 object-contain rounded-md" />
          <span className="font-bold">SkillBridge</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-slate-200">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-brand-navy text-slate-300 z-40 flex flex-col justify-between border-r border-slate-800 transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="SkillBridge Logo"
                className="w-9 h-9 object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="font-bold text-white text-base leading-tight">SkillBridge</div>
                <div className="text-[11px] text-brand-teal capitalize font-medium">{user.role} Workspace</div>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-brand-indigo text-white shadow-md shadow-indigo-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-brand-teal/20 text-brand-teal text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Role badge switcher */}
          <div className="bg-slate-800/80 p-2.5 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-slate-700 object-cover flex-shrink-0"
              />
              <div className="truncate">
                <div className="text-white font-medium truncate">{user.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Logout"
              className="text-slate-400 hover:text-red-400 p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <Link to="/" className="hover:text-slate-300">Public Home</Link>
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-800 capitalize">{user.role} Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 font-medium capitalize">
              {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher in Header */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
              <span className="px-2 text-[11px] text-slate-500 font-semibold">Demo Role:</span>
              <button
                onClick={() => quickLoginAs('business')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  user.role === 'business' ? 'bg-white shadow text-brand-navy font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Client
              </button>
              <button
                onClick={() => quickLoginAs('freelancer')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  user.role === 'freelancer' ? 'bg-white shadow text-brand-navy font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Freelancer
              </button>
              <button
                onClick={() => quickLoginAs('admin')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  user.role === 'admin' ? 'bg-white shadow text-brand-navy font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Notification Bell */}
            <Link
              to={user.role === 'freelancer' ? '/freelancer/dashboard' : '/business/dashboard'}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </Link>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <div className="p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
