import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { FindFreelancersPage } from './pages/public/FindFreelancersPage';
import { FindProjectsPage } from './pages/public/FindProjectsPage';
import { FreelancerProfilePage } from './pages/public/FreelancerProfilePage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { PricingPage } from './pages/public/PricingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Freelancer pages
import { FreelancerDashboard } from './pages/freelancer/FreelancerDashboard';
import { FreelancerOnboardingPage } from './pages/freelancer/FreelancerOnboardingPage';
import { FreelancerProposalsPage } from './pages/freelancer/FreelancerProposalsPage';
import { FreelancerContractsListPage } from './pages/freelancer/FreelancerContractsListPage';
import { FreelancerPortfolioPage } from './pages/freelancer/FreelancerPortfolioPage';
import { FreelancerEarningsPage } from './pages/freelancer/FreelancerEarningsPage';
import { FreelancerReviewsPage } from './pages/freelancer/FreelancerReviewsPage';
import { FreelancerSettingsPage } from './pages/freelancer/FreelancerSettingsPage';

// Business pages
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { BusinessOnboardingPage } from './pages/business/BusinessOnboardingPage';
import { PostProjectPage } from './pages/business/PostProjectPage';
import { BusinessProposalsPage } from './pages/business/BusinessProposalsPage';
import { BusinessProjectsListPage } from './pages/business/BusinessProjectsListPage';
import { BusinessCompanyPage } from './pages/business/BusinessCompanyPage';
import { BusinessPaymentsPage } from './pages/business/BusinessPaymentsPage';

// Workspace & Messages
import { ContractWorkspacePage } from './pages/contracts/ContractWorkspacePage';
import { MessagesPage } from './pages/messages/MessagesPage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center p-6">
      <div className="space-y-4 max-w-md">
        <h1 className="text-6xl font-extrabold text-brand-navy">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested route does not exist or has been moved to another location.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-xl bg-brand-indigo text-white font-bold text-xs"
        >
          Return to Platform Home
        </Link>
      </div>
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/find-freelancers" element={<FindFreelancersPage />} />
        <Route path="/projects" element={<FindProjectsPage />} />
        <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/privacy" element={<AboutPage />} />
        <Route path="/terms" element={<AboutPage />} />
      </Route>

      {/* Freelancer Dashboard Routes */}
      <Route path="/freelancer" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/freelancer/dashboard" replace />} />
        <Route path="dashboard" element={<FreelancerDashboard />} />
        <Route path="onboarding" element={<FreelancerOnboardingPage />} />
        <Route path="projects" element={<FindProjectsPage />} />
        <Route path="proposals" element={<FreelancerProposalsPage />} />
        <Route path="contracts" element={<FreelancerContractsListPage />} />
        <Route path="contracts/:id" element={<ContractWorkspacePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="portfolio" element={<FreelancerPortfolioPage />} />
        <Route path="earnings" element={<FreelancerEarningsPage />} />
        <Route path="reviews" element={<FreelancerReviewsPage />} />
        <Route path="settings" element={<FreelancerSettingsPage />} />
      </Route>

      {/* Business Dashboard Routes */}
      <Route path="/business" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/business/dashboard" replace />} />
        <Route path="dashboard" element={<BusinessDashboard />} />
        <Route path="onboarding" element={<BusinessOnboardingPage />} />
        <Route path="projects" element={<BusinessProjectsListPage />} />
        <Route path="projects/new" element={<PostProjectPage />} />
        <Route path="projects/:id/proposals" element={<BusinessProposalsPage />} />
        <Route path="find-freelancers" element={<FindFreelancersPage />} />
        <Route path="contracts" element={<FreelancerContractsListPage />} />
        <Route path="contracts/:id" element={<ContractWorkspacePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="payments" element={<BusinessPaymentsPage />} />
        <Route path="company" element={<BusinessCompanyPage />} />
        <Route path="settings" element={<BusinessCompanyPage />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="disputes" element={<AdminDisputesPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
