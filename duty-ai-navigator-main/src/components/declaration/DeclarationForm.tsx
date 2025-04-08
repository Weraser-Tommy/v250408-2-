
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeclarationFormData } from '@/pages/DeclarationPage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DeclarationFormProps {
  formData: DeclarationFormData;
  onFormChange: (data: Partial<DeclarationFormData>) => void;
}

const DeclarationForm: React.FC<DeclarationFormProps> = ({ formData, onFormChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    onFormChange({ [id]: value });
  };
  
  const handleSelectChange = (id: string, value: string) => {
    onFormChange({ [id]: value });
  };

  const handleRadioChange = (value: "import" | "export") => {
    onFormChange({ declarationType: value });
  };

  // Format date for default value
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div>
      <div className="mb-8">
        <RadioGroup 
          value={formData.declarationType} 
          onValueChange={handleRadioChange} 
          className="flex space-x-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="import" id="import" />
            <Label htmlFor="import">수입신고</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="export" id="export" />
            <Label htmlFor="export">수출신고</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Render different forms based on declaration type */}
      {formData.declarationType === "import" ? (
        <ImportDeclarationForm formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} formattedDate={formattedDate} />
      ) : (
        <ExportDeclarationForm formData={formData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} formattedDate={formattedDate} />
      )}
    </div>
  );
};

interface FormSectionProps {
  formData: DeclarationFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (id: string, value: string) => void;
  formattedDate: string;
}

const ImportDeclarationForm: React.FC<FormSectionProps> = ({ formData, handleInputChange, handleSelectChange, formattedDate }) => {
  return (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5', 'item-6']}>
      {/* 신고번호 및 기본정보 섹션 */}
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-medium">기본 신고정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="declarationNumber" className="text-sm font-medium mb-1 block">
                신고번호
              </Label>
              <Input 
                id="declarationNumber" 
                placeholder="자동생성"
                value={formData.declarationNumber || "7-1-2023-0001234"}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="declarationDate" className="text-sm font-medium mb-1 block">
                신고일
              </Label>
              <Input 
                type="date" 
                id="declarationDate" 
                defaultValue={formData.declarationDate || formattedDate}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="processingStatus" className="text-sm font-medium mb-1 block">
                처리상태
              </Label>
              <Input id="processingStatus" value="작성 중" disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="customsOffice" className="text-sm font-medium mb-1 block">
                세관,과
              </Label>
              <Input 
                id="customsOffice" 
                placeholder="인천세관,통관지원과"
                value={formData.customsOffice || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="customsOfficer" className="text-sm font-medium mb-1 block">
                담당자
              </Label>
              <Input 
                id="customsOfficer" 
                placeholder="담당 세관원명"
                value={formData.customsOfficer || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="clearanceDate" className="text-sm font-medium mb-1 block">
                수리일자
              </Label>
              <Input 
                type="date"
                id="clearanceDate" 
                value={formData.clearanceDate || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blNumber" className="text-sm font-medium mb-1 block">
                B/L(AWB)번호
              </Label>
              <Input 
                id="blNumber" 
                placeholder="ABCD1234567890"
                value={formData.blNumber || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="cargoControlNumber" className="text-sm font-medium mb-1 block">
                화물관리번호
              </Label>
              <Input 
                id="cargoControlNumber" 
                placeholder="19자리 번호"
                value={formData.cargoControlNumber || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 도착정보 섹션 */}
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-medium">도착 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="arrivalDate" className="text-sm font-medium mb-1 block">
                입항일
              </Label>
              <Input 
                type="date"
                id="arrivalDate" 
                value={formData.arrivalDate || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="entryDate" className="text-sm font-medium mb-1 block">
                반입일
              </Label>
              <Input 
                type="date"
                id="entryDate" 
                value={formData.entryDate || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="transportType" className="text-sm font-medium mb-1 block">
                운송형태
              </Label>
              <Select
                value={formData.transportType || ""} 
                onValueChange={(value) => handleSelectChange("transportType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="운송형태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10-FC">10-FC (선박-FCL)</SelectItem>
                  <SelectItem value="10-LC">10-LC (선박-LCL)</SelectItem>
                  <SelectItem value="40-FC">40-FC (항공-FCL)</SelectItem>
                  <SelectItem value="40-LC">40-LC (항공-LCL)</SelectItem>
                  <SelectItem value="50-ETC">50-ETC (우편물)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="vesselName" className="text-sm font-medium mb-1 block">
                선기명
              </Label>
              <Input 
                id="vesselName" 
                value={formData.vesselName || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="masterBlNumber" className="text-sm font-medium mb-1 block">
                MASTER B/L번호
              </Label>
              <Input 
                id="masterBlNumber" 
                value={formData.masterBlNumber || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="carrierCode" className="text-sm font-medium mb-1 block">
                운수기관부호
              </Label>
              <Input 
                id="carrierCode" 
                value={formData.carrierCode || ""} 
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="inspectionLocation" className="text-sm font-medium mb-1 block">
                검사(반입)장소
              </Label>
              <Input 
                id="inspectionLocation" 
                value={formData.inspectionLocation || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="arrivalPort" className="text-sm font-medium mb-1 block">
                국내도착항
              </Label>
              <Input 
                id="arrivalPort" 
                placeholder="KRPUS (부산항)"
                value={formData.arrivalPort || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="loadingCountry" className="text-sm font-medium mb-1 block">
                적출국
              </Label>
              <Select
                value={formData.loadingCountry || ""} 
                onValueChange={(value) => handleSelectChange("loadingCountry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="국가 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">미국(US)</SelectItem>
                  <SelectItem value="CN">중국(CN)</SelectItem>
                  <SelectItem value="JP">일본(JP)</SelectItem>
                  <SelectItem value="VN">베트남(VN)</SelectItem>
                  <SelectItem value="KR">대한민국(KR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 신고인 정보 섹션 */}
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-medium">신고인/수입자 정보</AccordionTrigger>
        <AccordionContent>
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="declarerName" className="text-sm font-medium mb-1 block">
                  신고인
                </Label>
                <Input 
                  id="declarerName" 
                  value={formData.declarerName} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="declarerCode" className="text-sm font-medium mb-1 block">
                  신고인부호
                </Label>
                <Input 
                  id="declarerCode" 
                  value={formData.declarerCode} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="importerName" className="text-sm font-medium mb-1 block">
                  수입자
                </Label>
                <Input 
                  id="importerName" 
                  value={formData.importerName || formData.company || ""} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <Label htmlFor="businessNumber" className="text-sm font-medium mb-1 block">
                  사업자등록번호
                </Label>
                <Input 
                  id="businessNumber" 
                  placeholder="000-00-00000" 
                  value={formData.businessNumber} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="taxPayer" className="text-sm font-medium mb-1 block">
                납세의무자
              </Label>
              <Input 
                id="taxPayer" 
                value={formData.taxPayer || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="taxPayerCode" className="text-sm font-medium mb-1 block">
                통관고유부호
              </Label>
              <Input 
                id="taxPayerCode" 
                value={formData.taxPayerCode || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="forwarderName" className="text-sm font-medium mb-1 block">
                운송주선인
              </Label>
              <Input 
                id="forwarderName" 
                value={formData.forwarderName || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="forwarderCode" className="text-sm font-medium mb-1 block">
                운송주선인부호
              </Label>
              <Input 
                id="forwarderCode" 
                value={formData.forwarderCode || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="foreignSupplier" className="text-sm font-medium mb-1 block">
                해외거래처
              </Label>
              <Input 
                id="foreignSupplier" 
                value={formData.foreignSupplier || formData.shipperName || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="foreignSupplierCode" className="text-sm font-medium mb-1 block">
                해외거래처부호
              </Label>
              <Input 
                id="foreignSupplierCode" 
                value={formData.foreignSupplierCode || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 물품정보 섹션 */}
      <AccordionItem value="item-4">
        <AccordionTrigger className="font-medium">물품 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="hsCode" className="text-sm font-medium mb-1 block">
                세번부호(HS코드)
              </Label>
              <Input 
                id="hsCode" 
                value={formData.hsCode} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="countryOrigin" className="text-sm font-medium mb-1 block">
                원산지 국가
              </Label>
              <Select 
                value={formData.countryOrigin} 
                onValueChange={(value) => handleSelectChange("countryOrigin", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="국가 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KR">대한민국</SelectItem>
                  <SelectItem value="US">미국</SelectItem>
                  <SelectItem value="CN">중국</SelectItem>
                  <SelectItem value="JP">일본</SelectItem>
                  <SelectItem value="VN">베트남</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="originCertificate" className="text-sm font-medium mb-1 block">
                원산지증명서유무
              </Label>
              <Select
                value={formData.originCertificate || ""} 
                onValueChange={(value) => handleSelectChange("originCertificate", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="유무 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Y (있음)</SelectItem>
                  <SelectItem value="N">N (없음)</SelectItem>
                  <SelectItem value="X">X (제출 면제)</SelectItem>
                  <SelectItem value="A">A (사전 협정 관세 신청)</SelectItem>
                  <SelectItem value="B">B (사후 협정 관세 신청)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="itemName" className="text-sm font-medium mb-1 block">
                품명
              </Label>
              <Input 
                id="itemName" 
                value={formData.itemName} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="tradeName" className="text-sm font-medium mb-1 block">
                거래품명
              </Label>
              <Input 
                id="tradeName" 
                value={formData.tradeName || ""} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="brandName" className="text-sm font-medium mb-1 block">
                상표
              </Label>
              <Input 
                id="brandName" 
                value={formData.brandName || "NO"} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="modelSpec" className="text-sm font-medium mb-1 block">
                모델/규격
              </Label>
              <Input 
                id="modelSpec" 
                value={formData.modelSpec || ""} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div>
            <Label htmlFor="composition" className="text-sm font-medium mb-1 block">
              성분
            </Label>
            <Textarea 
              id="composition" 
              className="resize-none h-20"
              value={formData.composition || ""} 
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-4">
            <div>
              <Label htmlFor="itemQuantity" className="text-sm font-medium mb-1 block">
                수량
              </Label>
              <Input 
                id="itemQuantity" 
                type="number" 
                value={formData.itemQuantity} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="itemUnit" className="text-sm font-medium mb-1 block">
                단위
              </Label>
              <Select
                value={formData.itemUnit} 
                onValueChange={(value) => handleSelectChange("itemUnit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="단위 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="EA">EA(개)</SelectItem>
                  <SelectItem value="MT">MT(톤)</SelectItem>
                  <SelectItem value="L">L(리터)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="itemPrice" className="text-sm font-medium mb-1 block">
                단가(USD)
              </Label>
              <Input 
                id="itemPrice" 
                type="number" 
                value={formData.itemPrice} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="grossWeight" className="text-sm font-medium mb-1 block">
                총중량(KG)
              </Label>
              <Input 
                id="grossWeight" 
                value={formData.grossWeight || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="netWeight" className="text-sm font-medium mb-1 block">
                순중량(KG)
              </Label>
              <Input 
                id="netWeight" 
                value={formData.netWeight || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalPackages" className="text-sm font-medium mb-1 block">
                총포장갯수
              </Label>
              <Input 
                id="totalPackages" 
                value={formData.totalPackages || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="packageUnit" className="text-sm font-medium mb-1 block">
                포장단위
              </Label>
              <Select
                value={formData.packageUnit || ""} 
                onValueChange={(value) => handleSelectChange("packageUnit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="포장단위 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CT">CT (상자)</SelectItem>
                  <SelectItem value="DR">DR (드럼)</SelectItem>
                  <SelectItem value="GT">GT (일반 개수)</SelectItem>
                  <SelectItem value="PL">PL (팔레트)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 과세정보 섹션 */}
      <AccordionItem value="item-5">
        <AccordionTrigger className="font-medium">과세 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="dutyRate" className="text-sm font-medium mb-1 block">
                세율(%)
              </Label>
              <Input 
                id="dutyRate" 
                value={formData.dutyRate || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="taxationType" className="text-sm font-medium mb-1 block">
                세율(구분)
              </Label>
              <Input 
                id="taxationType" 
                value={formData.taxationType || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="reductionRate" className="text-sm font-medium mb-1 block">
                감면율
              </Label>
              <Input 
                id="reductionRate" 
                value={formData.reductionRate || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="taxAmount" className="text-sm font-medium mb-1 block">
                세액
              </Label>
              <Input 
                id="taxAmount" 
                value={formData.taxAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="totalTaxAmount" className="text-sm font-medium mb-1 block">
                총세액합계
              </Label>
              <Input 
                id="totalTaxAmount" 
                value={formData.totalTaxAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="taxableValue" className="text-sm font-medium mb-1 block">
                과세가격(CIF)
              </Label>
              <Input 
                id="taxableValue" 
                value={formData.taxableValue || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="csInspection" className="text-sm font-medium mb-1 block">
                C/S검사
              </Label>
              <Select
                value={formData.csInspection || ""} 
                onValueChange={(value) => handleSelectChange("csInspection", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="C/S검사 여부" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Y (검사필요)</SelectItem>
                  <SelectItem value="S">S (검사면제)</SelectItem>
                  <SelectItem value="N">N (해당없음)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="totalDeclaredValue" className="text-sm font-medium mb-1 block">
                총과세가격
              </Label>
              <Input 
                id="totalDeclaredValue" 
                value={formData.totalDeclaredValue || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="exchangeRate" className="text-sm font-medium mb-1 block">
                환율
              </Label>
              <Input 
                id="exchangeRate" 
                value={formData.exchangeRate || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="freightAmount" className="text-sm font-medium mb-1 block">
                운임(KRW)
              </Label>
              <Input 
                id="freightAmount" 
                value={formData.freightAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="insuranceAmount" className="text-sm font-medium mb-1 block">
                보험료(KRW)
              </Label>
              <Input 
                id="insuranceAmount" 
                value={formData.insuranceAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="additionalAmount" className="text-sm font-medium mb-1 block">
                가산금액
              </Label>
              <Input 
                id="additionalAmount" 
                value={formData.additionalAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 거래 정보 섹션 */}
      <AccordionItem value="item-6">
        <AccordionTrigger className="font-medium">거래 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="declarationType" className="text-sm font-medium mb-1 block">
                신고구분
              </Label>
              <Select
                value={formData.importDeclarationType || ""} 
                onValueChange={(value) => handleSelectChange("importDeclarationType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="신고구분 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A (일반 P/L 신고)</SelectItem>
                  <SelectItem value="B">B (일반 서류 신고)</SelectItem>
                  <SelectItem value="C">C (간이 P/L 신고)</SelectItem>
                  <SelectItem value="D">D (간이 서류 신고)</SelectItem>
                  <SelectItem value="E">E (간이 특송 신고)</SelectItem>
                  <SelectItem value="F">F (포괄적 즉시 수리)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="transactionType" className="text-sm font-medium mb-1 block">
                거래구분
              </Label>
              <Select
                value={formData.transactionType} 
                onValueChange={(value) => handleSelectChange("transactionType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="거래구분 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11">11 (일반 수입)</SelectItem>
                  <SelectItem value="29">29 (위탁 가공 후 수입)</SelectItem>
                  <SelectItem value="83">83 (수리 후 재수입)</SelectItem>
                  <SelectItem value="87">87 (무상 견품 수입)</SelectItem>
                  <SelectItem value="91">91 (이사화물 수입)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="paymentMethod" className="text-sm font-medium mb-1 block">
                결제방법
              </Label>
              <Select
                value={formData.paymentMethod} 
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="결제방법 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L/C">L/C</SelectItem>
                  <SelectItem value="T/T">T/T</SelectItem>
                  <SelectItem value="D/P">D/P</SelectItem>
                  <SelectItem value="D/A">D/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="incoterms" className="text-sm font-medium mb-1 block">
                인코텀스
              </Label>
              <Select
                value={formData.incoterms} 
                onValueChange={(value) => handleSelectChange("incoterms", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="인코텀스 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOB">FOB</SelectItem>
                  <SelectItem value="CIF">CIF</SelectItem>
                  <SelectItem value="EXW">EXW</SelectItem>
                  <SelectItem value="DAP">DAP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="currency" className="text-sm font-medium mb-1 block">
                통화종류
              </Label>
              <Select
                value={formData.currency || ""} 
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="통화 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                  <SelectItem value="KRW">KRW</SelectItem>
                  <SelectItem value="CNY">CNY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="importRequirements" className="text-sm font-medium mb-1 block">
                수입요건확인(발급서류명)
              </Label>
              <Input 
                id="importRequirements" 
                value={formData.importRequirements || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="requirementNumber" className="text-sm font-medium mb-1 block">
                요건번호
              </Label>
              <Input 
                id="requirementNumber" 
                value={formData.requirementNumber || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentNumber" className="text-sm font-medium mb-1 block">
                납부번호
              </Label>
              <Input 
                id="paymentNumber" 
                value={formData.paymentNumber || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="collectionType" className="text-sm font-medium mb-1 block">
                징수형태
              </Label>
              <Select
                value={formData.collectionType || ""} 
                onValueChange={(value) => handleSelectChange("collectionType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="징수형태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11">11 (수리 전 납부)</SelectItem>
                  <SelectItem value="13">13 (신용 담보 사후 납부)</SelectItem>
                  <SelectItem value="14">14 (무담보 사후 납부)</SelectItem>
                  <SelectItem value="43">43 (월별 신용 담보 납부)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const ExportDeclarationForm: React.FC<FormSectionProps> = ({ formData, handleInputChange, handleSelectChange, formattedDate }) => {
  return (
    <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3', 'item-4', 'item-5']}>
      {/* 기본정보 섹션 */}
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-medium">기본 신고정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="declarationNumber" className="text-sm font-medium mb-1 block">
                신고번호
              </Label>
              <Input 
                id="declarationNumber" 
                placeholder="자동생성"
                value={formData.declarationNumber || "7-1-2023-0001234X"}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="declarationDate" className="text-sm font-medium mb-1 block">
                신고일자
              </Label>
              <Input 
                type="date" 
                id="declarationDate" 
                defaultValue={formData.declarationDate || formattedDate}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="processingStatus" className="text-sm font-medium mb-1 block">
                처리상태
              </Label>
              <Input id="processingStatus" value="작성 중" disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customsOfficeDept" className="text-sm font-medium mb-1 block">
                세관-과
              </Label>
              <Input 
                id="customsOfficeDept" 
                placeholder="인천세관-통관지원과"
                value={formData.customsOfficeDept || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="clearanceDate" className="text-sm font-medium mb-1 block">
                신고수리일자
              </Label>
              <Input 
                type="date"
                id="clearanceDate" 
                value={formData.clearanceDate || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 신고자/수출자 정보 섹션 */}
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-medium">신고자/수출자 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="declarantName" className="text-sm font-medium mb-1 block">
                신고자
              </Label>
              <Input 
                id="declarantName" 
                value={formData.declarantName || formData.declarerName || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="declarantCode" className="text-sm font-medium mb-1 block">
                신고인부호
              </Label>
              <Input 
                id="declarantCode" 
                value={formData.declarantCode || formData.declarerCode || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="exportAgent" className="text-sm font-medium mb-1 block">
                수출대행자
              </Label>
              <Input 
                id="exportAgent" 
                value={formData.exportAgent || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="exportAgentCode" className="text-sm font-medium mb-1 block">
                수출대행자부호
              </Label>
              <Input 
                id="exportAgentCode" 
                value={formData.exportAgentCode || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturer" className="text-sm font-medium mb-1 block">
                제조자
              </Label>
              <Input 
                id="manufacturer" 
                value={formData.manufacturer || "미상"} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="manufacturerCode" className="text-sm font-medium mb-1 block">
                통관고유부호
              </Label>
              <Input 
                id="manufacturerCode" 
                value={formData.manufacturerCode || "제조미상9999000"} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 구매자/운송 정보 섹션 */}
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-medium">구매자 및 운송 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="buyerName" className="text-sm font-medium mb-1 block">
                구매자
              </Label>
              <Input 
                id="buyerName" 
                value={formData.buyerName || formData.consigneeName || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="buyerCode" className="text-sm font-medium mb-1 block">
                해외거래처부호
              </Label>
              <Input 
                id="buyerCode" 
                value={formData.buyerCode || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="destinationCountry" className="text-sm font-medium mb-1 block">
                목적국
              </Label>
              <Select
                value={formData.destinationCountry || formData.tradeCountry || ""} 
                onValueChange={(value) => handleSelectChange("destinationCountry", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="국가 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">미국(US)</SelectItem>
                  <SelectItem value="CN">중국(CN)</SelectItem>
                  <SelectItem value="JP">일본(JP)</SelectItem>
                  <SelectItem value="VN">베트남(VN)</SelectItem>
                  <SelectItem value="KR">대한민국(KR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="loadingCountryExport" className="text-sm font-medium mb-1 block">
                적재항
              </Label>
              <Input 
                id="loadingCountryExport" 
                placeholder="KR (대한민국)"
                value={formData.loadingCountryExport || "KR"} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expectedBondedArea" className="text-sm font-medium mb-1 block">
                적재예정보세구역
              </Label>
              <Input 
                id="expectedBondedArea" 
                placeholder="HPNT, 03077011"
                value={formData.expectedBondedArea || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="itemLocation" className="text-sm font-medium mb-1 block">
                물품 소재지
              </Label>
              <Input 
                id="itemLocation" 
                value={formData.itemLocation || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 품목정보 섹션 */}
      <AccordionItem value="item-4">
        <AccordionTrigger className="font-medium">품목 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="hsCode" className="text-sm font-medium mb-1 block">
                세번부호(HS코드)
              </Label>
              <Input 
                id="hsCode" 
                value={formData.hsCode} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="itemNameEng" className="text-sm font-medium mb-1 block">
                품명(영문)
              </Label>
              <Input 
                id="itemNameEng" 
                value={formData.itemNameEng || formData.itemName || ""} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="tradeNameEng" className="text-sm font-medium mb-1 block">
                거래품명(영문)
              </Label>
              <Input 
                id="tradeNameEng" 
                value={formData.tradeNameEng || formData.tradeName || ""} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="modelSpecEng" className="text-sm font-medium mb-1 block">
                모델/규격(영문)
              </Label>
              <Input 
                id="modelSpecEng" 
                value={formData.modelSpecEng || formData.modelSpec || ""} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="invoiceNumber" className="text-sm font-medium mb-1 block">
                송품장부호
              </Label>
              <Input 
                id="invoiceNumber" 
                value={formData.invoiceNumber || ""} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="exportQuantity" className="text-sm font-medium mb-1 block">
                수량
              </Label>
              <Input 
                id="exportQuantity" 
                value={formData.exportQuantity || formData.itemQuantity || ""} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="exportUnit" className="text-sm font-medium mb-1 block">
                단위
              </Label>
              <Select
                value={formData.exportUnit || formData.itemUnit || ""} 
                onValueChange={(value) => handleSelectChange("exportUnit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="단위 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KG">KG</SelectItem>
                  <SelectItem value="EA">EA(개)</SelectItem>
                  <SelectItem value="MT">MT(톤)</SelectItem>
                  <SelectItem value="L">L(리터)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="unitPrice" className="text-sm font-medium mb-1 block">
                단가
              </Label>
              <Input 
                id="unitPrice" 
                value={formData.unitPrice || formData.itemPrice || ""} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="netWeightExport" className="text-sm font-medium mb-1 block">
                순중량(KG)
              </Label>
              <Input 
                id="netWeightExport" 
                value={formData.netWeightExport || formData.netWeight || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="amountExport" className="text-sm font-medium mb-1 block">
                금액
              </Label>
              <Input 
                id="amountExport" 
                value={formData.amountExport || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalWeightExport" className="text-sm font-medium mb-1 block">
                총중량(KG)
              </Label>
              <Input 
                id="totalWeightExport" 
                value={formData.totalWeightExport || formData.grossWeight || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="totalPackagesExport" className="text-sm font-medium mb-1 block">
                총포장개수
              </Label>
              <Input 
                id="totalPackagesExport" 
                value={formData.totalPackagesExport || formData.totalPackages || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* 거래정보 섹션 */}
      <AccordionItem value="item-5">
        <AccordionTrigger className="font-medium">거래 정보</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="exportDeclarationType" className="text-sm font-medium mb-1 block">
                신고구분
              </Label>
              <Select
                value={formData.exportDeclarationType || ""} 
                onValueChange={(value) => handleSelectChange("exportDeclarationType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="신고구분 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E">E (전자상거래 간이 수출)</SelectItem>
                  <SelectItem value="H">H (일반 Paperless)</SelectItem>
                  <SelectItem value="I">I (제조후 Paperless)</SelectItem>
                  <SelectItem value="J">J (세관장 확인 대상)</SelectItem>
                  <SelectItem value="S">S (송품장 간이 수출)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="csTypeExport" className="text-sm font-medium mb-1 block">
                C/S구분
              </Label>
              <Select
                value={formData.csTypeExport || ""} 
                onValueChange={(value) => handleSelectChange("csTypeExport", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="C/S구분 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A (수출 검사 생략)</SelectItem>
                  <SelectItem value="B">B (일반 중앙 검사)</SelectItem>
                  <SelectItem value="R">R (무작위 추출 검사)</SelectItem>
                  <SelectItem value="Y">Y (최초 수출 검사)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="paymentMethodExport" className="text-sm font-medium mb-1 block">
                결제방법
              </Label>
              <Select
                value={formData.paymentMethodExport || formData.paymentMethod || ""} 
                onValueChange={(value) => handleSelectChange("paymentMethodExport", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="결제방법 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L/C">L/C</SelectItem>
                  <SelectItem value="T/T">T/T</SelectItem>
                  <SelectItem value="D/P">D/P</SelectItem>
                  <SelectItem value="D/A">D/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="totalDeclaredPrice" className="text-sm font-medium mb-1 block">
                총신고가격(FOB)
              </Label>
              <Input 
                id="totalDeclaredPrice" 
                value={formData.totalDeclaredPrice || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="freightAmountExport" className="text-sm font-medium mb-1 block">
                운임
              </Label>
              <Input 
                id="freightAmountExport" 
                value={formData.freightAmountExport || formData.freightAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="insuranceAmountExport" className="text-sm font-medium mb-1 block">
                보험료
              </Label>
              <Input 
                id="insuranceAmountExport" 
                value={formData.insuranceAmountExport || formData.insuranceAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="incotermsCurrencyAmount" className="text-sm font-medium mb-1 block">
                결제금액
              </Label>
              <Input 
                id="incotermsCurrencyAmount" 
                placeholder="CFR-KRW-9,999,999.00"
                value={formData.incotermsCurrencyAmount || ""} 
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="refundApplication" className="text-sm font-medium mb-1 block">
                환급신청
              </Label>
              <Select
                value={formData.refundApplication || ""} 
                onValueChange={(value) => handleSelectChange("refundApplication", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="환급신청 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (수출자)</SelectItem>
                  <SelectItem value="2">2 (제조자)</SelectItem>
                  <SelectItem value="">환급 없음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="originCriteriaExport" className="text-sm font-medium mb-1 block">
                원산지 결정기준
              </Label>
              <Select
                value={formData.originCriteriaExport || ""} 
                onValueChange={(value) => handleSelectChange("originCriteriaExport", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="원산지 결정기준 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A (완전 생산)</SelectItem>
                  <SelectItem value="B">B (부가가치 기준-타국산 원재료비 공제)</SelectItem>
                  <SelectItem value="C">C (부가가치 기준-직접 생산비)</SelectItem>
                  <SelectItem value="D">D (가공 공정 기준)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DeclarationForm;
