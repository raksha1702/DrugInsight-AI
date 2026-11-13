import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  Bookmark,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  FileCheck2,
  Check
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { researchService } from '../../services/researchService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { AIChatMessage, SourceCitation } from '../../types';

export const AIChatView: React.FC = () => {
  const { user } = useAuth();
  const { success, info } = useToast();

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Welcome to the **DrugInsight AI Research Assistant**.

I am specialized in synthesizing regulatory evidence from **FDA Structured Product Labeling (SPL)** and **DailyMed** monographs.

Ask me about:
- Clinical indications & mechanism of action
- Class-effect adverse reactions & boxed warnings
- Renal and hepatic dose adjustment precautions
- Labeling discrepancy timelines

*Please note: I cannot evaluate patient clinical symptoms, provide diagnoses, or recommend personalized treatments.*`,
      timestamp: '12:00 PM',
      citations: [
        {
          id: 'cit-init',
          source: 'DailyMed / FDA SPL Monograph Catalog',
          labelId: 'US-FDA-LABEL-INDEX',
          section: 'Standardized Regulatory Product Information',
          textSnippet: 'All clinical evidence synthesized by this model is extracted from structured product labeling archives.'
        }
      ],
      isDemo: true
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedCitation, setExpandedCitation] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestedPrompts = [
    'Summarize the warnings for metformin',
    'Explain the reported adverse reactions of amoxicillin',
    'Compare official indications of two medicines',
    'Summarize available pharmaceutical label evidence',
    'What should I take for my headache?' // Triggers clinical safety refusal
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const aiResponse = await aiService.askQuestion(q);
      setIsTyping(false);
      setMessages(prev => [...prev, aiResponse]);
    } catch {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Copied AI response to clipboard.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveToLibrary = (msg: AIChatMessage) => {
    researchService.saveItem({
      userId: user?.id || 'demo-user',
      type: 'ai_chat',
      title: `AI Synthesis: ${msg.content.slice(0, 45)}...`,
      subtitle: `${msg.citations?.length || 0} regulatory citations attached`,
      tags: ['AI Evidence', 'DailyMed SPL'],
      notes: msg.content
    });
    success('Saved AI research answer to your Research Library.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Chat Sidebar (Conversations & Saved Prompts) */}
      <div className="hidden lg:flex lg:col-span-3 flex-col justify-between bg-white rounded-3xl border border-[#E5EBE8] p-4 shadow-card">
        <div className="space-y-4">
          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="w-full py-2.5 px-4 rounded-2xl bg-[#EAF5ED] text-[#2E5A44] hover:bg-[#A8CDB5]/40 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Research Chat</span>
          </button>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#72818A] px-2 block mb-2">
              Recent Inquiries
            </span>
            <div className="space-y-1">
              <button
                onClick={() => handleSendMessage('Summarize the warnings for metformin')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#293B42] hover:bg-[#FAFBF9] truncate font-medium flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#5D4487] flex-shrink-0" />
                <span className="truncate">Metformin Lactic Acidosis</span>
              </button>
              <button
                onClick={() => handleSendMessage('Explain the reported adverse reactions of amoxicillin')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#293B42] hover:bg-[#FAFBF9] truncate font-medium flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#5D4487] flex-shrink-0" />
                <span className="truncate">Amoxicillin Adverse Reactions</span>
              </button>
              <button
                onClick={() => handleSendMessage('Compare official indications of two medicines')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#293B42] hover:bg-[#FAFBF9] truncate font-medium flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#5D4487] flex-shrink-0" />
                <span className="truncate">CCB vs ACEI Indications</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFF1D9] border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-800" />
            <span>AI Safety Protocols</span>
          </div>
          The model answers regulatory queries with statutory SPL citations. Individual diagnosis and prescriptions are rejected.
        </div>
      </div>

      {/* Main Chat Conversation Area */}
      <div className="lg:col-span-9 bg-white rounded-3xl border border-[#E5EBE8] shadow-card flex flex-col justify-between overflow-hidden">
        {/* Chat Top Banner */}
        <div className="px-6 py-4 border-b border-[#E5EBE8] bg-[#FAFBF9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#F4EEFB] text-[#5D4487] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#293B42]">DrugInsight AI Research Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5ED] text-[#2E5A44]">
                  SPL Evidenced
                </span>
              </div>
              <p className="text-[11px] text-[#72818A]">Indexed to DailyMed & openFDA structured product monographs</p>
            </div>
          </div>

          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="p-1.5 rounded-xl text-[#72818A] hover:text-[#293B42] hover:bg-slate-100"
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Suggested Quick Prompt Chips (When few messages) */}
          {messages.length <= 2 && (
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#72818A] uppercase tracking-wider block mb-2">
                Suggested Research Queries:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="px-3.5 py-1.5 rounded-full bg-[#FAFBF9] hover:bg-[#F4EEFB] border border-[#E5EBE8] hover:border-[#D9C9F0] text-xs font-medium text-[#293B42] transition-all text-left flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#5D4487]" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render Messages */}
          {messages.map(msg => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl w-full ${isUser ? 'ml-12' : 'mr-12'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-5 rounded-3xl ${
                      isUser
                        ? 'bg-[#F4EEFB] text-[#293B42] rounded-br-xs border border-[#D9C9F0]/60'
                        : msg.isRefusal
                        ? 'bg-[#FFF1D9] text-amber-950 rounded-bl-xs border border-amber-300'
                        : 'bg-white text-[#293B42] rounded-bl-xs border border-[#E5EBE8] shadow-card'
                    }`}
                  >
                    {/* Header line for AI */}
                    {!isUser && (
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E5EBE8]">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-[#5D4487]" />
                          <span className="text-xs font-bold text-[#293B42]">DrugInsight AI Engine</span>
                          {msg.isDemo && (
                            <span className="text-[9px] font-semibold bg-[#EAF5ED] text-[#2E5A44] px-2 py-0.5 rounded-full">
                              Demo Monograph Data
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#72818A]">{msg.timestamp}</span>
                      </div>
                    )}

                    {/* Content formatted with markdown-style line breaks */}
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-2">
                      {msg.content}
                    </div>

                    {/* Source Citations Component */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#E5EBE8]">
                        <span className="text-[11px] font-bold text-[#72818A] uppercase tracking-wider block mb-2">
                          Regulatory Citations ({msg.citations.length})
                        </span>
                        <div className="space-y-2">
                          {msg.citations.map(cit => {
                            const isExpanded = expandedCitation === cit.id;
                            return (
                              <div
                                key={cit.id}
                                className="rounded-2xl border border-[#E5EBE8] bg-[#FAFBF9] p-3 text-xs"
                              >
                                <div
                                  onClick={() => setExpandedCitation(isExpanded ? null : cit.id)}
                                  className="flex items-center justify-between cursor-pointer font-semibold text-[#293B42]"
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <FileCheck2 className="w-3.5 h-3.5 text-[#2E5A44] flex-shrink-0" />
                                    <span className="truncate">{cit.section}</span>
                                    <span className="text-[10px] text-[#72818A] font-mono">[{cit.labelId}]</span>
                                  </div>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                                {isExpanded && (
                                  <div className="mt-2 pt-2 border-t border-[#E5EBE8] text-[11px] text-[#72818A] italic leading-relaxed">
                                    "{cit.textSnippet}"
                                    <div className="mt-1 font-sans text-[10px] not-italic text-[#2E5A44] font-semibold">
                                      Source: {cit.source}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* AI Message Action Buttons */}
                    {!isUser && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5EBE8] text-xs">
                        <div className="flex items-center gap-3 text-[#72818A]">
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 hover:text-[#293B42] transition-colors"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => handleSaveToLibrary(msg)}
                            className="inline-flex items-center gap-1 hover:text-[#293B42] transition-colors"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-[#2E5A44]" />
                            <span>Save</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[#72818A]">
                          <button onClick={() => success('Feedback recorded: Helpful')} className="p-1 hover:text-[#2E5A44]">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => info('Feedback recorded: Unhelpful')} className="p-1 hover:text-rose-600">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#72818A] p-4 bg-[#FAFBF9] rounded-2xl w-fit">
              <Bot className="w-4 h-4 text-[#5D4487] animate-bounce" />
              <span>Synthesizing DailyMed structured citations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#FAFBF9] border-t border-[#E5EBE8]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-white rounded-full border border-[#E5EBE8] px-4 py-2 focus-within:border-[#A8CDB5] shadow-xs"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder="Ask a pharmaceutical research question (e.g. adverse reactions, boxed warnings, indications)..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-[#293B42] focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-[#2E5A44] hover:bg-[#244836] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-[#72818A] mt-2">
            AI responses cite official DailyMed & openFDA product labels. Educational demo mode.
          </div>
        </div>
      </div>
    </div>
  );
};
