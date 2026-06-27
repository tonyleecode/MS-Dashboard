import React from 'react';
import { Phone } from 'lucide-react';
import zaloIcon from '../assets/images/MS-zalo-icon.webp';
import messengerIcon from '../assets/images/MS-icon-messenger.webp';
import { COMPANY_INFO } from '../constants/companyInfo';

export const FloatingContact: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 print:hidden">
      <a 
        href={COMPANY_INFO.socials.messenger} 
        target="_blank" 
        rel="noreferrer"
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center p-2 hover:scale-110 transition-transform border border-outline-variant relative group"
        title="Messenger"
      >
        <img src={messengerIcon} alt="Messenger" className="w-full h-full object-contain animate-ring group-hover:animate-none" />
      </a>

      <a 
        href={COMPANY_INFO.socials.zalo} 
        target="_blank" 
        rel="noreferrer"
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center p-2 hover:scale-110 transition-transform border border-outline-variant relative group"
        title="Zalo"
      >
        <img src={zaloIcon} alt="Zalo" className="w-full h-full object-contain animate-ring group-hover:animate-none" style={{ animationDelay: '0.2s' }} />
      </a>

      <a 
        href={`tel:${COMPANY_INFO.hotline.replace(/\D/g, '')}`} 
        className="w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform shadow-primary/30 relative group"
        title="Hotline"
      >
        <Phone className="w-5 h-5 fill-current animate-ring group-hover:animate-none" style={{ animationDelay: '0.4s' }} />
      </a>
    </div>
  );
};
