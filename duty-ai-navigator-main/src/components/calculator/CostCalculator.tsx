
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SavedCalculationsModal from './SavedCalculationsModal';
import { useToast } from '@/hooks/use-toast';
import { formatDate, generateSimulationId } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import CostInput from './CostInput';
import { useLanguage } from '@/contexts/LanguageContext';

export interface CostItem {
  id: string;
  name: string;
  amount: number;
  currency: string;
  category: 'customs' | 'freight' | 'warehouse' | 'insurance' | 'other';
  exchangeRate?: number;
  exchangeDate?: Date;
  amountInKRW?: number;
}

export interface CalculationData {
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  importType: 'import' | 'export';
  incoterms: string;
  customsDuty?: number;
  vat?: number;
  costItems: CostItem[];
  totalCurrency: string;
  totalAmount: number;
  totalAmountInKRW?: number;
}

interface SavedCalculation {
  id: string;
  name: string;
  date: string;
  data: CalculationData;
}

const CostCalculator: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Load saved calculations from localStorage on component mount
  useEffect(() => {
    const savedCalcs = localStorage.getItem('savedCalculations');
    if (savedCalcs) {
      try {
        setSavedCalculations(JSON.parse(savedCalcs));
      } catch (error) {
        console.error('Failed to parse saved calculations:', error);
      }
    }
  }, []);

  const handleCalculate = (data: CalculationData) => {
    setCalculationData(data);
  };

  const handleSaveCalculation = (name: string) => {
    if (!calculationData) return;
    
    const newCalculation: SavedCalculation = {
      id: generateSimulationId(),
      name,
      date: formatDate(new Date()),
      data: calculationData
    };
    
    const updatedCalculations = [...savedCalculations, newCalculation];
    setSavedCalculations(updatedCalculations);
    
    // Save to localStorage
    try {
      localStorage.setItem('savedCalculations', JSON.stringify(updatedCalculations));
      toast({
        title: t("toast.calculator.save.success"),
        description: t("toast.calculator.save.description")
      });
    } catch (error) {
      console.error('Failed to save calculations to localStorage:', error);
      toast({
        title: t("toast.calculator.save.error"),
        description: t("toast.calculator.save.error.description"),
        variant: "destructive"
      });
    }
  };

  const handleLoadCalculation = (calculationData: CalculationData) => {
    setCalculationData(calculationData);
    setShowSavedModal(false);
    
    toast({
      title: t("toast.calculator.load.success"),
      description: t("toast.calculator.load.description")
    });
  };

  const handleDeleteCalculation = (id: string) => {
    const updatedCalculations = savedCalculations.filter(calc => calc.id !== id);
    setSavedCalculations(updatedCalculations);
    
    // Update localStorage
    try {
      localStorage.setItem('savedCalculations', JSON.stringify(updatedCalculations));
      toast({
        title: t("toast.calculator.delete.success"),
        description: t("toast.calculator.delete.description")
      });
    } catch (error) {
      console.error('Failed to update localStorage after deletion:', error);
      toast({
        title: t("toast.calculator.delete.error"),
        description: t("toast.calculator.delete.error.description"),
        variant: "destructive"
      });
    }
  };

  const handleGeneratePDF = () => {
    if (!calculationData) return;
    
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(t("calculator.heading"), 14, 22);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`${t("calculator.generatedDate")}: ${formatDate(new Date())}`, 14, 30);
      
      // Add basic info
      doc.setFontSize(12);
      doc.text(`${t("calculator.hsCode")}: ${calculationData.hsCode || 'N/A'}`, 14, 40);
      doc.text(`${t("calculator.importExport")}: ${calculationData.importType === 'import' ? t("simulation.result.import") : t("simulation.result.export")}`, 14, 46);
      doc.text(`${t("calculator.incoterms")}: ${calculationData.incoterms}`, 14, 52);
      doc.text(`${t("calculator.origin")}: ${calculationData.originCountry}`, 14, 58);
      doc.text(`${t("calculator.destination")}: ${calculationData.destinationCountry}`, 14, 64);
      
      // Cost items table
      const tableColumn = [t("calculator.itemName"), t("calculator.category"), t("calculator.amount"), t("calculator.currency"), t("calculator.krwAmount")];
      const tableRows = calculationData.costItems.map(item => [
        item.name,
        getCategoryLabel(item.category),
        item.amount.toLocaleString(),
        item.currency,
        item.amountInKRW ? `${item.amountInKRW.toLocaleString()} KRW` : 'N/A'
      ]);
      
      // @ts-ignore: jspdf-autotable doesn't have TypeScript definitions
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { top: 10 },
      });
      
      // Add total
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text(`${t("calculator.totalCost")}: ${calculationData.totalAmount.toLocaleString()} ${calculationData.totalCurrency}`, 14, finalY);
      if (calculationData.totalAmountInKRW) {
        doc.text(`${t("calculator.krwEquivalent")}: ${calculationData.totalAmountInKRW.toLocaleString()} KRW`, 14, finalY + 8);
      }
      
      // Save the PDF
      doc.save(`${t("calculator.heading")}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      toast({
        title: t("toast.calculator.pdf.success"),
        description: t("toast.calculator.pdf.description")
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: t("toast.calculator.pdf.error"),
        description: t("toast.calculator.pdf.error.description"),
        variant: "destructive"
      });
    }
  };

  const getCategoryLabel = (category: string): string => {
    const categoryLabels: Record<string, string> = {
      'customs': t("calculator.category.customs"),
      'freight': t("calculator.category.freight"),
      'warehouse': t("calculator.category.warehouse"),
      'insurance': t("calculator.category.insurance"),
      'other': t("calculator.category.other")
    };
    return categoryLabels[category] || t("calculator.category.other");
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">{t("calculator.heading")}</h1>
        {/* Removed the redundant button */}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("calculator.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CostInput 
            onCalculate={handleCalculate}
            initialData={calculationData}
            onOpenSaved={() => setShowSavedModal(true)}
            onSave={handleSaveCalculation}
            onGeneratePDF={handleGeneratePDF}
          />
        </CardContent>
      </Card>

      <SavedCalculationsModal
        open={showSavedModal}
        onOpenChange={setShowSavedModal}
        savedCalculations={savedCalculations}
        onLoadCalculation={(data) => handleLoadCalculation(data)}
        onDeleteCalculation={handleDeleteCalculation}
      />
    </div>
  );
};

export default CostCalculator;
