import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ArrowLeft, Home, Search } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-4xl border border-[#E5EBE8] shadow-card p-8 sm:p-12 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center mx-auto">
            <Pill className="w-8 h-8 -rotate-45" />
          </div>

          <div>
            <span className="text-4xl font-extrabold text-[#2E5A44] tracking-tight">404</span>
            <h1 className="text-2xl font-bold text-[#293B42] mt-2">Page Not Found</h1>
            <p className="text-xs sm:text-sm text-[#72818A] mt-2 leading-relaxed">
              The requested pharmaceutical monograph or research route does not exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/medicines"
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white border border-[#E5EBE8] text-[#293B42] text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore Medicines</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
