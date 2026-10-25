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
      <div className="min-h-screen flex items-center justify-center bg-[#0B3D2E] text-[#F6F1E4] p-4">
        <div className="text-center p-8 bg-[#114A39] rounded-[12px] shadow-xl max-w-md w-full border border-[#1F5A46]">
          <div className="w-12 h-12 bg-[#072A20] text-[#C9A24B] border border-[#1F5A46] rounded-[6px] flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#F6F1E4] mb-2">Authentication Required</h2>
          <p className="text-xs text-[#BFD0C6] mb-6">Please log in or select a quick demo persona to access this workspace.</p>
          <div className="space-y-2.5">
            <button
              onClick={() => quickLoginAs('business')}
              className="w-full py-2.5 px-4 bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] font-semibold rounded-[6px] text-xs transition-colors"
            >
              Sign in as Client (Alex Chen)
            </button>
            <button
              onClick={() => quickLoginAs('freelancer')}
              className="w-full py-2.5 px-4 bg-[#072A20] hover:bg-[#0B3D2E] text-[#F6F1E4] border border-[#1F5A46] hover:border-[#C9A24B] font-medium rounded-[6px] text-xs transition-colors"
            >
              Sign in as Talent (Sarah Jenkins)
            </button>
            <Link
              to="/login"
              className="block text-center w-full py-2 text-xs text-[#BFD0C6] hover:text-[#E5CB86]"
            >
              Go to Standard Login &rarr;
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

  const handleDashboardNavClick = (href: string) => {
    setSidebarOpen(false);
    if (location.pathname === href) {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior: ScrollBehavior = prefersReducedMotion ? 'instant' : 'smooth';
      window.scrollTo({ top: 0, left: 0, behavior });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior });
      document.body.scrollTo({ top: 0, left: 0, behavior });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B3D2E] text-[#F6F1E4] flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#072A20] text-[#F6F1E4] px-4 py-3 flex items-center justify-between border-b border-[#1F5A46]">
        <Link to="/" onClick={() => handleDashboardNavClick('/')} className="flex items-center gap-2.5">
          <div className="w-4 h-4 border border-[#C9A24B] rotate-45 transform flex items-center justify-center">
            <div className="w-1 h-1 bg-[#C9A24B]" />
          </div>
          <span className="font-serif text-lg font-medium text-[#F6F1E4]">SkillBridge</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-[#BFD0C6]">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Collapsible Emerald Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#072A20] text-[#BFD0C6] z-40 flex flex-col justify-between border-r border-[#1F5A46] transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Workspace Title */}
          <div className="p-5 border-b border-[#1F5A46] flex items-center justify-between">
            <Link to="/" onClick={() => handleDashboardNavClick('/')} className="flex items-center gap-3 group">
              <div className="w-5 h-5 border-[1.5px] border-[#C9A24B] rotate-45 transform flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#C9A24B]" />
              </div>
              <div>
                <div className="font-serif text-xl font-medium text-[#F6F1E4] leading-tight">SkillBridge</div>
                <div className="text-[10px] text-[#C9A24B] uppercase tracking-wider font-medium">
                  {user.role} Workspace
                </div>
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
                  onClick={() => handleDashboardNavClick(item.href)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-[6px] text-xs font-medium transition-colors ${
                    active
                      ? 'bg-[#114A39] text-[#E5CB86] border border-[#1F5A46] font-semibold'
                      : 'text-[#BFD0C6] hover:text-[#F6F1E4] hover:bg-[#114A39]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-[#C9A24B]' : 'text-[#9DB5A8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#114A39] text-[#C9A24B] border border-[#1F5A46] text-[10px] font-semibold px-2 py-0.5 rounded-[4px]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer in Sidebar */}
        <div className="p-4 border-t border-[#1F5A46] space-y-3">
          <div className="bg-[#0B3D2E] p-2.5 rounded-[6px] border border-[#1F5A46] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-[#1F5A46] object-cover flex-shrink-0"
              />
              <div className="truncate">
                <div className="text-[#F6F1E4] font-medium truncate text-xs">{user.name}</div>
                <div className="text-[10px] text-[#9DB5A8] truncate">{user.email}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Logout"
              className="text-[#9DB5A8] hover:text-[#E27C6B] p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#9DB5A8] pt-1">
            <Link to="/" className="hover:text-[#F6F1E4]">Public Home</Link>
            <span className="text-[#C9A24B]">Forest & Gold</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen bg-[#0B3D2E]">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#0B3D2E]/90 backdrop-blur-md border-b border-[#1F5A46] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-[#BFD0C6]">
            <span className="font-medium text-[#F6F1E4] capitalize">{user.role} Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#9DB5A8]" />
            <span className="text-[#E5CB86] capitalize font-medium">
              {location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-[#072A20] p-1 rounded-[6px] border border-[#1F5A46] text-xs">
              <span className="px-2 text-[10px] text-[#9DB5A8] font-semibold uppercase">Demo:</span>
              <button
                onClick={() => quickLoginAs('business')}
                className={`px-2 py-0.5 rounded-[4px] text-xs transition-colors ${
                  user.role === 'business' ? 'bg-[#114A39] text-[#E5CB86] font-semibold' : 'text-[#BFD0C6] hover:text-[#F6F1E4]'
                }`}
              >
                Client
              </button>
              <button
                onClick={() => quickLoginAs('freelancer')}
                className={`px-2 py-0.5 rounded-[4px] text-xs transition-colors ${
                  user.role === 'freelancer' ? 'bg-[#114A39] text-[#E5CB86] font-semibold' : 'text-[#BFD0C6] hover:text-[#F6F1E4]'
                }`}
              >
                Talent
              </button>
              <button
                onClick={() => quickLoginAs('admin')}
                className={`px-2 py-0.5 rounded-[4px] text-xs transition-colors ${
                  user.role === 'admin' ? 'bg-[#114A39] text-[#E5CB86] font-semibold' : 'text-[#BFD0C6] hover:text-[#F6F1E4]'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Notification Bell */}
            <Link
              to={user.role === 'freelancer' ? '/freelancer/dashboard' : '/business/dashboard'}
              className="relative p-2 rounded-[6px] text-[#BFD0C6] hover:text-[#F6F1E4] hover:bg-[#114A39] border border-transparent hover:border-[#1F5A46]"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9A24B]" />
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
