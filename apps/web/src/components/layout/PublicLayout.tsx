import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-[#0B3D2E] text-[#F6F1E4]">
      {!isAuthPage && <Navbar />}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};
