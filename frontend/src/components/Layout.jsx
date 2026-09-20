import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const titles = {
  '/app/dashboard': { title: 'Quality Control Dashboard', subtitle: 'Real-time production quality overview' },
  '/app/inspection': { title: 'New Inspection',            subtitle: 'Upload a product image to run AI defect detection' }, 
  '/app/live':      { title: 'Live AI Inspection',        subtitle: 'Real-time defect detection on production line' },
  '/app/standard':  { title: 'Standard Product',          subtitle: 'Manage the approved reference for inspection' },
  '/app/history':   { title: 'Inspection History',        subtitle: 'Complete log of all inspected products' },
  '/app/analytics': { title: 'Quality Analytics',         subtitle: 'Trends, defect patterns and insights' },
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const meta = titles[pathname] || titles['/app/dashboard'];

  return (
    <div className="min-h-screen flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar title={meta.title} subtitle={meta.subtitle} onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}