
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Header: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">{t("appName")}</Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex space-x-6">
            <Link to="/simulation" className="hover:text-accent transition-colors">
              {t("simulation")}
            </Link>
            <Link to="/declaration" className="hover:text-accent transition-colors">
              {t("declaration")}
            </Link>
            <Link to="/calculator" className="hover:text-accent transition-colors">
              {t("calculator")}
            </Link>
          </nav>
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
