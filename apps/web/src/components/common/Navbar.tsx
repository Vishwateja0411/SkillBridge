import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  Briefcase,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, quickLoginAs } = useAuth();
  const { notifications, unreadNotifCount, markNotifRead, markAllNotifsRead } = useSocket();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'freelancer') return '/freelancer/dashboard';
    if (user.role === 'business') return '/business/dashboard';
    if (user.role === 'admin') return '/admin/dashboard';
    return '/';
  };

  const handleDemoSwitch = async (role: 'business' | 'freelancer' | 'admin') => {
    setDemoDropdownOpen(false);
    await quickLoginAs(role);
    if (role === 'freelancer') navigate('/freelancer/dashboard');
    else if (role === 'business') navigate('/business/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="SkillBridge Logo"
                className="w-9 h-9 object-contain rounded-xl group-hover:scale-105 transition-transform drop-shadow-sm"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-brand-navy">
                  Skill<span className="text-brand-indigo">Bridge</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-brand-indigo border border-indigo-100">
                  AI Talent
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/find-freelancers"
                className="text-sm font-medium text-slate-600 hover:text-brand-indigo transition-colors"
              >
                Find Talent
              </Link>
              <Link
                to="/projects"
                className="text-sm font-medium text-slate-600 hover:text-brand-indigo transition-colors"
              >
                Find Projects
              </Link>
              <Link
                to="/how-it-works"
                className="text-sm font-medium text-slate-600 hover:text-brand-indigo transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/pricing"
                className="text-sm font-medium text-slate-600 hover:text-brand-indigo transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Instant Demo Switch
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('business')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Alex Chen (Client)</div>
                      <div className="text-slate-500 text-[11px]">TechVentures AI • Post & Hire</div>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 font-medium px-2 py-0.5 rounded">
                      Client
                    </span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('freelancer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-teal-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Sarah Jenkins (Freelancer)</div>
                      <div className="text-slate-500 text-[11px]">Senior Full-Stack • Apply & Deliver</div>
                    </div>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-medium px-2 py-0.5 rounded">
                      Freelancer
                    </span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Platform Admin</div>
                      <div className="text-slate-500 text-[11px]">Disputes, Verification, Analytics</div>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-medium px-2 py-0.5 rounded">
                      Admin
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Authenticated user menu */}
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Notifications</span>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={markAllNotifsRead}
                            className="text-[11px] text-brand-indigo font-medium hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">No notifications yet</div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotifRead(n.id);
                              navigate(n.link);
                              setNotifDropdownOpen(false);
                            }}
                            className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer text-xs ${
                              !n.read ? 'bg-indigo-50/40' : ''
                            }`}
                          >
                            <div className="font-semibold text-slate-800">{n.title}</div>
                            <div className="text-slate-600 text-[11px] mt-0.5">{n.message}</div>
                            <div className="text-slate-400 text-[10px] mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Dashboard button */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-brand-navy text-white hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Layers className="w-4 h-4 text-brand-teal" />
                  <span>Dashboard</span>
                </Link>

                {/* User avatar & logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    title="Log Out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-navy transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-indigo hover:bg-brand-indigo-dark text-white shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/find-freelancers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Find Talent
          </Link>
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Find Projects
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            How It Works
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-700 py-1.5"
          >
            Pricing
          </Link>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-brand-navy text-white font-medium text-sm"
                >
                  Go to Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-center py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg border border-slate-300 text-slate-700 font-medium text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-brand-indigo text-white font-semibold text-sm"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
