import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { success } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success('Your message has been delivered to the DrugInsight AI regulatory support desk.');
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#2E5A44] uppercase tracking-wider bg-[#EAF5ED] px-4 py-1.5 rounded-full">
            Inquiries & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#293B42] mt-4 tracking-tight">
            Contact & Regulatory Assistance
          </h1>
          <p className="text-sm text-[#72818A] mt-2">
            Reach out for credential verification support, academic partnerships, or medical data feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-[#E5EBE8] shadow-card space-y-6">
              <h3 className="text-lg font-bold text-[#293B42]">Direct Channels</h3>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#293B42]">Credential Auditing Desk</div>
                  <div className="text-[#72818A]">credentials@druginsight.ai</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-[#EEF5FB] text-[#2B5A82] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#293B42]">Research Support Line</div>
                  <div className="text-[#72818A]">+1 (800) 555-0199 (Mon–Fri, 9am–5pm EST)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-[#F4EEFB] text-[#5D4487] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#293B42]">Academic Governance Office</div>
                  <div className="text-[#72818A]">Center for Pharmaceutical Informatics, Suite 400, Cambridge, MA</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#EAF5ED] border border-[#A8CDB5]/50 text-xs text-[#2E5A44] space-y-2">
              <strong className="block text-sm">Response Time SLA</strong>
              <p className="leading-relaxed">
                Doctor and researcher verification requests submitted with valid statutory IDs are reviewed by the governance desk within 24 to 48 business hours.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="md:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-[#E5EBE8] shadow-card">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EAF5ED] text-[#2E5A44] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#293B42]">Message Received</h3>
                  <p className="text-xs sm:text-sm text-[#72818A] max-w-sm mx-auto">
                    Thank you for contacting DrugInsight AI. A representative will review your message and reply via email shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-[#293B42] mb-4">Send an Inquiry</h3>

                  <div>
                    <label className="block text-xs font-semibold text-[#293B42] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Jane Smith"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293B42] mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. jsmith@hospital.org"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293B42] mb-1">Topic / Subject</label>
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                    >
                      <option value="General Inquiry">General Platform Inquiry</option>
                      <option value="Verification Support">Professional Verification Support</option>
                      <option value="Data Correction">DailyMed / openFDA Monograph Feedback</option>
                      <option value="Institutional License">Academic / Institutional Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293B42] mb-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Provide details regarding your inquiry..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#2E5A44] hover:bg-[#244836] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
