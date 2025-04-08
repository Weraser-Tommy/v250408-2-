
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <ToggleGroup 
      type="single" 
      value={language} 
      onValueChange={(value) => {
        if (value === 'en' || value === 'ko') {
          setLanguage(value);
        }
      }}
      className="border rounded-md"
    >
      <ToggleGroupItem value="en" aria-label="Toggle English" className="px-3 py-1 text-sm">
        EN
      </ToggleGroupItem>
      <ToggleGroupItem value="ko" aria-label="Toggle Korean" className="px-3 py-1 text-sm">
        KO
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default LanguageToggle;
