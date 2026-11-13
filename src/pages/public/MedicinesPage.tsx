import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Pill,
  ShieldCheck,
  ChevronRight,
  Database,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Tag,
  AlertTriangle,
  Stethoscope,
  Microscope,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { medicineService } from '../../services/medicineService';
import { Medicine } from '../../types';

export const MedicinesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRxStatus, setSelectedRxStatus] = useState<'all' | 'OTC' | 'Prescription'>('all');
  const [selectedAccessCategory, setSelectedAccessCategory] = useState<'all' | 'Category A' | 'Category B' | 'Category C'>('all');
  const [onlyBoxedWarnings, setOnlyBoxedWarnings] = useState(false);
  const [selectedSource, setSelectedSource] = useState('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'alphabetical' | 'recent' | 'risk'>('relevance');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(24);

  const categories = useMemo(() => medicineService.getCategories(), []);
  const dataSources = useMemo(() => medicineService.getDataSources(), []);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicineService.searchMedicines({
      query: searchQuery,
      category: selectedCategory,
      dataSource: selectedSource,
      rxStatus: selectedRxStatus,
      accessCategory: selectedAccessCategory,
      hasBoxedWarning: onlyBoxedWarnings ? true : undefined,
      sortBy
    });
  }, [searchQuery, selectedCategory, selectedSource, selectedRxStatus, selectedAccessCategory, onlyBoxedWarnings, sortBy]);

  // Paginated slice for smooth high-performance UI
  const visibleMedicines = useMemo(() => {
    return filteredMedicines.slice(0, displayCount);
  }, [filteredMedicines, displayCount]);

  // Suggestions for autocomplete
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const all = medicineService.getAllMedicines();
    return all
      .filter(m => m.name.toLowerCase().includes(q) || m.activeIngredient.toLowerCase().includes(q))
      .slice(0, 5);
  }, [searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRxStatus('all');
    setSelectedAccessCategory('all');
    setOnlyBoxedWarnings(false);
    setSelectedSource('all');
    setSortBy('relevance');
    setDisplayCount(24);
  };

  const getCardAccent = (med: Medicine, index: number) => {
    if (med.hasBoxedWarning || med.warnings?.boxedWarning) {
      return 'hover:border-amber-300 hover:bg-[#FFFDF9]';
    }
    const accents = [
      'hover:border-[#A8CDB5] hover:bg-[#FAFDFB]',
      'hover:border-[#BDD7EE] hover:bg-[#FAFCFE]',
      'hover:border-[#D9C9F0] hover:bg-[#FDFBFE]',
      'hover:border-[#F6D8C8] hover:bg-[#FEFAF8]'
    ];
    return accents[index % accents.length];
  };

  const getPillIconColor = (med: Medicine, index: number) => {
    if (med.hasBoxedWarning || med.warnings?.boxedWarning) {
      return 'bg-[#FFF1D9] text-amber-800';
    }
    const colors = [
      'bg-[#EAF5ED] text-[#2E5A44]',
      'bg-[#EEF5FB] text-[#2B5A82]',
      'bg-[#F4EEFB] text-[#5D4487]',
      'bg-[#FDF3EE] text-[#8E4D2B]'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF5ED] text-[#2E5A44] text-xs font-semibold mb-3">
            <Pill className="w-3.5 h-3.5 -rotate-45" />
            <span>Expanded Medicine Catalog ({medicineService.getAllMedicines().length} Verified Records)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#293B42] tracking-tight">
            Explore Medicine Information
          </h1>
          <p className="text-sm sm:text-base text-[#72818A] mt-2">
            Search official medicine monographs from DailyMed & openFDA. Public users can inspect approved indications, adverse reactions, contraindications, and critical safety warnings for any medication.
          </p>
        </div>

        {/* Quick Access Classification Badges / Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => { setSelectedRxStatus('all'); setOnlyBoxedWarnings(false); }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedRxStatus === 'all' && !onlyBoxedWarnings
                ? 'bg-[#2E5A44] text-white shadow-xs'
                : 'bg-white text-[#72818A] border border-[#E5EBE8] hover:border-[#A8CDB5]'
            }`}
          >
            All Medicines ({medicineService.getAllMedicines().length})
          </button>

          <button
            onClick={() => { setSelectedRxStatus('OTC'); setOnlyBoxedWarnings(false); }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedRxStatus === 'OTC' && !onlyBoxedWarnings
                ? 'bg-[#A8CDB5] text-[#1B3E2D] shadow-xs'
                : 'bg-white text-[#2E5A44] border border-[#E5EBE8] hover:border-[#A8CDB5]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Over-The-Counter (OTC)</span>
          </button>

          <button
            onClick={() => { setSelectedRxStatus('Prescription'); setOnlyBoxedWarnings(false); }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedRxStatus === 'Prescription' && !onlyBoxedWarnings
                ? 'bg-[#BDD7EE] text-[#1A4268] shadow-xs'
                : 'bg-white text-[#2B5A82] border border-[#E5EBE8] hover:border-[#BDD7EE]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Prescription Medicines (Rx)</span>
          </button>

          <button
            onClick={() => setOnlyBoxedWarnings(!onlyBoxedWarnings)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              onlyBoxedWarnings
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'bg-white text-amber-800 border border-amber-200 hover:border-amber-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Boxed Warning Present</span>
          </button>
        </div>

        {/* Search Bar & Auto-suggestions */}
        <div className="max-w-3xl mx-auto mb-8 relative">
          <div className="relative flex items-center bg-white rounded-full border border-[#E5EBE8] shadow-card focus-within:border-[#A8CDB5] focus-within:shadow-soft-lg transition-all p-2 pl-5">
            <Search className="w-5 h-5 text-[#72818A] mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSuggestionsOpen(true);
                setDisplayCount(24);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              placeholder="Search by generic name, brand name, indication, or active ingredient..."
              className="w-full bg-transparent text-sm text-[#293B42] focus:outline-hidden placeholder:text-[#72818A]/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-[#72818A] hover:text-[#293B42] rounded-full hover:bg-slate-100 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSuggestionsOpen(false)}
              className="px-6 py-2.5 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold transition-all shadow-xs flex-shrink-0"
            >
              Search
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {suggestionsOpen && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#E5EBE8] shadow-soft-lg p-2 z-30 animate-in fade-in">
              <div className="text-[11px] font-semibold text-[#72818A] px-3 py-1.5 uppercase tracking-wider">
                Matching Medicines ({suggestions.length})
              </div>
              {suggestions.map(s => (
                <Link
                  key={s.id}
                  to={`/medicines/${s.id}`}
                  onClick={() => setSuggestionsOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#EAF5ED] text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center font-bold">
                      <Pill className="w-3.5 h-3.5 -rotate-45" />
                    </div>
                    <div>
                      <span className="font-bold text-[#293B42]">{s.name}</span>
                      <span className="text-[#72818A] ml-2 font-normal">({s.activeIngredient})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EEF5FB] text-[#2B5A82]">
                      {s.rxStatus || 'Prescription'}
                    </span>
                    <span className="text-[11px] font-medium text-[#72818A] hidden sm:inline">{s.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#E5EBE8] p-4 mb-6 shadow-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 text-xs text-[#72818A]">
              <span className="font-semibold text-[#293B42]">Therapeutic Domain:</span>
              <select
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); setDisplayCount(24); }}
                className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-[#A8CDB5] text-[#293B42] font-medium cursor-pointer max-w-[200px]"
              >
                <option value="all">All Domains ({categories.length})</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Access Category Filter */}
            <div className="flex items-center gap-1.5 text-xs text-[#72818A]">
              <span className="font-semibold text-[#293B42]">Access Tier:</span>
              <select
                value={selectedAccessCategory}
                onChange={e => { setSelectedAccessCategory(e.target.value as any); setDisplayCount(24); }}
                className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-[#A8CDB5] text-[#293B42] font-medium cursor-pointer"
              >
                <option value="all">All Access Tiers</option>
                <option value="Category A">Category A (General Public)</option>
                <option value="Category B">Category B (Verified Doctor)</option>
                <option value="Category C">Category C (Researcher Only)</option>
              </select>
            </div>

            {/* Data Source Filter */}
            <div className="flex items-center gap-1.5 text-xs text-[#72818A]">
              <span className="font-semibold text-[#293B42]">Source:</span>
              <select
                value={selectedSource}
                onChange={e => { setSelectedSource(e.target.value); setDisplayCount(24); }}
                className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-[#A8CDB5] text-[#293B42] font-medium cursor-pointer"
              >
                <option value="all">All Sources</option>
                {dataSources.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sorting */}
            <div className="flex items-center gap-1.5 text-xs text-[#72818A]">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#FAFBF9] border border-[#E5EBE8] text-xs rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-[#A8CDB5] text-[#293B42] font-medium cursor-pointer"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="risk">High Alert First</option>
                <option value="recent">Recently Updated</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-[#72818A] hover:text-[#2E5A44] px-2.5 py-1.5 rounded-xl hover:bg-[#FAFBF9] transition-colors"
              title="Reset all search filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Public Clinical Transparency Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-[#EAF5ED]/60 border border-[#A8CDB5]/40 flex items-start gap-3 text-xs text-[#2E5A44]">
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2E5A44]" />
          <p className="leading-relaxed">
            <strong>Public Safety Transparency:</strong> Essential safety information, approved indications, side effects, and critical contraindications are open to all users. Advanced AI clinical synthesis, comparison matrices, and report exports remain restricted to verified doctors and researchers.
          </p>
        </div>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-xs text-[#72818A] mb-4 px-1">
          <span>
            Showing <strong className="text-[#293B42]">{Math.min(visibleMedicines.length, filteredMedicines.length)}</strong> of{' '}
            <strong className="text-[#293B42]">{filteredMedicines.length}</strong> matching records
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <Database className="w-3 h-3 text-[#A8CDB5]" />
            Live Indexed Monograph Archive (DailyMed & openFDA)
          </span>
        </div>

        {/* Medicines Horizontal Cards Grid */}
        <div className="space-y-4">
          <AnimatePresence>
            {visibleMedicines.length > 0 ? (
              visibleMedicines.map((med, index) => {
                const hasBoxed = Boolean(med.hasBoxedWarning || med.warnings?.boxedWarning);
                const isRx = (med.rxStatus || 'Prescription') === 'Prescription';

                return (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card transition-all ${getCardAccent(med, index)}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      {/* Left Details */}
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${getPillIconColor(med, index)}`}>
                          <Pill className="w-7 h-7 -rotate-45" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-bold text-[#293B42] tracking-tight">{med.name}</h3>

                            {/* OTC vs Prescription Badge */}
                            {isRx ? (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F4EEFB] text-[#5D4487] border border-[#D9C9F0]">
                                Rx (Prescription)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF5ED] text-[#2E5A44] border border-[#A8CDB5]">
                                OTC
                              </span>
                            )}

                            {/* Boxed Warning Badge */}
                            {hasBoxed && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF1D9] text-amber-900 border border-amber-300">
                                <AlertTriangle className="w-3 h-3 text-amber-700" />
                                <span>Boxed Warning</span>
                              </span>
                            )}

                            {/* Category Badge */}
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAFBF9] text-[#72818A] border border-[#E5EBE8]">
                              {med.category}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-[#72818A]">
                            Active Ingredient: <span className="text-[#293B42]">{med.activeIngredient}</span>
                            {med.brandNames && med.brandNames.length > 0 && (
                              <span className="ml-2 text-[#72818A] font-normal">
                                · Brands: {med.brandNames.slice(0, 3).join(', ')}
                              </span>
                            )}
                          </div>

                          <p className="text-xs sm:text-sm text-[#72818A] line-clamp-2 max-w-3xl leading-relaxed pt-1">
                            {med.description}
                          </p>

                          {/* Approved indications teaser */}
                          {med.approvedUses && med.approvedUses.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] font-semibold text-[#293B42]">Approved uses:</span>
                              {med.approvedUses.slice(0, 2).map((use, uIdx) => (
                                <span key={uIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAFBF9] text-[#72818A] border border-[#E5EBE8]">
                                  {use}
                                </span>
                              ))}
                              {med.approvedUses.length > 2 && (
                                <span className="text-[11px] text-[#72818A]">+{med.approvedUses.length - 2} more</span>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#72818A] pt-2">
                            <span>Formulation: <strong className="text-[#293B42] font-semibold">{med.formulation}</strong></span>
                            <span>•</span>
                            <span>Source: <span className="font-semibold text-[#293B42]">{med.dataSource}</span></span>
                            <span>•</span>
                            <span>Updated: {med.lastUpdated}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="flex md:flex-col items-center justify-end gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5EBE8]">
                        <Link
                          to={`/medicines/${med.id}`}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#FAFBF9] hover:bg-[#2E5A44] text-[#293B42] hover:text-white border border-[#E5EBE8] hover:border-[#2E5A44] text-xs font-bold shadow-xs hover:shadow transition-all group"
                        >
                          <span>View Monograph</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        {isRx && (
                          <span className="text-[10px] text-[#72818A] flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-[#5D4487]" />
                            <span>Clinical tools gated</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              /* No Results State */
              <div className="p-12 text-center rounded-3xl bg-white border border-dashed border-[#E5EBE8] my-8">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF1D9] text-amber-800 flex items-center justify-center mx-auto mb-4">
                  <Pill className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#293B42]">No Medicines Found</h3>
                <p className="text-xs sm:text-sm text-[#72818A] max-w-md mx-auto mt-1 mb-6">
                  We could not find any medicines matching "{searchQuery}" under the selected filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Load More Pagination */}
        {visibleMedicines.length < filteredMedicines.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setDisplayCount(prev => prev + 24)}
              className="px-8 py-3 rounded-full bg-white hover:bg-[#FAFBF9] text-[#293B42] font-bold text-xs border border-[#E5EBE8] hover:border-[#A8CDB5] shadow-card transition-all"
            >
              Load More Medicines ({filteredMedicines.length - visibleMedicines.length} remaining)
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
