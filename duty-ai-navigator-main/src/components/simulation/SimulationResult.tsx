
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Check, Copy, FileIcon, FileText, File, FileX, Save, FolderOpen, Info } from 'lucide-react';
import SavedSimulationModal from './SavedSimulationModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';

interface SimulationResultProps {
  data: any;
  onBack: () => void;
  onSave: (name: string) => void;
  savedSimulations: any[];
  onLoadSimulation: (simulation: any) => void;
  onDeleteSimulation: (id: string) => void;
}

type DocumentType = 'invoice' | 'packing' | 'bl' | 'other';

const SimulationResult: React.FC<SimulationResultProps> = ({ 
  data, 
  onBack, 
  onSave,
  savedSimulations,
  onLoadSimulation,
  onDeleteSimulation
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [simulationName, setSimulationName] = useState("");
  const [showCopied, setShowCopied] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType>(data.documentType || 'other');
  const [showModal, setShowModal] = useState(false);
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  
  const handleSave = () => {
    if (!simulationName.trim()) {
      toast({
        title: t("toast.save.error"),
        description: t("toast.save.description.error"),
        variant: "destructive"
      });
      return;
    }
    
    onSave(simulationName);
    setSimulationName("");
    
    toast({
      title: t("toast.save.success"),
      description: t("toast.save.description.success"),
    });
  };

  const copyToClipboard = () => {
    const textToCopy = `
${t("simulation.result.hsCode")}: ${data.hsCode}
${t("simulation.result.productName")}: ${data.productName}
${t("simulation.result.appliedRate")}: ${data.ftaRate !== null ? data.ftaRate : data.baseRate}%
${t("simulation.result.estimatedDuty")}: ${Number(data.estimatedDuty).toLocaleString()} ${t("currency.KRW")}
${t("simulation.result.value")}: $${data.value} USD
    `;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };
  
  // Get file icon based on file type - Fixed the undefined file issue
  const getFileIcon = (file: File | null) => {
    if (!file) return <FileX className="h-8 w-8 text-gray-400" />;
    
    // Make sure file.name exists before calling split
    const extension = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
    
    if (extension === 'pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <FileIcon className="h-8 w-8 text-blue-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Get document type label
  const getDocumentTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case 'invoice': return t("simulation.documentType.invoice");
      case 'packing': return t("simulation.documentType.packing");
      case 'bl': return t("simulation.documentType.bl");
      case 'other': return t("simulation.documentType.other");
      default: return t("unknown");
    }
  };

  // Update document type handler
  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value as DocumentType);
    
    // This would normally update the parent component's state as well
    // For demo purposes we're just showing the toast
    toast({
      title: t("toast.calculator.documentType"),
      description: t("toast.calculator.documentType.description").replace("{type}", getDocumentTypeLabel(value as DocumentType))
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">{t("simulation.step3")}</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FolderOpen className="h-4 w-4" />
          {t("simulation.result.loadSaved")}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{t("simulation.result.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{t("simulation.result.analysis")}</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={copyToClipboard}
                  >
                    {showCopied ? <Check size={16} /> : <Copy size={16} />}
                    {showCopied ? t("simulation.result.copied") : t("simulation.result.copy")}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">{t("simulation.result.hsCode")}</Label>
                    <p className="text-lg font-semibold">{data.hsCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">{t("simulation.result.productName")}</Label>
                    <p className="text-lg">{data.productName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">{t("simulation.result.importType")}</Label>
                    <p className="text-lg">{data.importType === 'import' ? t("simulation.result.import") : t("simulation.result.export")}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">{t("simulation.result.originCountry")}</Label>
                    <p className="text-lg">
                      {data.originCountry === 'US' ? t("country.US") : 
                       data.originCountry === 'CN' ? t("country.CN") : 
                       data.originCountry === 'JP' ? t("country.JP") : 
                       data.originCountry === 'KR' ? t("country.KR") : 
                       data.originCountry}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">{t("simulation.result.value")}</Label>
                    <p className="text-lg">${data.value} USD</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">{t("simulation.result.confidence")}</Label>
                    <p className="text-lg">{data.confidenceScore}%</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("simulation.result.customsInfo")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">{t("simulation.result.baseRate")}</Label>
                      <p className="text-lg">{data.baseRate}%</p>
                    </div>
                    {data.ftaRate !== null && (
                      <div>
                        <Label className="text-sm text-gray-500">{t("simulation.result.ftaRate")}</Label>
                        <p className="text-lg text-green-600 font-semibold">{data.ftaRate}%</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-md">
                    <Label className="text-sm text-gray-500">{t("simulation.result.estimatedDuty")}</Label>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-accent">
                        {Number(data.estimatedDuty).toLocaleString()} 원
                      </p>
                      <p className="ml-2 text-sm text-gray-500">
                        {t("simulation.result.appliedRate")}: {data.ftaRate !== null ? data.ftaRate : data.baseRate}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {data.aiReasoning && (
                  <Collapsible 
                    open={isReasoningOpen} 
                    onOpenChange={setIsReasoningOpen}
                    className="mt-4 border rounded-md"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left border-b bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span className="font-medium">{t("simulation.result.reasoning")}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {isReasoningOpen ? t("simulation.result.collapse") : t("simulation.result.expand")}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 text-sm overflow-auto max-h-[500px] whitespace-pre-wrap">
                      {data.aiReasoning}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Only render the file card if data.file exists */}
          {data.file && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t("simulation.result.uploadedDocs")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {getFileIcon(data.file)}
                  <div className="flex-1">
                    <p className="font-medium">{data.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(data.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="min-w-[180px]">
                    <Select 
                      value={documentType} 
                      onValueChange={handleDocumentTypeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("simulation.documentType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">{t("simulation.documentType.invoice")}</SelectItem>
                        <SelectItem value="packing">{t("simulation.documentType.packing")}</SelectItem>
                        <SelectItem value="bl">{t("simulation.documentType.bl")}</SelectItem>
                        <SelectItem value="other">{t("simulation.documentType.other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("simulation.documentType.aiDetected")}: {getDocumentTypeLabel(documentType)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex gap-4 mt-6">
            <div className="w-full">
              <Label htmlFor="simulationName">{t("simulation.result.saveSimulation")}</Label>
              <div className="flex mt-1">
                <Input 
                  id="simulationName" 
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  placeholder={t("simulation.result.simulationName")}
                  className="rounded-r-none"
                />
                <Button 
                  onClick={handleSave} 
                  className="rounded-l-none flex items-center gap-1"
                >
                  <Save size={16} />
                  {t("simulation.result.save")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline"
        >
          {t("simulation.result.prev")}
        </Button>
        <Link to="/declaration" state={{ simulationData: data }}>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent-dark"
          >
            {t("simulation.result.declare")}
          </Button>
        </Link>
      </div>

      <SavedSimulationModal
        open={showModal}
        onOpenChange={setShowModal}
        savedSimulations={savedSimulations}
        onLoadSimulation={onLoadSimulation}
        onDeleteSimulation={onDeleteSimulation}
      />
    </div>
  );
};

export default SimulationResult;
