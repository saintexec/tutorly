"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    level: "SPM",
    customLevel: "",
    parent_whatsapp: "",
    session_rate: "0",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const finalLevel = formData.level === "Other/Custom" ? formData.customLevel : formData.level;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase
        .from("students")
        .insert({
          tutor_id: user.id,
          name: formData.name,
          subject: formData.subject,
          level: finalLevel,
          parent_whatsapp: formData.parent_whatsapp,
          session_rate: parseFloat(formData.session_rate),
          payment_status: "unpaid",
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/20 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md shadow-ambient-lg overflow-hidden border border-outline-variant/30">
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <h2 className="font-800 text-lg text-on-surface tracking-tight">Add New Student</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant">Full Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Nurul Huda"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-transparent focus:border-outline focus:bg-surface-container-lowest text-sm outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant">Subject</label>
              <input
                required
                type="text"
                placeholder="e.g. Add Maths"
                className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-transparent focus:border-outline focus:bg-surface-container-lowest text-sm outline-none transition-all"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant">Level</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-transparent focus:border-outline focus:bg-surface-container-lowest text-sm outline-none transition-all"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="SPM">SPM</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="Other/Custom">Other/Custom</option>
                </select>
              </div>

              {formData.level === "Other/Custom" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant">Custom Level</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. IB Higher"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-transparent focus:border-outline focus:bg-surface-container-lowest text-sm outline-none transition-all"
                    value={formData.customLevel}
                    onChange={(e) => setFormData({ ...formData, customLevel: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant">Parent WhatsApp</label>
            <input
              type="tel"
              placeholder="e.g. +60123456789"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-transparent focus:border-outline focus:bg-surface-container-lowest text-sm outline-none transition-all"
              value={formData.parent_whatsapp}
              onChange={(e) => setFormData({ ...formData, parent_whatsapp: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-800 uppercase tracking-widest text-on-surface-variant">Session Rate (RM)</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-transparent focus:border-outline focus:bg-surface-container-lowest text-sm outline-none transition-all"
              value={formData.session_rate}
              onChange={(e) => setFormData({ ...formData, session_rate: e.target.value })}
            />
          </div>

          {error && <p className="text-xs text-error font-600">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-700 text-sm hover:bg-surface-container transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary-container text-white font-700 text-sm hover:bg-primary transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
