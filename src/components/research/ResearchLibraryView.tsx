import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Pill,
  GitCompare,
  Bot,
  FileText,
  Trash2,
  ExternalLink,
  Plus,
  Tag,
  AlertCircle,
  Calendar,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { researchService } from '../../services/researchService';
import { useToast } from '../../context/ToastContext';
import { SavedResearchItem } from '../../types';

export const ResearchLibraryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'medicine' | 'comparison' | 'ai_chat' | 'note'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<SavedResearchItem[]>(researchService.getSavedItems());
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('');

  const { success } = useToast();

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleDeleteItem = (id: string, title: string) => {
    researchService.deleteItem(id);
    setItems(researchService.getSavedItems());
    success(`Removed "${title}" from your library.`);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    researchService.saveItem({
      userId: 'user-doc-02',
      type: 'note',
      title: newNoteTitle,
      subtitle: 'Clinical & Pharmacological Research Note',
      tags: newNoteTag ? [newNoteTag, 'Clinical Note'] : ['Clinical Note'],
      notes: newNoteContent
    });

    setItems(researchService.getSavedItems());
    setNewNoteModalOpen(false);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteTag('');
    success('Saved clinical note to library.');
  };

  const tabs = [
    { id: 'all', label: 'All Items' },
    { id: 'medicine', label: 'Saved Medicines', icon: Pill },
    { id: 'comparison', label: 'Saved Comparisons', icon: GitCompare },
    { id: 'ai_chat', label: 'AI Conversations', icon: Bot },
    { id: 'note', label: 'Research Notes', icon: FileText },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medicine':
        return <Pill className="w-4 h-4 text-[#2E5A44]" />;
      case 'comparison':
        return <GitCompare className="w-4 h-4 text-[#5D4487]" />;
      case 'ai_chat':
        return <Bot className="w-4 h-4 text-[#2B5A82]" />;
      default:
        return <FileText className="w-4 h-4 text-[#8E4D2B]" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'medicine':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5ED] text-[#2E5A44]">Medicine</span>;
      case 'comparison':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4EEFB] text-[#5D4487]">Comparison</span>;
      case 'ai_chat':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF5FB] text-[#2B5A82]">AI Query</span>;
      default:
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDF3EE] text-[#8E4D2B]">Note</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">Research Library</h2>
          <p className="text-xs sm:text-sm text-[#72818A] mt-1">
            Organize bookmarked product labels, cross-monograph matrices, AI evidence syntheses, and clinical notes.
          </p>
        </div>

        <button
          onClick={() => setNewNoteModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Research Note</span>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5EBE8] shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#EAF5ED] text-[#2E5A44]'
                    : 'text-[#72818A] hover:text-[#293B42] hover:bg-[#FAFBF9]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search inside library */}
        <div className="relative flex items-center min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#72818A] absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search saved items or tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAFBF9] border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
          />
        </div>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-3xl bg-white border border-[#E5EBE8] shadow-card hover:border-[#A8CDB5] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FAFBF9] border border-[#E5EBE8] flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                      {getTypeBadge(item.type)}
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="p-1.5 rounded-lg text-[#72818A] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-[#293B42] mb-1 leading-snug">{item.title}</h3>
                  {item.subtitle && <p className="text-xs text-[#72818A] mb-3">{item.subtitle}</p>}

                  {item.notes && (
                    <div className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E5EBE8] text-[11px] text-[#72818A] leading-relaxed line-clamp-3 mb-3">
                      {item.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] font-medium bg-[#FAFBF9] border border-[#E5EBE8] px-2.5 py-0.5 rounded-full text-[#72818A]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5EBE8] flex items-center justify-between text-[11px] text-[#72818A]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.createdAt}
                  </span>

                  {item.type === 'medicine' && item.targetId ? (
                    <Link
                      to={`/medicines/${item.targetId}`}
                      className="text-[#2E5A44] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Open Monograph</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : item.type === 'comparison' ? (
                    <Link
                      to="/doctor/compare"
                      className="text-[#5D4487] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Matrix</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-[#2E5A44] font-semibold">Active Reference</span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center rounded-3xl bg-white border border-dashed border-[#E5EBE8]">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#293B42]">No Saved Items in this Category</h3>
              <p className="text-xs text-[#72818A] mt-1 max-w-sm mx-auto">
                Bookmark medicines, export comparisons, or create clinical research notes to view them here.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* New Note Modal */}
      {newNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-3xl p-6 shadow-soft-xl border border-[#E5EBE8] space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
              <h3 className="text-sm font-bold text-[#293B42]">Create Clinical Research Note</h3>
              <button onClick={() => setNewNoteModalOpen(false)} className="text-[#72818A] hover:text-[#293B42]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#293B42] mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Renin-Angiotensin System in Heart Failure"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293B42] mb-1">Topic Tag</label>
                <input
                  type="text"
                  value={newNoteTag}
                  onChange={e => setNewNoteTag(e.target.value)}
                  placeholder="e.g. Cardiology"
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293B42] mb-1">Clinical Observations & Findings</label>
                <textarea
                  rows={4}
                  required
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  placeholder="Document observations regarding contraindications, dosage titration, or pharmacokinetic interactions..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewNoteModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E5EBE8] text-xs font-semibold text-[#72818A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
