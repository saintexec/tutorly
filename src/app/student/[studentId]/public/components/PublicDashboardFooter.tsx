'use client';

import React from 'react';

interface Props {
  tutorName: string;
  tutorWhatsApp: string;
}

export default function PublicDashboardFooter({ tutorName, tutorWhatsApp }: Props) {
  const handleWhatsAppClick = () => {
    if (!tutorWhatsApp) return;

    const message = `Hi ${tutorName}, I have a question about my child's learning progress. 👋`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${tutorWhatsApp.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border-t border-gray-100 text-center space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7F8C8D] opacity-60">Have any questions?</p>
        <h3 className="text-xl font-bold text-[#1E3A5F]">Contact {tutorName}</h3>
      </div>
      
      {tutorWhatsApp && (
        <button
          onClick={handleWhatsAppClick}
          className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 w-full max-w-md mx-auto transition-all active:scale-95 shadow-lg shadow-[#25D366]/20"
        >
          <span className="material-symbols-outlined fill-white">chat</span>
          Message on WhatsApp
        </button>
      )}
      
      <div className="pt-8 border-t border-gray-50">
        <div className="flex items-center justify-center gap-2 text-[#1E3A5F] opacity-40 grayscale group hover:grayscale-0 transition-all">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity">Powered by Tutorly</p>
        </div>
      </div>
    </div>
  );
}
