
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileText, Calculator, Upload, Loader2 } from "lucide-react";
import SavedSimulationModal from "./SavedSimulationModal";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from "@/components/ui/command";
import { cn, getCountryName, getSortedCountries } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface SimulationInputProps {
  onNext: (data: any) => void;
  savedSimulations: any[];
  onLoadSimulation: (data: any) => void;
  onDeleteSimulation: (id: string) => void;
}

const SimulationInput: React.FC<SimulationInputProps> = ({ 
  onNext, 
  savedSimulations, 
  onLoadSimulation,
  onDeleteSimulation 
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [importType, setImportType] = useState<"import" | "export">("import");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [value, setValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [openCountrySelect, setOpenCountrySelect] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState<string>("");
  const [extractingProductName, setExtractingProductName] = useState(false);

  const countriesRaw = [
    { code: "AF", name: "아프가니스탄" },
    { code: "AL", name: "알바니아" },
    { code: "DZ", name: "알제리" },
    { code: "AD", name: "안도라" },
    { code: "AO", name: "앙골라" },
    { code: "AR", name: "아르헨티나" },
    { code: "AM", name: "아르메니아" },
    { code: "AU", name: "호주" },
    { code: "AT", name: "오스트리아" },
    { code: "AZ", name: "아제르바이잔" },
    { code: "BS", name: "바하마" },
    { code: "BH", name: "바레인" },
    { code: "BD", name: "방글라데시" },
    { code: "BB", name: "바베이도스" },
    { code: "BY", name: "벨라루스" },
    { code: "BE", name: "벨기에" },
    { code: "BZ", name: "벨리즈" },
    { code: "BJ", name: "베냉" },
    { code: "BT", name: "부탄" },
    { code: "BO", name: "볼리비아" },
    { code: "BA", name: "보스니아 헤르체고비나" },
    { code: "BW", name: "보츠와나" },
    { code: "BR", name: "브라질" },
    { code: "BN", name: "브루나이" },
    { code: "BG", name: "불가리아" },
    { code: "BF", name: "부르키나파소" },
    { code: "BI", name: "부룬디" },
    { code: "KH", name: "캄보디아" },
    { code: "CM", name: "카메룬" },
    { code: "CA", name: "캐나다" },
    { code: "CV", name: "카보베르데" },
    { code: "CF", name: "중앙아프리카공화국" },
    { code: "TD", name: "차드" },
    { code: "CL", name: "칠레" },
    { code: "CN", name: "중국" },
    { code: "CO", name: "콜롬비아" },
    { code: "KM", name: "코모로" },
    { code: "CG", name: "콩고" },
    { code: "CD", name: "콩고민주공화국" },
    { code: "CR", name: "코스타리카" },
    { code: "CI", name: "코트디부아르" },
    { code: "HR", name: "크로아티아" },
    { code: "CU", name: "쿠바" },
    { code: "CY", name: "키프로스" },
    { code: "CZ", name: "체코" },
    { code: "DK", name: "덴마크" },
    { code: "DJ", name: "지부티" },
    { code: "DM", name: "도미니카" },
    { code: "DO", name: "도미니카공화국" },
    { code: "EC", name: "에콰도르" },
    { code: "EG", name: "이집트" },
    { code: "SV", name: "엘살바도르" },
    { code: "GQ", name: "적도기니" },
    { code: "ER", name: "에리트레아" },
    { code: "EE", name: "에스토니아" },
    { code: "SZ", name: "에스와티니" },
    { code: "ET", name: "에티오피아" },
    { code: "FJ", name: "피지" },
    { code: "FI", name: "핀란드" },
    { code: "FR", name: "프랑스" },
    { code: "GA", name: "가봉" },
    { code: "GM", name: "감비아" },
    { code: "GE", name: "조지아" },
    { code: "DE", name: "독일" },
    { code: "GH", name: "가나" },
    { code: "GR", name: "그리스" },
    { code: "GT", name: "과테말라" },
    { code: "GN", name: "기니" },
    { code: "GW", name: "기니비사우" },
    { code: "GY", name: "가이아나" },
    { code: "HT", name: "아이티" },
    { code: "HN", name: "온두라스" },
    { code: "HK", name: "홍콩" },
    { code: "HU", name: "헝가리" },
    { code: "IS", name: "아이슬란드" },
    { code: "IN", name: "인도" },
    { code: "ID", name: "인도네시아" },
    { code: "IR", name: "이란" },
    { code: "IQ", name: "이라크" },
    { code: "IE", name: "아일랜드" },
    { code: "IL", name: "이스라엘" },
    { code: "IT", name: "이탈리아" },
    { code: "JM", name: "자메이카" },
    { code: "JP", name: "일본" },
    { code: "JO", name: "요르단" },
    { code: "KZ", name: "카자흐스탄" },
    { code: "KE", name: "케냐" },
    { code: "KI", name: "키리바시" },
    { code: "KP", name: "북한" },
    { code: "KR", name: "한국" },
    { code: "KW", name: "쿠웨이트" },
    { code: "KG", name: "키르기스스탄" },
    { code: "LA", name: "라오스" },
    { code: "LV", name: "라트비아" },
    { code: "LB", name: "레바논" },
    { code: "LS", name: "레소토" },
    { code: "LR", name: "라이베리아" },
    { code: "LY", name: "리비아" },
    { code: "LI", name: "리히텐슈타인" },
    { code: "LT", name: "리투아니아" },
    { code: "LU", name: "룩셈부르크" },
    { code: "MO", name: "마카오" },
    { code: "MG", name: "마다가스카르" },
    { code: "MW", name: "말라위" },
    { code: "MY", name: "말레이시아" },
    { code: "MV", name: "몰디브" },
    { code: "ML", name: "말리" },
    { code: "MT", name: "몰타" },
    { code: "MH", name: "마샬 제도" },
    { code: "MR", name: "모리타니" },
    { code: "MU", name: "모리셔스" },
    { code: "MX", name: "멕시코" },
    { code: "FM", name: "미크로네시아" },
    { code: "MD", name: "몰도바" },
    { code: "MC", name: "모나코" },
    { code: "MN", name: "몽골" },
    { code: "ME", name: "몬테네그로" },
    { code: "MA", name: "모로코" },
    { code: "MZ", name: "모잠비크" },
    { code: "MM", name: "미얀마" },
    { code: "NA", name: "나미비아" },
    { code: "NR", name: "나우루" },
    { code: "NP", name: "네팔" },
    { code: "NL", name: "네덜란드" },
    { code: "NZ", name: "뉴질랜드" },
    { code: "NI", name: "니카라과" },
    { code: "NE", name: "니제르" },
    { code: "NG", name: "나이지리아" },
    { code: "NO", name: "노르웨이" },
    { code: "OM", name: "오만" },
    { code: "PK", name: "파키스탄" },
    { code: "PW", name: "팔라우" },
    { code: "PA", name: "파나마" },
    { code: "PG", name: "파푸아뉴기니" },
    { code: "PY", name: "파라과이" },
    { code: "PE", name: "페루" },
    { code: "PH", name: "필리핀" },
    { code: "PL", name: "폴란드" },
    { code: "PT", name: "포르투갈" },
    { code: "QA", name: "카타르" },
    { code: "RO", name: "루마니아" },
    { code: "RU", name: "러시아" },
    { code: "RW", name: "르완다" },
    { code: "KN", name: "세인트키츠네비스" },
    { code: "LC", name: "세인트루시아" },
    { code: "VC", name: "세인트빈센트그레나딘" },
    { code: "WS", name: "사모아" },
    { code: "SM", name: "산마리노" },
    { code: "ST", name: "상투메프린시페" },
    { code: "SA", name: "사우디아라비아" },
    { code: "SN", name: "세네갈" },
    { code: "RS", name: "세르비아" },
    { code: "SC", name: "세이셸" },
    { code: "SL", name: "시에라리온" },
    { code: "SG", name: "싱가포르" },
    { code: "SK", name: "슬로바키아" },
    { code: "SI", name: "슬로베니아" },
    { code: "SB", name: "솔로몬제도" },
    { code: "SO", name: "소말리아" },
    { code: "ZA", name: "남아프리카공화국" },
    { code: "SS", name: "남수단" },
    { code: "ES", name: "스페인" },
    { code: "LK", name: "스리랑카" },
    { code: "SD", name: "수단" },
    { code: "SR", name: "수리남" },
    { code: "SE", name: "스웨덴" },
    { code: "CH", name: "스위스" },
    { code: "SY", name: "시리아" },
    { code: "TW", name: "대만" },
    { code: "TJ", name: "타지키스탄" },
    { code: "TZ", name: "탄자니아" },
    { code: "TH", name: "태국" },
    { code: "TL", name: "동티모르" },
    { code: "TG", name: "토고" },
    { code: "TO", name: "통가" },
    { code: "TT", name: "트리니다드토바고" },
    { code: "TN", name: "튀니지" },
    { code: "TR", name: "터키" },
    { code: "TM", name: "투르크메니스탄" },
    { code: "TV", name: "투발루" },
    { code: "UG", name: "우간다" },
    { code: "UA", name: "우크라이나" },
    { code: "AE", name: "아랍에미리트" },
    { code: "GB", name: "영국" },
    { code: "US", name: "미국" },
    { code: "UY", name: "우루과이" },
    { code: "UZ", name: "우즈베키스탄" },
    { code: "VU", name: "바누아투" },
    { code: "VA", name: "바티칸" },
    { code: "VE", name: "베네수엘라" },
    { code: "VN", name: "베트남" },
    { code: "YE", name: "예멘" },
    { code: "ZM", name: "잠비아" },
    { code: "ZW", name: "짐바브웨" },
  ];

  const countries = getSortedCountries(countriesRaw);

  // Function to simulate AI extraction of product name from uploaded document
  const extractProductNameFromDocument = async (uploadedFile: File): Promise<string> => {
    // In a real implementation, this would call an AI service to extract product name
    // For now, we'll simulate a delay and return a placeholder result based on the file name
    return new Promise((resolve) => {
      setTimeout(() => {
        // Remove file extension and replace underscores/dashes with spaces
        const nameFromFile = uploadedFile.name
          .split('.')[0]
          .replace(/[_-]/g, ' ')
          .replace(/([A-Z])/g, ' $1')
          .trim();
          
        // Capitalize first letter of each word
        const formattedName = nameFromFile
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
          
        resolve(formattedName);
      }, 1500); // Simulate 1.5s delay for AI processing
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const allowedTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/tiff', 
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: t("error.fileFormat"),
          description: t("error.fileFormatDesc"),
          variant: "destructive"
        });
        return;
      }

      if (selectedFile.size > maxSize) {
        toast({
          title: t("error.fileSize"),
          description: t("error.fileSizeDesc"),
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      
      // Extract product name from the uploaded document
      try {
        setExtractingProductName(true);
        const extractedName = await extractProductNameFromDocument(selectedFile);
        setProductName(extractedName);
        setExtractingProductName(false);
        
        toast({
          title: t("simulation.input.productNameExtracted"),
          description: t("simulation.input.productNameExtractedDesc"),
        });
      } catch (error) {
        console.error("Error extracting product name:", error);
        setExtractingProductName(false);
        toast({
          title: t("error.extraction"),
          description: t("error.extractionDesc"),
          variant: "destructive"
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const allowedTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/tiff', 
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(droppedFile.type)) {
        toast({
          title: t("error.fileFormat"),
          description: t("error.fileFormatDesc"),
          variant: "destructive"
        });
        return;
      }

      if (droppedFile.size > maxSize) {
        toast({
          title: t("error.fileSize"),
          description: t("error.fileSizeDesc"),
          variant: "destructive"
        });
        return;
      }

      setFile(droppedFile);
      
      // Extract product name from the uploaded document
      try {
        setExtractingProductName(true);
        const extractedName = await extractProductNameFromDocument(droppedFile);
        setProductName(extractedName);
        setExtractingProductName(false);
        
        toast({
          title: t("simulation.input.productNameExtracted"),
          description: t("simulation.input.productNameExtractedDesc"),
        });
      } catch (error) {
        console.error("Error extracting product name:", error);
        setExtractingProductName(false);
        toast({
          title: t("error.extraction"),
          description: t("error.extractionDesc"),
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName) {
      toast({
        title: t("error.productName"),
        description: t("error.productNameRequired"),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onNext({
        importType,
        productName,
        description,
        originCountry: importType === "export" ? "KR" : originCountry,
        value,
        file,
      });
      setIsLoading(false);
    }, 1000);
  };

  const getFileExtensionInfo = () => {
    return (
      <p className="text-xs text-gray-500 mt-1">
        {t("simulation.input.fileTypes")}
      </p>
    );
  };

  const handleCountrySelect = (code: string) => {
    console.log("국가 선택됨:", code);
    if (code) {
      setOriginCountry(code);
      const country = countries.find(c => c.code === code);
      if (country) {
        setSelectedCountryName(`${country.name} (${country.code})`);
      }
    }
    setOpenCountrySelect(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">{t("simulation.input.heading")}</h2>
        <Button 
          variant="outline" 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          {t("simulation.input.loadSaved")}
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <Label className="text-lg font-medium mb-2 block">{t("simulation.input.importExport")}</Label>
          <RadioGroup 
            defaultValue="import" 
            value={importType}
            onValueChange={(value) => setImportType(value as "import" | "export")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="import" id="import" />
              <Label htmlFor="import">{t("simulation.input.import")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="export" id="export" />
              <Label htmlFor="export">{t("simulation.input.export")}</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mb-6">
          <Label htmlFor="document" className="text-lg font-medium mb-2 block">
            {t("simulation.input.uploadDocument")} <span className="text-sm text-gray-500">{t("simulation.input.uploadOptional")}</span>
          </Label>
          <div 
            className={cn(
              "border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100",
              isDragging ? "border-primary bg-blue-50" : "border-gray-300",
              file ? "border-green-300 bg-green-50" : ""
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('document')?.click()}
          >
            <div className="flex flex-col items-center justify-center">
              <Upload className={cn("w-10 h-10 mb-2", file ? "text-green-500" : "text-gray-400")} />
              <p className="text-sm font-medium mb-1">
                {file ? file.name : t("simulation.input.dragDrop")}
              </p>
              <p className="text-xs text-gray-500 text-center">
                {t("simulation.input.uploadHint")}
              </p>
            </div>
            <Input 
              id="document" 
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff,.xls,.xlsx,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {getFileExtensionInfo()}
        </div>
        
        <div className="mb-6">
          <Label htmlFor="productName" className="text-lg font-medium mb-2 block">
            {t("simulation.input.productName")} <span className="text-sm text-gray-500">{t("simulation.input.required")}</span>
          </Label>
          <div className="relative">
            <Input 
              id="productName" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={t("simulation.input.productNamePlaceholder")}
              className={extractingProductName ? "pr-10" : ""}
              disabled={extractingProductName}
              required
            />
            {extractingProductName && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t("simulation.input.productNameHint")}
          </p>
        </div>

        <div className="mb-6">
          <Label htmlFor="description" className="text-lg font-medium mb-2 block">
            {t("simulation.input.additionalDescription")} <span className="text-sm text-gray-500">{t("simulation.input.optional")}</span>
          </Label>
          <Textarea 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("simulation.input.descriptionPlaceholder")}
            className="resize-none h-32"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="origin" className="text-lg font-medium mb-2 block">
              {importType === "export" ? t("simulation.input.destination") : t("simulation.input.origin")} <span className="text-sm text-gray-500">{t("simulation.input.optional")}</span>
            </Label>
            
            {importType === "import" ? (
              <div className="relative">
                <div 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                  onClick={() => setOpenCountrySelect(true)}
                >
                  {selectedCountryName || t("simulation.input.selectOrigin")}
                </div>
                
                {openCountrySelect && (
                  <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-50">
                    <Command>
                      <CommandInput placeholder={t("simulation.input.selectOrigin")} />
                      <CommandList>
                        <CommandEmpty>{t("simulation.input.noResults")}</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-80">
                            {countries.map((country) => (
                              <CommandItem
                                key={country.code}
                                value={country.name}
                                onSelect={() => handleCountrySelect(country.code)}
                                className="cursor-pointer hover:bg-accent"
                              >
                                {country.name} ({country.code})
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </div>
                )}
              </div>
            ) : (
              <Input 
                id="destination-country" 
                value={t("country.US") + " (US)"}
                readOnly
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            )}
            
            {importType === "export" && (
              <p className="text-sm text-gray-500 mt-1">{t("simulation.input.exportNote")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="value" className="text-lg font-medium mb-2 block">
              {t("simulation.input.value")} <span className="text-sm text-gray-500">{t("simulation.input.optional")}</span>
            </Label>
            <Input 
              id="value" 
              type="number"
              min="0"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("simulation.input.valuePlaceholder")}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            type="submit" 
            size="lg" 
            className="bg-accent hover:bg-accent-dark"
            disabled={isLoading || !productName}
          >
            {isLoading ? t("simulation.input.analyzing") : t("simulation.input.start")}
          </Button>
        </div>
      </form>

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

export default SimulationInput;
