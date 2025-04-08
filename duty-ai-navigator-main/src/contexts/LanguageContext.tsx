import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Layout
  "appName": {
    en: "AI Customs Officer",
    ko: "AI 관세사"
  },
  "simulation": {
    en: "Customs Simulation",
    ko: "관세 시뮬레이션"
  },
  "declaration": {
    en: "Declaration Form",
    ko: "신고서 작성"
  },
  "calculator": {
    en: "Cost Calculator",
    ko: "비용 계산기"
  },
  "footer.copyright": {
    en: "© {year} AI Customs Officer | All Rights Reserved",
    ko: "© {year} AI 관세사 | 모든 권리 보유"
  },
  "footer.disclaimer": {
    en: "Simulation results are for reference only and may differ from actual customs duties.",
    ko: "해당 시뮬레이션 결과는 참고용이며, 실제 관세와 차이가 있을 수 있습니다."
  },
  // Home page
  "home.tagline": {
    en: "Manage customs clearance procedures more easily and efficiently with AI-powered customs simulation.",
    ko: "AI 기술을 활용한 관세 시뮬레이션으로 수출입 통관 절차를 더 쉽고 효율적으로 관리하세요."
  },
  "home.getStarted": {
    en: "Get Started",
    ko: "지금 시작하기"
  },
  "home.simulation.title": {
    en: "Customs Simulation",
    ko: "관세 시뮬레이션"
  },
  "home.simulation.desc": {
    en: "Check HS code classification and estimated customs duties for import/export goods using AI technology.",
    ko: "AI 기술을 활용하여 수출입 물품에 대한 HS 코드 분류 및 예상 관세액을 미리 확인하세요."
  },
  "home.simulation.feature1": {
    en: "AI classification based on product name or customs documents",
    ko: "품명 또는 통관 서류 기반 AI 품목분류"
  },
  "home.simulation.feature2": {
    en: "Instant calculation of expected customs duties",
    ko: "예상 관세액 즉시 계산"
  },
  "home.simulation.feature3": {
    en: "Automatic application of FTA rates",
    ko: "FTA 협정세율 자동 적용"
  },
  "home.simulation.start": {
    en: "Start Simulation",
    ko: "시뮬레이션 시작"
  },
  "home.declaration.title": {
    en: "Declaration Form",
    ko: "신고서 작성"
  },
  "home.declaration.desc": {
    en: "Easily create formal customs declaration forms based on simulation results.",
    ko: "시뮬레이션 결과를 바탕으로 정식 통관 신고서를 간편하게 작성하세요."
  },
  "home.declaration.feature1": {
    en: "Automatic synchronization with simulation results",
    ko: "시뮬레이션 결과 자동 연동"
  },
  "home.declaration.feature2": {
    en: "Complies with customs office standard formats",
    ko: "관세청 표준 양식 준수"
  },
  "home.declaration.feature3": {
    en: "Auto-completion of additional information",
    ko: "부가 정보 자동 완성 기능"
  },
  "home.declaration.start": {
    en: "Create Declaration",
    ko: "신고서 작성"
  },
  "home.calculator.title": {
    en: "Cost Calculator",
    ko: "비용 계산기"
  },
  "home.calculator.desc": {
    en: "Calculate additional customs-related costs and compare costs across different scenarios.",
    ko: "통관 관련 추가 비용을 계산하고 시나리오별 비용 차이를 비교하세요."
  },
  "home.calculator.feature1": {
    en: "Detailed calculation of various cost items",
    ko: "다양한 비용 항목 상세 계산"
  },
  "home.calculator.feature2": {
    en: "Cost comparison by scenario",
    ko: "시나리오별 비용 비교 기능"
  },
  "home.calculator.feature3": {
    en: "Cost optimization recommendations",
    ko: "비용 최적화 추천"
  },
  "home.calculator.start": {
    en: "Calculate Costs",
    ko: "비용 계산하기"
  },
  "home.simplify.title": {
    en: "Simplify Complex Customs Procedures",
    ko: "복잡한 통관 과정을 간소화하세요"
  },
  "home.simplify.desc": {
    en: "AI Customs Officer simplifies complex clearance procedures in a 'classify first, review later' format, helping you preview expected taxes and find the optimal customs clearance method.",
    ko: "AI 관세사는 복잡한 통관 절차를 \"선분류 후검토\" 형태로 단순화하여, 예상 세금을 미리 확인하고 최적의 통관 방법을 모색할 수 있도록 돕습니다."
  },
  // Simulation Page
  "simulation.heading": {
    en: "Customs Simulation",
    ko: "관세 시뮬레이션"
  },
  "simulation.step1": {
    en: "1. Enter Information",
    ko: "1. 정보 입력"
  },
  "simulation.step2": {
    en: "2. AI Analysis",
    ko: "2. AI 분석"
  },
  "simulation.step3": {
    en: "3. Review Results",
    ko: "3. 결과 검토"
  },
  "simulation.result.title": {
    en: "Simulation Results Summary",
    ko: "시뮬레이션 결과 요약"
  },
  "simulation.result.analysis": {
    en: "Analysis Results",
    ko: "분석 결과"
  },
  "simulation.result.copy": {
    en: "Copy Results",
    ko: "결과 복사"
  },
  "simulation.result.copied": {
    en: "Copied",
    ko: "복사됨"
  },
  "simulation.result.hsCode": {
    en: "HS Code",
    ko: "HS 코드"
  },
  "simulation.result.productName": {
    en: "Product Name",
    ko: "품목명"
  },
  "simulation.result.importType": {
    en: "Import/Export",
    ko: "수출입 구분"
  },
  "simulation.result.import": {
    en: "Import",
    ko: "수입"
  },
  "simulation.result.export": {
    en: "Export",
    ko: "수출"
  },
  "simulation.result.originCountry": {
    en: "Origin Country",
    ko: "원산지 국가"
  },
  "simulation.result.value": {
    en: "Item Value",
    ko: "물품 가액"
  },
  "simulation.result.confidence": {
    en: "AI Classification Confidence",
    ko: "AI 분류 신뢰도"
  },
  "simulation.result.customsInfo": {
    en: "Customs Information",
    ko: "관세 정보"
  },
  "simulation.result.baseRate": {
    en: "Base Duty Rate",
    ko: "기본 관세율"
  },
  "simulation.result.ftaRate": {
    en: "FTA Preferential Rate",
    ko: "FTA 협정세율"
  },
  "simulation.result.estimatedDuty": {
    en: "Estimated Duty",
    ko: "예상 관세액"
  },
  "simulation.result.appliedRate": {
    en: "Applied Rate",
    ko: "적용 세율"
  },
  "simulation.result.reasoning": {
    en: "AI Classification Rationale",
    ko: "AI 분류 판단 근거"
  },
  "simulation.result.expand": {
    en: "Expand",
    ko: "펼치기"
  },
  "simulation.result.collapse": {
    en: "Collapse",
    ko: "접기"
  },
  "simulation.result.uploadedDocs": {
    en: "Uploaded Customs Documents",
    ko: "업로드된 통관 서류"
  },
  "simulation.result.saveSimulation": {
    en: "Save Simulation",
    ko: "시뮬레이션 저장"
  },
  "simulation.result.simulationName": {
    en: "Enter simulation name",
    ko: "시뮬레이션 이름을 입력하세요"
  },
  "simulation.result.save": {
    en: "Save",
    ko: "저장"
  },
  "simulation.result.prev": {
    en: "Previous Step",
    ko: "이전 단계"
  },
  "simulation.result.declare": {
    en: "Create Declaration",
    ko: "직접 신고하기"
  },
  "simulation.result.loadSaved": {
    en: "Load Saved Simulations",
    ko: "저장된 시뮬레이션 불러오기"
  },
  "simulation.documentType": {
    en: "Document Type",
    ko: "문서 종류"
  },
  "simulation.documentType.invoice": {
    en: "Commercial Invoice",
    ko: "Commercial Invoice"
  },
  "simulation.documentType.packing": {
    en: "Packing List",
    ko: "Packing List"
  },
  "simulation.documentType.bl": {
    en: "Bill of Lading (B/L)",
    ko: "Bill of Lading (B/L)"
  },
  "simulation.documentType.other": {
    en: "Other Document",
    ko: "기타 서류"
  },
  "simulation.documentType.aiDetected": {
    en: "AI Detection",
    ko: "AI 판별"
  },
  // Toast messages for simulation
  "toast.save.success": {
    en: "Successfully saved",
    ko: "저장 완료"
  },
  "toast.save.error": {
    en: "Save error",
    ko: "저장 오류"
  },
  "toast.save.description.success": {
    en: "The simulation was successfully saved.",
    ko: "시뮬레이션이 성공적으로 저장되었습니다."
  },
  "toast.save.description.error": {
    en: "An error occurred while saving the simulation.",
    ko: "시뮬레이션을 저장하는 중에 오류가 발생했습니다."
  },
  "toast.load.success": {
    en: "Load complete",
    ko: "불러오기 완료"
  },
  "toast.load.description": {
    en: "Saved simulation successfully loaded.",
    ko: "저장된 시뮬레이션을 성공적으로 불러왔습니다."
  },
  "toast.delete.success": {
    en: "Delete complete",
    ko: "삭제 완료"
  },
  "toast.delete.error": {
    en: "Delete error",
    ko: "삭제 오류"
  },
  "toast.delete.description.success": {
    en: "The simulation was successfully deleted.",
    ko: "시뮬레이션이 성공적으로 삭제되었습니다."
  },
  "toast.delete.description.error": {
    en: "An error occurred while deleting the simulation.",
    ko: "시뮬레이션을 삭제하는 중에 오류가 발생했습니다."
  },
  // Calculator Page
  "calculator.heading": {
    en: "Cost Calculator",
    ko: "비용 계산기"
  },
  "calculator.title": {
    en: "Cost Calculation",
    ko: "비용 계산"
  },
  "calculator.basicInfo": {
    en: "Basic Information",
    ko: "기본 정보"
  },
  "calculator.importExport": {
    en: "Import/Export",
    ko: "수출입 구분"
  },
  "calculator.hsCode": {
    en: "HS Code",
    ko: "HS 코드"
  },
  "calculator.incoterms": {
    en: "Incoterms",
    ko: "인코텀즈"
  },
  "calculator.origin": {
    en: "Origin",
    ko: "원산지"
  },
  "calculator.destination": {
    en: "Destination",
    ko: "도착지"
  },
  "calculator.totalCost": {
    en: "Total Cost",
    ko: "총 비용"
  },
  "calculator.krwEquivalent": {
    en: "KRW Equivalent",
    ko: "원화 환산"
  },
  "calculator.costDetails": {
    en: "Cost Item Details",
    ko: "비용 항목 상세"
  },
  "calculator.category": {
    en: "Category",
    ko: "카테고리"
  },
  "calculator.category.customs": {
    en: "Customs",
    ko: "관세"
  },
  "calculator.category.freight": {
    en: "Freight",
    ko: "운송비"
  },
  "calculator.category.warehouse": {
    en: "Warehouse",
    ko: "창고료"
  },
  "calculator.category.insurance": {
    en: "Insurance",
    ko: "보험료"
  },
  "calculator.category.other": {
    en: "Other",
    ko: "기타"
  },
  "calculator.itemName": {
    en: "Item Name",
    ko: "항목명"
  },
  "calculator.amount": {
    en: "Amount",
    ko: "금액"
  },
  "calculator.currency": {
    en: "Currency",
    ko: "통화"
  },
  "calculator.krwAmount": {
    en: "KRW Amount",
    ko: "원화 금액"
  },
  "calculator.categoryTotal": {
    en: "Category Totals",
    ko: "카테고리별 비용"
  },
  "calculator.ratio": {
    en: "Ratio",
    ko: "비율"
  },
  "calculator.total": {
    en: "Total",
    ko: "총계"
  },
  "calculator.preview": {
    en: "Preview",
    ko: "미리보기"
  },
  "calculator.downloadPDF": {
    en: "Download PDF",
    ko: "PDF 다운로드"
  },
  "calculator.save": {
    en: "Save",
    ko: "저장하기"
  },
  "calculator.close": {
    en: "Close",
    ko: "닫기"
  },
  "calculator.saveCalculation": {
    en: "Save Calculation",
    ko: "비용 계산 저장"
  },
  "calculator.calculationName": {
    en: "Calculation Name",
    ko: "계산 이름"
  },
  "calculator.calculationNamePlaceholder": {
    en: "e.g., US Electronics Import Costs",
    ko: "예: 미국 전자제품 수입 비용"
  },
  "calculator.cancel": {
    en: "Cancel",
    ko: "취소"
  },
  "calculator.costSheetPreview": {
    en: "Cost Sheet Preview",
    ko: "비용 계산서 미리보기"
  },
  "calculator.generatedDate": {
    en: "Generation Date",
    ko: "생성일"
  },
  "calculator.disclaimer": {
    en: "This cost sheet is provided for reference only. Actual costs may vary depending on circumstances.",
    ko: "본 비용 계산서는 참고용으로 제공되며, 실제 비용은 상황에 따라 다를 수 있습니다."
  },
  // Toast messages for calculator
  "toast.calculator.save.success": {
    en: "Save Complete",
    ko: "저장 완료"
  },
  "toast.calculator.save.description": {
    en: "Cost calculation successfully saved.",
    ko: "비용 계산이 성공적으로 저장되었습니다."
  },
  "toast.calculator.save.error": {
    en: "Save Error",
    ko: "저장 오류"
  },
  "toast.calculator.save.error.description": {
    en: "An error occurred while saving the calculation.",
    ko: "비용 계산을 저장하는 중에 오류가 발생했습니다."
  },
  "toast.calculator.load.success": {
    en: "Load Complete",
    ko: "불러오기 완료"
  },
  "toast.calculator.load.description": {
    en: "Saved cost calculation successfully loaded.",
    ko: "저장된 비용 계산을 성공적으로 불러왔습니다."
  },
  "toast.calculator.delete.success": {
    en: "Delete Complete",
    ko: "삭제 완료"
  },
  "toast.calculator.delete.description": {
    en: "Cost calculation successfully deleted.",
    ko: "비용 계산이 성공적으로 삭제되었습니다."
  },
  "toast.calculator.delete.error": {
    en: "Delete Error",
    ko: "삭제 오류"
  },
  "toast.calculator.delete.error.description": {
    en: "An error occurred while deleting the calculation.",
    ko: "비용 계산을 삭제하는 중에 오류가 발생했습니다."
  },
  "toast.calculator.pdf.success": {
    en: "PDF Generation Complete",
    ko: "PDF 생성 완료"
  },
  "toast.calculator.pdf.description": {
    en: "Cost sheet PDF has been downloaded.",
    ko: "비용 계산서 PDF가 다운로드되었습니다."
  },
  "toast.calculator.pdf.error": {
    en: "PDF Generation Error",
    ko: "PDF 생성 오류"
  },
  "toast.calculator.pdf.error.description": {
    en: "An error occurred while generating the PDF.",
    ko: "PDF를 생성하는 동안 오류가 발생했습니다."
  },
  "toast.calculator.documentType": {
    en: "Document Type Changed",
    ko: "문서 타입 변경"
  },
  "toast.calculator.documentType.description": {
    en: "Document type has been changed to {type}.",
    ko: "문서 타입이 {type}(으)로 변경되었습니다."
  },
  // SimulationInput component
  "simulation.input.heading": {
    en: "Customs Simulation Information",
    ko: "관세 시뮬레이션 정보 입력"
  },
  "simulation.input.loadSaved": {
    en: "Load Saved Simulations",
    ko: "저장된 시뮬레이션 불러오기"
  },
  "simulation.input.importExport": {
    en: "Import/Export Type",
    ko: "수출입 구분"
  },
  "simulation.input.import": {
    en: "Import",
    ko: "수입"
  },
  "simulation.input.export": {
    en: "Export",
    ko: "수출"
  },
  "simulation.input.uploadDocument": {
    en: "Upload Customs Document",
    ko: "통관물품 관련 서류 업로드"
  },
  "simulation.input.uploadOptional": {
    en: "(Optional, Max 10MB)",
    ko: "(선택사항, 최대 10MB)"
  },
  "simulation.input.dragDrop": {
    en: "Drag and drop a file or click to upload",
    ko: "파일을 드래그하거나 클릭하여 업로드하세요"
  },
  "simulation.input.uploadHint": {
    en: "Upload any document that can help identify the item you wish to clear through customs.\n(e.g., CI, PL, BL, CO, product photos, etc.)",
    ko: "통관하고자 하는 물품을 확인 할 수 있는 어떤 서류든 업로드 해주세요.\n(예) CI, PL, BL, CO, 물품사진 등"
  },
  "simulation.input.fileTypes": {
    en: "Supported file formats: PDF, JPG, PNG, TIF, XLS, DOCX",
    ko: "지원 파일 형식: PDF, JPG, PNG, TIF, XLS, DOCX"
  },
  "simulation.input.description": {
    en: "Product Name/Description",
    ko: "품명/제품 설명"
  },
  "simulation.input.descriptionRequired": {
    en: "(Either product description or customs document is required)",
    ko: "(품명/제품 설명 또는 통관 서류 중 하나는 필수)"
  },
  "simulation.input.descriptionPlaceholder": {
    en: "For a more accurate simulation, enter additional information such as purpose, material, or special characteristics of the import/export item.",
    ko: "수출입 물품에 대한 용도나 재질, 특이사항 등 추가 정보를 입력하면 더 정확한 시뮬레이션이 가능합니다."
  },
  "simulation.input.origin": {
    en: "Origin Country",
    ko: "원산지 국가"
  },
  "simulation.input.destination": {
    en: "Export Destination",
    ko: "수출 대상국"
  },
  "simulation.input.optional": {
    en: "(Optional)",
    ko: "(선택사항)"
  },
  "simulation.input.selectOrigin": {
    en: "Select origin country",
    ko: "원산지 국가 선택"
  },
  "simulation.input.exportNote": {
    en: "Currently, only the U.S. is supported as an export destination. More countries will be added in future updates.",
    ko: "현재 수출 대상국은 미국만 지원 가능하며 향후 추가 업데이트 예정입니다."
  },
  "simulation.input.value": {
    en: "Item Value (USD)",
    ko: "물품 가액 (USD)"
  },
  "simulation.input.valuePlaceholder": {
    en: "Enter the total value of the item",
    ko: "물품의 총 가액을 입력해주세요."
  },
  "simulation.input.start": {
    en: "Start Analysis",
    ko: "분석 시작"
  },
  "simulation.input.analyzing": {
    en: "Analyzing...",
    ko: "분석 중..."
  },
  "simulation.input.noResults": {
    en: "No search results",
    ko: "검색 결과가 없습니다"
  },
  // Error messages
  "error.fileFormat": {
    en: "Invalid File Format",
    ko: "파일 형식 오류"
  },
  "error.fileFormatDesc": {
    en: "Only PDF, JPG, PNG, TIF, XLS, DOCX files are supported.",
    ko: "PDF, JPG, PNG, TIF, XLS, DOCX 형식의 파일만 업로드 가능합니다."
  },
  "error.fileSize": {
    en: "File Size Exceeded",
    ko: "파일 크기 초과"
  },
  "error.fileSizeDesc": {
    en: "File size must be under 10MB.",
    ko: "파일 크기는 10MB 이하여야 합니다."
  },
  "error.input": {
    en: "Input Error",
    ko: "입력 오류"
  },
  "error.inputDesc": {
    en: "Please provide a product description or upload a customs document.",
    ko: "품명/제품 설명 또는 통관 관련 서류를 제공해주세요."
  },
  "country.US": {
    en: "United States",
    ko: "미국"
  },
  "country.CN": {
    en: "China",
    ko: "중국"
  },
  "country.JP": {
    en: "Japan",
    ko: "일본"
  },
  "country.KR": {
    en: "South Korea",
    ko: "한국"
  },
  "currency.KRW": {
    en: "KRW",
    ko: "원"
  },
  "unknown": {
    en: "Unknown",
    ko: "알 수 없음"
  },
  // Simulation analysis
  "simulation.analysis.title": {
    en: "AI Analysis",
    ko: "AI 분석"
  },
  "simulation.analysis.processing": {
    en: "Processing your information...",
    ko: "정보를 처리하는 중입니다..."
  },
  "simulation.analysis.hsCodeResult": {
    en: "HS Code Analysis Result",
    ko: "HS 코드 분석 결과"
  },
  "simulation.analysis.hsCode": {
    en: "HS Code",
    ko: "HS 코드"
  },
  "simulation.analysis.description": {
    en: "Description",
    ko: "설명"
  },
  "simulation.analysis.verifyData": {
    en: "Please verify the following information:",
    ko: "다음 정보를 확인해주세요:"
  },
  "simulation.analysis.next": {
    en: "Next",
    ko: "다음"
  },
  "simulation.analysis.back": {
    en: "Back",
    ko: "이전"
  },
  // Update simulation input translations
  "simulation.input.productName": {
    en: "Product Name",
    ko: "품명"
  },
  "simulation.input.required": {
    en: "(Required)",
    ko: "(필수)"
  },
  "simulation.input.productNamePlaceholder": {
    en: "Enter the product name",
    ko: "품명을 입력해주세요"
  },
  "simulation.input.productNameHint": {
    en: "Enter the exact product name for accurate customs simulation",
    ko: "정확한 통관 시뮬레이션을 위해 정확한 품명을 입력해주세요"
  },
  "simulation.input.additionalDescription": {
    en: "Additional Product Description",
    ko: "제품 추가 설명"
  },
  "simulation.input.additionalDescriptionOptional": {
    en: "(Optional)",
    ko: "(선택사항)"
  },
  "simulation.input.additionalDescriptionPlaceholder": {
    en: "For a more accurate simulation, enter additional information such as purpose, material, or special characteristics of the import/export item.",
    ko: "수출입 물품에 대한 용도나 재질, 특이사항 등 추가 정보를 입력하면 더 정확한 시뮬레이션이 가능합니다."
  },
  "simulation.input.productNameExtracted": {
    en: "Product Name Extracted",
    ko: "품명 추출 완료"
  },
  "simulation.input.productNameExtractedDesc": {
    en: "Product name has been automatically extracted from the uploaded document.",
    ko: "업로드한 문서에서 품명이 자동으로 추출되었습니다."
  },
  "error.extraction": {
    en: "Extraction Error",
    ko: "추출 오류"
  },
  "error.extractionDesc": {
    en: "Failed to extract product name from the document.",
    ko: "문서에서 품명을 추출하는데 실패했습니다."
  },
  "error.productName": {
    en: "Product Name Required",
    ko: "품명 필수 입력"
  },
  "error.productNameRequired": {
    en: "Please enter a product name.",
    ko: "품명을 입력해주세요."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key]?.[language];
    
    if (!translation) {
      return key;
    }
    
    if (key === 'footer.copyright') {
      return translation.replace('{year}', new Date().getFullYear().toString());
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
