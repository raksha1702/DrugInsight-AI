import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  UploadCloud,
  FileCheck2,
  X,
  Stethoscope,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  Globe,
  Award,
  AlertCircle
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { verificationService } from '../../services/verificationService';

export const VerifyProfessionalPage: React.FC = () => {
  const { user } = useAuth();
  const { success, warning } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [requestedRole, setRequestedRole] = useState<'doctor' | 'researcher'>('doctor');

  // Step 1: Personal
  const [fullName, setFullName] = useState(user?.name || '');
  const [personalEmail, setPersonalEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 234-5678');

  // Step 2: Professional Details
  // Doctor fields
  const [medicalRegNumber, setMedicalRegNumber] = useState('MED-NY-849201');
  const [licensingAuthority, setLicensingAuthority] = useState('New York State Board for Medicine');
  const [countryJurisdiction, setCountryJurisdiction] = useState('United States');
  const [hospitalInstitution, setHospitalInstitution] = useState("St. Mary's Academic Medical Center");
  const [professionalEmail, setProfessionalEmail] = useState('marcus.vance@saintmarys.edu');

  // Researcher fields
  const [researchInstitution, setResearchInstitution] = useState('Cambridge Institute for Pharmacological Research');
  const [department, setDepartment] = useState('Translational Pharmacology');
  const [researchRole, setResearchRole] = useState('Principal Investigator / Senior Research Fellow');

  // Step 3: File Upload
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>({
    name: 'statutory_medical_license_scan.pdf',
    size: '2.4 MB',
    type: 'application/pdf'
  });
  const [dragActive, setDragActive] = useState(false);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/pdf'
      });
      success(`Uploaded: ${file.name}`);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/pdf'
      });
      success(`Uploaded: ${file.name}`);
    }
  };

  const handleSubmitVerification = () => {
    const userId = user?.id || `user-anon-${Date.now()}`;
    verificationService.submitVerification({
      userId,
      applicantName: fullName,
      applicantEmail: personalEmail,
      requestedRole,
      institution: requestedRole === 'doctor' ? hospitalInstitution : researchInstitution,
      department: requestedRole === 'doctor' ? 'Clinical Medicine' : department,
      registrationNumber: requestedRole === 'doctor' ? medicalRegNumber : undefined,
      licensingAuthority: requestedRole === 'doctor' ? licensingAuthority : undefined,
      countryJurisdiction,
      professionalEmail,
      proofDocumentName: uploadedFile?.name,
      proofDocumentType: uploadedFile?.type,
      proofDocumentSize: uploadedFile?.size
    });

    success('Credentials submitted for administrator review.');
    navigate('/verification-status');
  };

  return (
    <div className="min-h-screen bg-[#FAFBF9] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stepper Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-between text-xs font-bold text-[#72818A]">
            <span className={step >= 1 ? 'text-[#2E5A44]' : ''}>1. Personal Info</span>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? 'bg-[#2E5A44]' : 'bg-[#E5EBE8]'}`}></div>
            <span className={step >= 2 ? 'text-[#2E5A44]' : ''}>2. Professional Details</span>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 3 ? 'bg-[#2E5A44]' : 'bg-[#E5EBE8]'}`}></div>
            <span className={step >= 3 ? 'text-[#2E5A44]' : ''}>3. Document Upload</span>
            <div className={`flex-1 h-0.5 mx-3 ${step >= 4 ? 'bg-[#2E5A44]' : 'bg-[#E5EBE8]'}`}></div>
            <span className={step >= 4 ? 'text-[#2E5A44]' : ''}>4. Review & Submit</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context & Security Illustration */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#EAF5ED] via-white to-[#F4EEFB] p-8 rounded-4xl border border-[#E5EBE8] shadow-card space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#A8CDB5] text-[#2E5A44] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#293B42] tracking-tight">
                Professional Credential Verification
              </h2>
              <p className="text-xs sm:text-sm text-[#72818A] mt-2 leading-relaxed">
                DrugInsight AI restricts comparative pharmaceutical tools, raw data analytics, and unredacted regulatory discrepancy reports to licensed healthcare practitioners and vetted research scientists.
              </p>
            </div>

            {/* Role Switcher in Verification */}
            <div className="p-4 rounded-2xl bg-white border border-[#E5EBE8] space-y-2">
              <span className="text-xs font-semibold text-[#293B42] block">Select verification type:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRequestedRole('doctor')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    requestedRole === 'doctor'
                      ? 'bg-[#F4EEFB] text-[#5D4487] border border-[#D9C9F0]'
                      : 'bg-[#FAFBF9] text-[#72818A] border border-[#E5EBE8]'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Medical Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestedRole('researcher')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    requestedRole === 'researcher'
                      ? 'bg-[#EEF5FB] text-[#2B5A82] border border-[#BDD7EE]'
                      : 'bg-[#FAFBF9] text-[#72818A] border border-[#E5EBE8]'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Researcher</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs text-[#72818A]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E5A44] flex-shrink-0 mt-0.5" />
                <span>Audited against official state medical registries and university affiliations</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E5A44] flex-shrink-0 mt-0.5" />
                <span>Simulated administrator demo approval controls</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E5A44] flex-shrink-0 mt-0.5" />
                <span>Uploaded documents remain strictly confidential</span>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Step Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-4xl border border-[#E5EBE8] shadow-card">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#293B42]">Step 1 — Personal Contact Details</h3>
                  <p className="text-xs text-[#72818A]">Provide your contact information for credential validation.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293B42] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Marcus Vance, MD"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293B42] mb-1">Primary Email Address</label>
                  <input
                    type="email"
                    required
                    value={personalEmail}
                    onChange={e => setPersonalEmail(e.target.value)}
                    placeholder="e.g. dr.vance@saintmaryshospital.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293B42] mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-7 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all flex items-center gap-1.5"
                  >
                    <span>Next: Professional Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#293B42]">
                    Step 2 — {requestedRole === 'doctor' ? 'Medical Practitioner Licensure' : 'Academic & Institutional Affiliation'}
                  </h3>
                  <p className="text-xs text-[#72818A]">Enter registry identifiers verified by our governance team.</p>
                </div>

                {requestedRole === 'doctor' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#293B42] mb-1">Medical Registration / License Number</label>
                      <input
                        type="text"
                        required
                        value={medicalRegNumber}
                        onChange={e => setMedicalRegNumber(e.target.value)}
                        placeholder="e.g. MED-NY-849201"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#293B42] mb-1">Licensing Authority / State Board</label>
                      <input
                        type="text"
                        required
                        value={licensingAuthority}
                        onChange={e => setLicensingAuthority(e.target.value)}
                        placeholder="e.g. New York State Board for Medicine"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#293B42] mb-1">Country / Jurisdiction</label>
                        <input
                          type="text"
                          required
                          value={countryJurisdiction}
                          onChange={e => setCountryJurisdiction(e.target.value)}
                          placeholder="United States"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#293B42] mb-1">Hospital / Clinic Affiliation</label>
                        <input
                          type="text"
                          required
                          value={hospitalInstitution}
                          onChange={e => setHospitalInstitution(e.target.value)}
                          placeholder="St. Mary's Academic Medical Center"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#293B42] mb-1">Institutional / Professional Email</label>
                      <input
                        type="email"
                        required
                        value={professionalEmail}
                        onChange={e => setProfessionalEmail(e.target.value)}
                        placeholder="e.g. marcus.vance@saintmarys.edu"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-[#293B42] mb-1">Research Institution / University</label>
                      <input
                        type="text"
                        required
                        value={researchInstitution}
                        onChange={e => setResearchInstitution(e.target.value)}
                        placeholder="Cambridge Institute for Pharmacological Research"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#293B42] mb-1">Department</label>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                          placeholder="Translational Pharmacology"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#293B42] mb-1">Professional Role</label>
                        <input
                          type="text"
                          required
                          value={researchRole}
                          onChange={e => setResearchRole(e.target.value)}
                          placeholder="Principal Investigator / Postdoctoral Fellow"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#293B42] mb-1">Institutional Email (.edu / .ac.uk / .org)</label>
                      <input
                        type="email"
                        required
                        value={professionalEmail}
                        onChange={e => setProfessionalEmail(e.target.value)}
                        placeholder="e.rostova@cambridge.ac.uk"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E5EBE8] text-xs text-[#293B42] focus:outline-hidden focus:border-[#A8CDB5] bg-[#FAFBF9]"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-full border border-[#E5EBE8] text-xs font-semibold text-[#72818A] hover:bg-[#FAFBF9] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-7 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all flex items-center gap-1.5"
                  >
                    <span>Next: Upload Documents</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Document Upload */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#293B42]">Step 3 — Upload Supporting Documentation</h3>
                  <p className="text-xs text-[#72818A]">
                    Upload a scan of your medical license certificate or official institutional appointment letter.
                  </p>
                </div>

                {/* Drag and Drop Zone with dashed lavender border (from prompt Section 7) */}
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                    dragActive
                      ? 'border-[#5D4487] bg-[#F4EEFB]/50'
                      : 'border-[#D9C9F0] bg-[#FAFBF9] hover:bg-[#F4EEFB]/30'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#F4EEFB] text-[#5D4487] flex items-center justify-center mx-auto mb-3">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-[#293B42]">Drag & drop your credential document here</h4>
                  <p className="text-xs text-[#72818A] mt-1 mb-4">
                    Accepted formats: PDF, PNG, JPG (Maximum size: 10 MB)
                  </p>

                  <label className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white border border-[#D9C9F0] text-xs font-semibold text-[#5D4487] hover:bg-[#F4EEFB] cursor-pointer shadow-xs transition-all">
                    <span>Browse Local Files</span>
                    <input type="file" onChange={handleFileInput} accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
                  </label>
                </div>

                {/* Uploaded File Preview */}
                {uploadedFile && (
                  <div className="p-4 rounded-2xl bg-[#EAF5ED] border border-[#A8CDB5] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white text-[#2E5A44] flex items-center justify-center">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#293B42] truncate max-w-xs">{uploadedFile.name}</div>
                        <div className="text-[11px] text-[#72818A]">{uploadedFile.size} · Document Attached</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="p-1.5 rounded-lg text-[#72818A] hover:text-rose-600 hover:bg-white transition-colors"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-full border border-[#E5EBE8] text-xs font-semibold text-[#72818A] hover:bg-[#FAFBF9] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-7 py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] transition-all flex items-center gap-1.5"
                  >
                    <span>Next: Review Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review Step */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#293B42]">Step 4 — Review & Affirm Credentials</h3>
                  <p className="text-xs text-[#72818A]">Review summary before queueing for administrator audit.</p>
                </div>

                {/* Clean Summary Card */}
                <div className="p-6 rounded-3xl bg-[#FAFBF9] border border-[#E5EBE8] space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
                    <span className="font-bold text-sm text-[#293B42]">{fullName}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#EAF5ED] text-[#2E5A44] uppercase text-[10px]">
                      {requestedRole}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#72818A] block">Personal Email:</span>
                      <strong className="text-[#293B42]">{personalEmail}</strong>
                    </div>
                    <div>
                      <span className="text-[#72818A] block">Professional Email:</span>
                      <strong className="text-[#293B42]">{professionalEmail}</strong>
                    </div>
                    {requestedRole === 'doctor' ? (
                      <>
                        <div>
                          <span className="text-[#72818A] block">Medical License No.:</span>
                          <strong className="text-[#293B42]">{medicalRegNumber}</strong>
                        </div>
                        <div>
                          <span className="text-[#72818A] block">Licensing Board:</span>
                          <strong className="text-[#293B42]">{licensingAuthority}</strong>
                        </div>
                        <div>
                          <span className="text-[#72818A] block">Jurisdiction:</span>
                          <strong className="text-[#293B42]">{countryJurisdiction}</strong>
                        </div>
                        <div>
                          <span className="text-[#72818A] block">Hospital:</span>
                          <strong className="text-[#293B42]">{hospitalInstitution}</strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-[#72818A] block">Institution:</span>
                          <strong className="text-[#293B42]">{researchInstitution}</strong>
                        </div>
                        <div>
                          <span className="text-[#72818A] block">Department:</span>
                          <strong className="text-[#293B42]">{department}</strong>
                        </div>
                        <div>
                          <span className="text-[#72818A] block">Academic Title:</span>
                          <strong className="text-[#293B42]">{researchRole}</strong>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E5EBE8]">
                    <span className="text-[#72818A] block mb-1">Attached Document:</span>
                    <div className="flex items-center gap-2 font-semibold text-[#2E5A44]">
                      <FileCheck2 className="w-4 h-4" />
                      <span>{uploadedFile?.name || 'No document attached'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF1D9] border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Notice: </strong>
                  Submission simulates credential review. In this prototype, approval is granted through the administrator demo panel at <Link to="/admin/verifications" className="underline font-bold">Admin Verifications</Link>.
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 rounded-full border border-[#E5EBE8] text-xs font-semibold text-[#72818A] hover:bg-[#FAFBF9] flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitVerification}
                    className="px-8 py-3 rounded-full bg-[#2E5A44] text-white text-xs font-bold hover:bg-[#244836] shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit for Verification</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
