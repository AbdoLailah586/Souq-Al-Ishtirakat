import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();

  const defaultMessage = encodeURIComponent(
    'مرحباً، أود الاستفسار عن الاشتراكات والعروض المتاحة في موقع سوق الاشتراكات.'
  );

  return (
    <aside aria-label="مساعدة الدعم الفني" className="fixed bottom-6 left-6 z-40 flex items-center group">
      <a
        href={`https://wa.me/${settings.whatsappSupportNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20"
        aria-label="تواصل معنا عبر واتساب"
      >
        {/* Pulsing Aura */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none"></span>

        <MessageCircle className="w-7 h-7 fill-white/10" />

        {/* Floating Tooltip */}
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-bazaar-card/95 border border-emerald-500/40 text-emerald-300 text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          تواصل مع الدعم الفني 💬
        </span>
      </a>
    </aside>
  );
};
