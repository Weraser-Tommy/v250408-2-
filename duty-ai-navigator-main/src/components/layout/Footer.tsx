
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-secondary text-white py-4 px-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">{t("footer.copyright")}</p>
        <p className="text-xs text-gray-400 mt-1">{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
};

export default Footer;
