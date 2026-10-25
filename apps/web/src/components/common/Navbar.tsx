import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';


export const Navbar: React.FC = () => {
  const { user, logout, quickLoginAs } = useAuth();
  const { notifications, unreadNotifCount, markNotifRead, markAllNotifsRead } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { label: 'Find talent', path: '/find-freelancers' },
    { label: 'Find projects', path: '/projects' },
    { label: 'How it works', path: '/how-it-works' },
    { label: 'Pricing', path: '/pricing' },
  ];

  const handleNavClick = (targetPath: string) => {
    // If clicking current page link while scrolled down, smoothly scroll to top
    if (location.pathname === targetPath && !location.hash) {
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
    <nav
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-[#072A20]/95 backdrop-blur-md border-[#1F5A46]'
          : 'bg-[#0B3D2E] border-[#1F5A46]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              onClick={() => handleNavClick('/')}
              className="flex items-center gap-3 group focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
            >
              {/* Gold Diamond Mark */}
              <div className="w-5 h-5 border-[1.5px] border-[#C9A24B] rotate-45 transform flex items-center justify-center transition-transform group-hover:rotate-[135deg] duration-300">
                <div className="w-1.5 h-1.5 bg-[#C9A24B]" />
              </div>
              <span className="font-serif text-2xl tracking-normal text-[#F6F1E4] font-medium">
                SkillBridge
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`text-sm tracking-normal transition-colors relative py-1 focus-visible:ring-1 focus-visible:ring-[#C9A24B] ${
                      isActive
                        ? 'text-[#E5CB86] font-medium after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#C9A24B]'
                        : 'text-[#F6F1E4] hover:text-[#E5CB86] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#C9A24B] hover:after:w-full after:transition-all after:duration-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quiet Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-normal text-[#BFD0C6] hover:text-[#E5CB86] bg-[#072A20] hover:bg-[#114A39] border border-[#1F5A46] transition-colors focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
                title="Switch demo persona quietly"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
                <span>Demo</span>
                <ChevronDown className="w-3 h-3 text-[#9DB5A8]" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#072A20] rounded-[8px] border border-[#1F5A46] py-2 z-50 shadow-2xl">
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#9DB5A8] uppercase tracking-wider">
                    Instant Demo Persona
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('business')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#114A39] flex items-center justify-between text-[#F6F1E4]"
                  >
                    <div>
                      <div className="font-medium text-[#F6F1E4]">Alex Chen (Business)</div>
                      <div className="text-[#9DB5A8] text-[11px]">TechVentures AI • Client</div>
                    </div>
                    <span className="text-[10px] bg-[#114A39] text-[#E5CB86] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
                      Client
                    </span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('freelancer')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#114A39] flex items-center justify-between text-[#F6F1E4]"
                  >
                    <div>
                      <div className="font-medium text-[#F6F1E4]">Sarah Jenkins (Freelancer)</div>
                      <div className="text-[#9DB5A8] text-[11px]">Senior Full-Stack & UI</div>
                    </div>
                    <span className="text-[10px] bg-[#114A39] text-[#7BC49A] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
                      Talent
                    </span>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#114A39] flex items-center justify-between text-[#F6F1E4]"
                  >
                    <div>
                      <div className="font-medium text-[#F6F1E4]">Platform Admin</div>
                      <div className="text-[#9DB5A8] text-[11px]">Disputes & Audits</div>
                    </div>
                    <span className="text-[10px] bg-[#114A39] text-[#E5CB86] border border-[#1F5A46] px-2 py-0.5 rounded-[4px]">
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
                    className="relative p-2 rounded-[6px] text-[#BFD0C6] hover:text-[#F6F1E4] hover:bg-[#114A39] border border-transparent hover:border-[#1F5A46] transition-colors focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9A24B]" />
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#072A20] rounded-[8px] border border-[#1F5A46] py-2 z-50 max-h-96 overflow-y-auto shadow-2xl">
                      <div className="px-4 py-2 border-b border-[#1F5A46] flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#F6F1E4]">Notifications</span>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={markAllNotifsRead}
                            className="text-[11px] text-[#E5CB86] hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-[#9DB5A8]">No notifications yet</div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotifRead(n.id);
                              navigate(n.link);
                              setNotifDropdownOpen(false);
                            }}
                            className={`px-4 py-3 border-b border-[#1F5A46]/60 hover:bg-[#114A39] cursor-pointer text-xs ${
                              !n.read ? 'bg-[#114A39]/60' : ''
                            }`}
                          >
                            <div className="font-medium text-[#F6F1E4]">{n.title}</div>
                            <div className="text-[#BFD0C6] text-[11px] mt-0.5">{n.message}</div>
                            <div className="text-[#9DB5A8] text-[10px] mt-1">
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
                  onClick={() => handleNavClick(getDashboardLink())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium bg-[#114A39] text-[#F6F1E4] hover:text-[#E5CB86] border border-[#1F5A46] hover:border-[#C9A24B] transition-colors focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
                >
                  <Layers className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Dashboard</span>
                </Link>

                {/* User avatar & logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-[#1F5A46]">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full border border-[#1F5A46] object-cover"
                  />
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    title="Log Out"
                    className="p-1 rounded-[6px] text-[#9DB5A8] hover:text-[#E27C6B] hover:bg-[#114A39] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  onClick={() => handleNavClick('/login')}
                  className="px-3 py-1.5 text-sm font-normal text-[#F6F1E4] hover:text-[#E5CB86] transition-colors focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => handleNavClick('/register')}
                  className="relative overflow-hidden group px-4 py-2 text-sm font-semibold bg-[#C9A24B] hover:bg-[#E5CB86] text-[#0B3D2E] rounded-[6px] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
                >
                  <span className="relative z-10">Get started</span>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-[6px] text-[#F6F1E4] hover:bg-[#114A39] focus-visible:ring-1 focus-visible:ring-[#C9A24B]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm h-full bg-[#072A20] border-l border-[#1F5A46] p-6 space-y-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1F5A46]">
                <Link
                  to="/"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick('/');
                  }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 border-[1.5px] border-[#C9A24B] rotate-45 transform flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#C9A24B]" />
                  </div>
                  <span className="font-serif text-xl text-[#F6F1E4]">SkillBridge</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-[#9DB5A8] hover:text-[#F6F1E4]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick(link.path);
                    }}
                    className="block text-base font-normal text-[#F6F1E4] hover:text-[#E5CB86] py-1.5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1F5A46] space-y-3">
              {user ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick(getDashboardLink());
                    }}
                    className="w-full block text-center py-2.5 rounded-[6px] bg-[#114A39] border border-[#1F5A46] text-[#F6F1E4] text-sm font-medium"
                  >
                    Dashboard ({user.role})
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-center py-2 rounded-[6px] border border-[#E27C6B]/40 text-[#E27C6B] text-sm"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick('/login');
                    }}
                    className="w-full block text-center py-2.5 rounded-[6px] border border-[#1F5A46] text-[#F6F1E4] text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavClick('/register');
                    }}
                    className="w-full block text-center py-2.5 rounded-[6px] bg-[#C9A24B] text-[#0B3D2E] font-semibold text-sm"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};


