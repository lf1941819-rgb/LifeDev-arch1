/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Differentials } from './components/sections/Differentials';
import { Process } from './components/sections/Process';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/ui/Footer';

// Admin Imports
import { AuthGuard } from './components/admin/AuthGuard';
import { AdminLayout } from './components/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PortfolioManagement } from './pages/admin/PortfolioManagement';
import { LeadsManagement } from './pages/admin/LeadsManagement';
import { SiteSettings } from './pages/admin/SiteSettings';
import { PaymentPage } from './pages/PaymentPage';

function PublicSite() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <Differentials />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicSite />} />
        <Route path="/pagamento" element={<PaymentPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        
        <Route element={<AuthGuard />}>
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/portfolio" element={<AdminLayout><PortfolioManagement /></AdminLayout>} />
          <Route path="/admin/leads" element={<AdminLayout><LeadsManagement /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><SiteSettings /></AdminLayout>} />
          <Route path="/admin/posts" element={<AdminLayout><div className="p-8 text-center text-zinc-500">Módulo de Postagens em desenvolvimento.</div></AdminLayout>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


