'use client';

import { useState } from 'react';
import { Upload, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInScale, accordionExpand, softSpring } from '@/lib/motion';

export default function AccreditationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    nin: '',
    email: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full legal name is required (minimum 3 characters)';
    }
    if (formData.organization.trim().length < 2) {
      newErrors.organization = 'Media or press organization name is required';
    }
    if (!/^\d{11}$/.test(formData.nin.trim())) {
      newErrors.nin = 'National Identity Number (NIN) must be exactly 11 digits';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Valid editorial email address is required';
    }
    if (!file) {
      newErrors.file = 'Official assignment letter or press credential (PDF) is required';
    } else {
      const isPdf =
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        newErrors.file = 'Uploaded credential must be a valid PDF document';
      } else if (file.size > 5 * 1024 * 1024) {
        newErrors.file = 'File size exceeds 5MB limit. Please compress your PDF.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1200);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isSuccess ? (
        <motion.div
          key="success-message"
          variants={fadeInScale}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-white border border-[#B8D8C5] rounded-2xl p-8 sm:p-12 text-center shadow-card"
        >
          <div className="w-16 h-16 bg-[#D8EADF] text-[#1E4D38] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-[#111827] mb-2">
            Accreditation Dossier Received
          </h3>
          <p className="text-[#4B5563] text-sm sm:text-base max-w-md mx-auto mb-6">
            Your press application has been logged with the Media Directorate. Verified
            credentials and badge pickup barcodes will be dispatched via email within 48 hours.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ fullName: '', organization: '', nin: '', email: '' });
              setFile(null);
              setErrors({});
            }}
            className="px-6 py-3 bg-[#1E4D38] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-opacity-90 transition-opacity"
          >
            Submit Another Application
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form-container"
          variants={fadeInScale}
          initial="initial"
          animate="animate"
          exit="exit"
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 shadow-card space-y-6"
        >
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2"
            >
              Full Legal Name *
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-xl bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D38] ${
                errors.fullName ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
              placeholder="e.g. Ibrahim Danladi Bello"
            />
            <AnimatePresence>
              {errors.fullName && (
                <motion.p
                  variants={accordionExpand}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-1 text-xs text-red-600 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {errors.fullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="organization"
                className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2"
              >
                Press / Media House *
              </label>
              <input
                type="text"
                id="organization"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D38] ${
                  errors.organization ? 'border-red-500' : 'border-[#E5E7EB]'
                }`}
                placeholder="e.g. Nigerian Television Authority (NTA)"
              />
              <AnimatePresence>
                {errors.organization && (
                  <motion.p
                    variants={accordionExpand}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mt-1 text-xs text-red-600 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {errors.organization}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label
                htmlFor="nin"
                className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2"
              >
                11-Digit National Identity Number (NIN) *
              </label>
              <input
                type="text"
                id="nin"
                maxLength={11}
                value={formData.nin}
                onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D38] ${
                  errors.nin ? 'border-red-500' : 'border-[#E5E7EB]'
                }`}
                placeholder="11 digits without spaces"
              />
              <AnimatePresence>
                {errors.nin && (
                  <motion.p
                    variants={accordionExpand}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mt-1 text-xs text-red-600 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {errors.nin}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2"
            >
              Editorial Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl bg-[#FBFBFA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D38] ${
                errors.email ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
              placeholder="editor@organization.ng"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  variants={accordionExpand}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-1 text-xs text-red-600 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Drag & Drop PDF Credential Intake */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-2">
              Assignment Letter or Press ID (PDF, Max 5MB) *
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                errors.file
                  ? 'border-red-400 bg-red-50/50'
                  : file
                  ? 'border-[#1E4D38] bg-[#D8EADF]/20'
                  : 'border-[#B8D8C5] bg-[#FBFBFA] hover:bg-[#D8EADF]/10'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileCheck className="w-10 h-10 text-[#1E4D38]" />
                  <span className="font-semibold text-sm text-[#111827]">
                    {file.name}
                  </span>
                  <span className="text-xs text-[#4B5563]">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-red-600 hover:underline mt-1"
                  >
                    Replace file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-[#4B5563]" />
                  <div>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-sm font-semibold text-[#1E4D38] hover:underline"
                    >
                      Click to select a file
                    </label>
                    <span className="text-sm text-[#4B5563]"> or drag and drop</span>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Official letterhead on PDF format only (maximum 5MB)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <AnimatePresence>
              {errors.file && (
                <motion.p
                  variants={accordionExpand}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-1 text-xs text-red-600 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {errors.file}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#FEF3D6] hover:bg-[#FCE6A8] text-[#8D6B1B] text-sm font-bold uppercase tracking-wider rounded-xl transition-all border border-[#FCE6A8] shadow-button hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying Dossier...' : 'Submit Accreditation Request'}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
