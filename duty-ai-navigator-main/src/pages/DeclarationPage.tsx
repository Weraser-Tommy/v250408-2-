
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download, Save, Upload, FileCheck, AlertCircle, Eye, X, Trash, FolderOpen } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import DeclarationForm from '@/components/declaration/DeclarationForm';
import DeclarationCertificate from '@/components/declaration/DeclarationCertificate';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SavedDeclarationModal from '@/components/declaration/SavedDeclarationModal';
import { formatDate, generateSimulationId } from '@/lib/utils';

interface SimulationData {
  importType: "import" | "export";
  description: string;
  originCountry: string;
  value: string;
  hsCode?: string;
  productName?: string;
  baseRate?: string;
  ftaRate?: string;
  estimatedDuty?: string;
  file?: File;
  documentType?: 'invoice' | 'packing' | 'bl' | 'other';
  declarationDate?: string;
  exchangeRate?: number;
}

export interface DocumentFile {
  name: string;
  file: File | null;
  required: boolean;
  status: 'pending' | 'uploaded' | 'scanning' | 'scanned' | 'error';
  type: 'invoice' | 'packing' | 'bl' | 'other';
  fileName?: string;
}

export interface DeclarationFormData {
  declarationType: "import" | "export";
  declarationNumber: string;
  declarationDate: string;
  
  // 공통 필드
  company: string;
  businessNumber: string;
  hsCode: string;
  itemName: string;
  countryOrigin: string;
  itemType: string;
  itemQuantity: string;
  itemUnit: string;
  itemPrice: string;
  itemDescription: string;
  transactionType: string;
  paymentMethod: string;
  incoterms: string;
  tradeCountry: string;
  grossWeight?: string;
  netWeight?: string;
  freightAmount?: string;
  insuranceAmount?: string;
  
  // 수입신고 관련 필드
  declarerName: string;
  declarerCode: string;
  customsOffice?: string;
  customsOfficer?: string;
  clearanceDate?: string;
  blNumber?: string;
  cargoControlNumber?: string;
  arrivalDate?: string;
  entryDate?: string;
  transportType?: string;
  vesselName?: string;
  masterBlNumber?: string;
  carrierCode?: string;
  inspectionLocation?: string;
  arrivalPort?: string;
  loadingCountry?: string;
  importerName?: string;
  taxPayer?: string;
  taxPayerCode?: string;
  forwarderName?: string;
  forwarderCode?: string;
  foreignSupplier?: string;
  foreignSupplierCode?: string;
  tradeName?: string;
  brandName?: string;
  modelSpec?: string;
  composition?: string;
  totalPackages?: string;
  packageUnit?: string;
  dutyRate?: string;
  taxationType?: string;
  reductionRate?: string;
  taxAmount?: string;
  totalTaxAmount?: string;
  taxableValue?: string;
  csInspection?: string;
  totalDeclaredValue?: string;
  exchangeRate?: string;
  additionalAmount?: string;
  importDeclarationType?: string;
  currency?: string;
  importRequirements?: string;
  requirementNumber?: string;
  paymentNumber?: string;
  collectionType?: string;
  originCertificate?: string;
  voyageNumber?: string;
  portLoading?: string;
  portDischarge?: string;
  containerNumber?: string;
  sealNumber?: string;
  
  // 수출신고 관련 필드
  declarantName?: string;
  declarantCode?: string;
  customsOfficeDept?: string;
  exportAgent?: string;
  exportAgentCode?: string;
  manufacturer?: string;
  manufacturerCode?: string;
  buyerName?: string;
  buyerCode?: string;
  destinationCountry?: string;
  loadingCountryExport?: string;
  expectedBondedArea?: string;
  itemLocation?: string;
  itemNameEng?: string;
  tradeNameEng?: string;
  modelSpecEng?: string;
  invoiceNumber?: string;
  exportQuantity?: string;
  exportUnit?: string;
  unitPrice?: string;
  netWeightExport?: string;
  amountExport?: string;
  totalWeightExport?: string;
  totalPackagesExport?: string;
  exportDeclarationType?: string;
  csTypeExport?: string;
  paymentMethodExport?: string;
  totalDeclaredPrice?: string;
  freightAmountExport?: string;
  insuranceAmountExport?: string;
  incotermsCurrencyAmount?: string;
  refundApplication?: string;
  originCriteriaExport?: string;
  warehouseLocation?: string;
  shipperName?: string;
  consigneeName?: string;
}

interface SavedDeclaration {
  id: string;
  name: string;
  date: string;
  formData: DeclarationFormData;
  documents?: DocumentFile[];
}

const DeclarationPage: React.FC = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [scanningProgress, setScanningProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [documentsReady, setDocumentsReady] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [savedDeclarations, setSavedDeclarations] = useState<SavedDeclaration[]>([]);
  const [cameFromSimulation, setCameFromSimulation] = useState(false);

  const [documents, setDocuments] = useState<DocumentFile[]>([
    { name: 'Commercial Invoice', file: null, required: true, status: 'pending', type: 'invoice' },
    { name: 'Packing List', file: null, required: true, status: 'pending', type: 'packing' },
    { name: 'Bill of Lading (B/L)', file: null, required: true, status: 'pending', type: 'bl' }
  ]);

  const [formData, setFormData] = useState<DeclarationFormData>({
    declarationType: "import",
    declarationNumber: "",
    declarationDate: new Date().toISOString().split('T')[0],
    declarerName: "",
    declarerCode: "",
    company: "",
    businessNumber: "",
    hsCode: "",
    countryOrigin: "",
    itemType: "",
    itemName: "",
    itemQuantity: "",
    itemUnit: "",
    itemPrice: "",
    itemDescription: "",
    transactionType: "",
    paymentMethod: "",
    incoterms: "",
    tradeCountry: ""
  });

  useEffect(() => {
    const savedDecs = localStorage.getItem('savedDeclarations');
    if (savedDecs) {
      try {
        setSavedDeclarations(JSON.parse(savedDecs));
      } catch (error) {
        console.error('Failed to parse saved declarations:', error);
      }
    }
  }, []);

  useEffect(() => {
    const simulationData = location.state?.simulationData as SimulationData | undefined;
    
    if (simulationData) {
      setCameFromSimulation(true);
      setFormData(prev => ({
        ...prev,
        declarationType: simulationData.importType,
        hsCode: simulationData.hsCode || "",
        countryOrigin: simulationData.originCountry || "",
        itemName: simulationData.productName || "",
        itemPrice: simulationData.value || "",
        itemDescription: simulationData.description || "",
        tradeCountry: simulationData.importType === "import" ? simulationData.originCountry : "US",
        declarationDate: simulationData.declarationDate 
          ? new Date(simulationData.declarationDate).toISOString().split('T')[0]
          : prev.declarationDate
      }));
      
      if (simulationData.file && simulationData.documentType) {
        const fileToUpload = simulationData.file;
        const documentType = simulationData.documentType;
        
        let documentIndex = -1;
        
        if (documentType === 'invoice') {
          documentIndex = 0;
        } else if (documentType === 'packing') {
          documentIndex = 1;
        } else if (documentType === 'bl') {
          documentIndex = 2;
        }
        
        if (documentType === 'other') {
          // Add a new document instead of modifying an existing one
          setDocuments(prev => [
            ...prev,
            { 
              name: '추가 서류', 
              file: fileToUpload, 
              fileName: fileToUpload.name,
              required: false, 
              status: 'uploaded' as const, 
              type: 'other' 
            }
          ]);
        } else if (documentIndex >= 0) {
          setDocuments(prev => {
            const updatedDocs = [...prev];
            updatedDocs[documentIndex] = { 
              ...updatedDocs[documentIndex], 
              file: fileToUpload,
              fileName: fileToUpload.name,
              status: 'uploaded' as const 
            };
            return updatedDocs;
          });
        }
        
        // Check if any required document is uploaded
        setDocumentsReady(true);
      }
      
      toast({
        title: "시뮬레이션 데이터 불러오기 완료",
        description: "관세 시뮬레이션에서 입력한 정보가 적용되었습니다.",
      });
    }
  }, [location.state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: 'invoice' | 'packing' | 'bl' | 'other') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedDocuments = documents.map(doc => {
        if (doc.type === documentType) {
          return { 
            ...doc, 
            file, 
            fileName: file.name, 
            status: 'uploaded' as const 
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      
      toast({
        title: "파일 업로드 완료",
        description: `${file.name} 파일이 업로드되었습니다.`,
      });

      const allRequiredUploaded = updatedDocuments
        .filter(doc => doc.required)
        .every(doc => doc.status === 'uploaded');
      
      setDocumentsReady(allRequiredUploaded);
    }
  };

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      { name: '추가 서류', file: null, required: false, status: 'pending', type: 'other' }
    ]);
  };

  const handleDeleteDocument = (index: number) => {
    // Check if the index is valid
    if (index < 0 || index >= documents.length) {
      console.error('Invalid document index:', index);
      return;
    }
    
    const doc = documents[index];
    
    if (!doc.required) {
      const updatedDocuments = [...documents];
      updatedDocuments.splice(index, 1);
      setDocuments(updatedDocuments);
      
      toast({
        title: "서류 삭제 완료",
        description: "업로드된 서류가 삭제되었습니다.",
      });
    } else {
      const updatedDocuments = [...documents];
      updatedDocuments[index] = { 
        ...documents[index], 
        file: null, 
        fileName: undefined,
        status: 'pending' 
      };
      setDocuments(updatedDocuments);
      
      const allRequiredUploaded = updatedDocuments
        .filter(doc => doc.required)
        .every(doc => doc.status === 'uploaded');
      
      setDocumentsReady(allRequiredUploaded);
      
      toast({
        title: "서류 초기화 완료",
        description: "필수 서류가 초기화되었습니다.",
      });
    }
  };

  const simulateAIScanning = () => {
    if (!documentsReady) {
      toast({
        title: "필수 서류 누락",
        description: "모든 필수 서류를 업로드해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    let progress = 0;
    
    setDocuments(prev => prev.map(doc => 
      doc.status === 'uploaded' ? { ...doc, status: 'scanning' as const } : doc
    ));

    const interval = setInterval(() => {
      progress += 5;
      setScanningProgress(progress);

      if (progress === 40) {
        setDocuments(prev => {
          const newDocs = [...prev];
          if (newDocs[0] && newDocs[0].status === 'scanning') newDocs[0].status = 'scanned';
          return newDocs;
        });
      } else if (progress === 70) {
        setDocuments(prev => {
          const newDocs = [...prev];
          if (newDocs[1] && newDocs[1].status === 'scanning') newDocs[1].status = 'scanned';
          return newDocs;
        });
      } else if (progress === 90) {
        setDocuments(prev => {
          const newDocs = [...prev];
          if (newDocs[2] && newDocs[2].status === 'scanning') newDocs[2].status = 'scanned';
          return newDocs;
        });
      }

      if (progress >= 100) {
        clearInterval(interval);
        
        setTimeout(() => {
          setIsScanning(false);
          
          setFormData(prev => ({
            ...prev,
            declarerName: prev.declarerName || "KOREA TRADE CO., LTD.",
            declarerCode: prev.declarerCode || "KT12345",
            company: prev.company || (prev.declarationType === "import" ? "GLOBAL IMPORT INC." : "KOREA EXPORT CO., LTD."),
            businessNumber: prev.businessNumber || "123-45-67890",
            itemQuantity: prev.itemQuantity || "100",
            itemUnit: prev.itemUnit || "KG",
            transactionType: prev.transactionType || "11",
            paymentMethod: prev.paymentMethod || "L/C",
            incoterms: prev.incoterms || "FOB",
            shipperName: prev.shipperName || "GLOBAL SHIPPING CO.",
            consigneeName: prev.consigneeName || "KOREA CUSTOMS BROKER",
            transportType: prev.transportType || "Sea",
            vesselName: prev.vesselName || "EVERGREEN",
            voyageNumber: prev.voyageNumber || "EV2023001",
            portLoading: prev.portLoading || (prev.declarationType === "import" ? "SHANGHAI" : "BUSAN"),
            portDischarge: prev.portDischarge || (prev.declarationType === "import" ? "BUSAN" : "LOS ANGELES"),
            warehouseLocation: prev.warehouseLocation || "BUSAN PORT WAREHOUSE A",
            totalPackages: prev.totalPackages || "10",
            grossWeight: prev.grossWeight || "1050",
            netWeight: prev.netWeight || "1000",
            containerNumber: prev.containerNumber || "CSQU3054387",
            sealNumber: prev.sealNumber || "SL98765432"
          }));
          
          toast({
            title: "AI 스캐닝 완료",
            description: "업로드한 서류에서 정보를 추출했습니다. 필요한 경우 정보를 수정하세요.",
          });
        }, 1000);
      }
    }, 150);
  };
  
  const handleFormChange = (updatedData: Partial<DeclarationFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updatedData
    }));
  };
  
  const handleSave = () => {
    setSaveModalOpen(true);
  };

  const handleLoadDeclaration = (declaration: DeclarationFormData | SavedDeclaration) => {
    if ((declaration as any)._saveAction) {
      const name = (declaration as any)._saveName;
      
      if (!name.trim()) {
        toast({
          title: "저장 오류",
          description: "신고서 이름을 입력해주세요.",
          variant: "destructive"
        });
        return;
      }
      
      const newDeclaration: SavedDeclaration = {
        id: generateSimulationId(),
        name,
        date: formatDate(new Date()),
        formData,
        documents: documents.filter(doc => doc.file !== null)
      };
      
      const updatedDeclarations = [...savedDeclarations, newDeclaration];
      setSavedDeclarations(updatedDeclarations);
      
      try {
        localStorage.setItem('savedDeclarations', JSON.stringify(updatedDeclarations));
        console.log('Saved declarations to localStorage:', updatedDeclarations);
        toast({
          title: "저장 완료",
          description: "신고서가 성공적으로 저장되었습니다.",
        });
      } catch (error) {
        console.error('Failed to save declaration to localStorage:', error);
        toast({
          title: "저장 오류",
          description: "신고서를 저장하는 중에 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
      
      setSaveModalOpen(false);
      return;
    }
    
    if ('formData' in declaration) {
      const savedDeclaration = declaration as SavedDeclaration;
      setFormData(savedDeclaration.formData);
      
      if (savedDeclaration.documents && savedDeclaration.documents.length > 0) {
        const updatedDocuments = [...documents];
        
        savedDeclaration.documents.forEach(savedDoc => {
          const existingIndex = updatedDocuments.findIndex(doc => doc.type === savedDoc.type);
          
          if (existingIndex >= 0) {
            updatedDocuments[existingIndex] = { 
              ...savedDoc,
              status: savedDoc.file ? savedDoc.status : 'pending'
            };
          } else {
            updatedDocuments.push(savedDoc);
          }
        });
        
        setDocuments(updatedDocuments);
        
        const requiredDocsReady = updatedDocuments
          .filter(doc => doc.required)
          .some(doc => doc.status === 'uploaded' || doc.status === 'scanned');
        
        setDocumentsReady(requiredDocsReady);
      }
    } else {
      setFormData(declaration as DeclarationFormData);
    }
    
    setLoadModalOpen(false);
    
    toast({
      title: "불러오기 완료",
      description: "저장된 신고서를 불러왔습니다.",
    });
  };
  
  const handleDeleteDeclaration = (id: string) => {
    const updatedDeclarations = savedDeclarations.filter(dec => dec.id !== id);
    setSavedDeclarations(updatedDeclarations);
    
    try {
      localStorage.setItem('savedDeclarations', JSON.stringify(updatedDeclarations));
      toast({
        title: "삭제 완료",
        description: "신고서가 성공적으로 삭제되었습니다."
      });
    } catch (error) {
      console.error('Failed to update localStorage after deletion:', error);
      toast({
        title: "삭제 오류",
        description: "신고서를 삭제하는 중에 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };
  
  const handleSubmit = () => {
    toast({
      title: "제출 완료",
      description: "신고서가 제출되었습니다.",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF 다운로드",
      description: "신고서 PDF 다운로드가 시작되었습니다.",
    });
  };
  
  const openPreviewModal = () => {
    setPreviewOpen(true);
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'scanning':
        return <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-green-500" />;
      case 'scanned':
        return <FileCheck className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Upload className="h-5 w-5" />;
    }
  };

  const handleBackToSimulation = () => {
    if (location.state?.simulationData) {
      navigate('/simulation', { state: { returnToResults: true, simulationData: location.state.simulationData } });
    } else {
      navigate('/simulation');
    }
  };

  // Function to safely access document at index, checking bounds first
  const safeGetDocument = (index: number) => {
    if (index >= 0 && index < documents.length) {
      return documents[index];
    }
    return null;
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">신고서 작성</h1>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>관세 신고서 작성</CardTitle>
                <CardDescription>
                  수입/수출 신고서를 작성하여 통관 절차를 진행하세요.
                </CardDescription>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setLoadModalOpen(true)}
                className="flex items-center"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                저장된 신고서 불러오기
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border p-4 rounded-md mb-6 bg-blue-50">
              <h3 className="font-medium mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                통관 필수 서류 업로드
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                정확한 신고서 작성을 위해 필수 서류를 업로드해주세요. AI가 자동으로 서류를 분석하여 신고서에 필요한 정보를 추출합니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* First document - Only render if it exists */}
                {safeGetDocument(0) && (
                  <div className="flex items-center justify-between border bg-white p-3 rounded-md">
                    <div className="flex items-center overflow-hidden">
                      {getDocumentStatusIcon(safeGetDocument(0)!.status)}
                      <span className="ml-2 truncate">{safeGetDocument(0)!.name}</span>
                      <span className="ml-2 text-xs text-red-500">*필수</span>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {safeGetDocument(0)!.fileName && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs bg-gray-100 py-1 px-2 rounded max-w-[200px] truncate">
                                {safeGetDocument(0)!.fileName}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{safeGetDocument(0)!.fileName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <div className="flex gap-1">
                        {safeGetDocument(0)!.status === 'uploaded' || safeGetDocument(0)!.status === 'scanned' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(0)}
                            className="h-7 w-7"
                            title="삭제"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="file-invoice-0"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'invoice')}
                              disabled={safeGetDocument(0)!.status === 'scanning'}
                            />
                            <label
                              htmlFor="file-invoice-0"
                              className="inline-flex items-center px-3 py-1.5 text-xs cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-opacity-80"
                            >
                              업로드
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Second document - Only render if it exists */}
                {safeGetDocument(1) && (
                  <div className="flex items-center justify-between border bg-white p-3 rounded-md">
                    <div className="flex items-center overflow-hidden">
                      {getDocumentStatusIcon(safeGetDocument(1)!.status)}
                      <span className="ml-2 truncate">{safeGetDocument(1)!.name}</span>
                      <span className="ml-2 text-xs text-red-500">*필수</span>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {safeGetDocument(1)!.fileName && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs bg-gray-100 py-1 px-2 rounded max-w-[200px] truncate">
                                {safeGetDocument(1)!.fileName}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{safeGetDocument(1)!.fileName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <div className="flex gap-1">
                        {safeGetDocument(1)!.status === 'uploaded' || safeGetDocument(1)!.status === 'scanned' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(1)}
                            className="h-7 w-7"
                            title="삭제"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="file-packing-1"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'packing')}
                              disabled={safeGetDocument(1)!.status === 'scanning'}
                            />
                            <label
                              htmlFor="file-packing-1"
                              className="inline-flex items-center px-3 py-1.5 text-xs cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-opacity-80"
                            >
                              업로드
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Third document - Only render if it exists */}
                {safeGetDocument(2) && (
                  <div className="flex items-center justify-between border bg-white p-3 rounded-md">
                    <div className="flex items-center overflow-hidden">
                      {getDocumentStatusIcon(safeGetDocument(2)!.status)}
                      <span className="ml-2 truncate">{safeGetDocument(2)!.name}</span>
                      <span className="ml-2 text-xs text-red-500">*필수</span>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {safeGetDocument(2)!.fileName && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs bg-gray-100 py-1 px-2 rounded max-w-[200px] truncate">
                                {safeGetDocument(2)!.fileName}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{safeGetDocument(2)!.fileName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <div className="flex gap-1">
                        {safeGetDocument(2)!.status === 'uploaded' || safeGetDocument(2)!.status === 'scanned' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(2)}
                            className="h-7 w-7"
                            title="삭제"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="file-bl-2"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'bl')}
                              disabled={safeGetDocument(2)!.status === 'scanning'}
                            />
                            <label
                              htmlFor="file-bl-2"
                              className="inline-flex items-center px-3 py-1.5 text-xs cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-opacity-80"
                            >
                              업로드
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional documents */}
                {documents.slice(3).map((doc, index) => (
                  <div key={index + 3} className="flex items-center justify-between border bg-white p-3 rounded-md">
                    <div className="flex items-center overflow-hidden">
                      {getDocumentStatusIcon(doc.status)}
                      <span className="ml-2 truncate">{doc.name}</span>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {doc.fileName && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs bg-gray-100 py-1 px-2 rounded max-w-[200px] truncate">
                                {doc.fileName}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{doc.fileName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <div className="flex gap-1">
                        {doc.status === 'uploaded' || doc.status === 'scanned' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDocument(index + 3)}
                            className="h-7 w-7"
                            title="삭제"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id={`file-other-${index + 3}`}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, 'other')}
                              disabled={doc.status === 'scanning'}
                            />
                            <label
                              htmlFor={`file-other-${index + 3}`}
                              className="inline-flex items-center px-3 py-1.5 text-xs cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-opacity-80"
                            >
                              업로드
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleAddDocument}
                  className="text-sm"
                  disabled={isScanning}
                >
                  + 추가 서류 업로드
                </Button>
                
                <Button 
                  onClick={simulateAIScanning} 
                  disabled={isScanning || !documentsReady}
                  className="flex items-center text-sm"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2" />
                      AI 스캐닝 중...
                    </>
                  ) : (
                    <>
                      AI 자동 입력 시작
                    </>
                  )}
                </Button>
              </div>

              {isScanning && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">AI 스캐닝 중... {scanningProgress}%</p>
                  <Progress value={scanningProgress} className="h-2" />
                </div>
              )}
              
              <div className="text-xs text-gray-500 mt-2">
                AI 스캐닝을 사용하면 서류에서 정보를 추출하여 신고서 작성을 자동화합니다.
              </div>
            </div>

            <DeclarationForm 
              formData={formData} 
              onFormChange={handleFormChange} 
            />

            <div className="flex justify-center items-center gap-4 mt-8">
              {cameFromSimulation && (
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={handleBackToSimulation}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  관세 시뮬레이션으로 돌아가기
                </Button>
              )}
              
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleSave}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                저장하기
              </Button>
              
              <Button
                variant="outline"
                onClick={openPreviewModal}
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                신고서 미리보기
              </Button>
              
              <Button 
                onClick={handleSubmit} 
                className="flex items-center"
              >
                제출하기
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>신고서 미리보기</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <DeclarationCertificate formData={formData} />
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleDownloadPDF}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF 다운로드
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <SavedDeclarationModal
          open={saveModalOpen}
          onOpenChange={setSaveModalOpen}
          savedDeclarations={savedDeclarations}
          onLoadDeclaration={handleLoadDeclaration}
          onDeleteDeclaration={handleDeleteDeclaration}
          mode="save"
        />
        
        <SavedDeclarationModal
          open={loadModalOpen}
          onOpenChange={setLoadModalOpen}
          savedDeclarations={savedDeclarations}
          onLoadDeclaration={handleLoadDeclaration}
          onDeleteDeclaration={handleDeleteDeclaration}
          mode="load"
        />
      </div>
    </Layout>
  );
};

export default DeclarationPage;

