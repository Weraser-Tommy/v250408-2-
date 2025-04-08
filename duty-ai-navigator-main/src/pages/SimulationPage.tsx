import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SimulationInput from '@/components/simulation/SimulationInput';
import SimulationAnalysis from '@/components/simulation/SimulationAnalysis';
import SimulationResult from '@/components/simulation/SimulationResult';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { formatDate, generateSimulationId } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface SavedSimulation {
  id: string;
  name: string;
  date: string;
  data: any;
}

const SimulationPage: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('input');
  const [inputData, setInputData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  
  // Load saved simulations from localStorage on component mount
  useEffect(() => {
    const savedSims = localStorage.getItem('savedSimulations');
    if (savedSims) {
      try {
        setSavedSimulations(JSON.parse(savedSims));
      } catch (error) {
        console.error('Failed to parse saved simulations:', error);
      }
    }
  }, []);

  // Check if we should return to results tab from declaration page
  useEffect(() => {
    if (location.state?.returnToResults && location.state?.simulationData) {
      // Set the simulation data and go straight to the results tab
      const simData = location.state.simulationData;
      setInputData({
        importType: simData.importType,
        description: simData.description,
        productName: simData.productName,
        originCountry: simData.originCountry,
        value: simData.value,
        valueUSD: simData.value,
        file: simData.file,
        documentType: simData.documentType
      });
      setAnalysisData(simData);
      setActiveTab('result');
      
      // Clear the location state to prevent repeated redirects on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  const handleInputNext = (data: any) => {
    // Value is now directly in USD
    setInputData({
      ...data,
      valueUSD: data.value
    });
    setActiveTab('analysis');
  };
  
  const handleAnalysisNext = (data: any) => {
    setAnalysisData(data);
    setActiveTab('result');
  };
  
  const handleBackToInput = () => {
    setActiveTab('input');
  };
  
  const handleBackToAnalysis = () => {
    // ... keep existing code (function for returning to analysis)
    if (!analysisData && inputData) {
      setAnalysisData(inputData);
    }
    setActiveTab('analysis');
  };
  
  const handleSaveSimulation = (name: string) => {
    const newSimulation = {
      id: generateSimulationId(),
      name,
      date: formatDate(new Date()),
      data: { 
        ...analysisData,
        // Include aiReasoning in the saved data
        aiReasoning: analysisData.aiReasoning || '',
        // Include productName in the saved data
        productName: analysisData.productName || '',
        // When saving to localStorage, we can't include the actual File object
        file: analysisData.file ? {
          name: analysisData.file.name,
          size: analysisData.file.size,
          type: analysisData.file.type
        } : null
      }
    };
    
    const updatedSimulations = [...savedSimulations, newSimulation];
    setSavedSimulations(updatedSimulations);
    
    // Save to localStorage
    try {
      localStorage.setItem('savedSimulations', JSON.stringify(updatedSimulations));
    } catch (error) {
      console.error('Failed to save simulations to localStorage:', error);
      toast({
        title: t("toast.save.error"),
        description: t("toast.save.description.error"),
        variant: "destructive"
      });
    }
  };
  
  const handleLoadSimulation = (data: any) => {
    // ... keep existing code (simulation loading)
    setInputData({
      importType: data.importType,
      description: data.description,
      productName: data.productName || '',
      originCountry: data.originCountry,
      value: data.value,
      valueUSD: data.valueUSD,
      file: null,
      documentType: data.documentType
    });
    
    setAnalysisData(data);
    
    if (!data.hsCode) {
      setActiveTab('input');
    } else {
      toast({
        title: t("toast.load.success"),
        description: t("toast.load.description")
      });
      setActiveTab('result');
    }
  };

  const handleDeleteSimulation = (id: string) => {
    // ... keep existing code (simulation deletion)
    const updatedSimulations = savedSimulations.filter(sim => sim.id !== id);
    setSavedSimulations(updatedSimulations);
    
    try {
      localStorage.setItem('savedSimulations', JSON.stringify(updatedSimulations));
      toast({
        title: t("toast.delete.success"),
        description: t("toast.delete.description.success")
      });
    } catch (error) {
      console.error('Failed to update localStorage after deletion:', error);
      toast({
        title: t("toast.delete.error"),
        description: t("toast.delete.description.error"),
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">{t("simulation.heading")}</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="input" disabled={activeTab !== 'input'}>
              {t("simulation.step1")}
            </TabsTrigger>
            <TabsTrigger value="analysis" disabled={activeTab !== 'analysis'}>
              {t("simulation.step2")}
            </TabsTrigger>
            <TabsTrigger value="result" disabled={activeTab !== 'result'}>
              {t("simulation.step3")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input">
            <SimulationInput 
              onNext={handleInputNext} 
              savedSimulations={savedSimulations}
              onLoadSimulation={handleLoadSimulation}
              onDeleteSimulation={handleDeleteSimulation}
            />
          </TabsContent>
          
          <TabsContent value="analysis">
            {inputData && (
              <SimulationAnalysis 
                inputData={analysisData || inputData}
                onNext={handleAnalysisNext} 
                onBack={handleBackToInput}
              />
            )}
          </TabsContent>
          
          <TabsContent value="result">
            {analysisData && (
              <SimulationResult 
                data={analysisData} 
                onBack={handleBackToAnalysis}
                onSave={handleSaveSimulation}
                savedSimulations={savedSimulations}
                onLoadSimulation={handleLoadSimulation}
                onDeleteSimulation={handleDeleteSimulation}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SimulationPage;
