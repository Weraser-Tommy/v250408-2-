
import React from 'react';
import Layout from '@/components/layout/Layout';
import CostCalculator from '@/components/calculator/CostCalculator';
import { useLanguage } from '@/contexts/LanguageContext';

const CalculatorPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">{t("calculator.heading")}</h1>
        <CostCalculator />
      </div>
    </Layout>
  );
};

export default CalculatorPage;
