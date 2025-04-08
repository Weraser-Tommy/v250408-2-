
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileIcon, FileText, File, FileX, Calculator } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SimulationAnalysisProps {
  inputData: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

type DocumentType = 'invoice' | 'packing' | 'bl' | 'other';

const SimulationAnalysis: React.FC<SimulationAnalysisProps> = ({ inputData, onNext, onBack }) => {
  const { toast } = useToast();
  const isLoadedSimulation = inputData.hsCode !== undefined;
  const [isLoading, setIsLoading] = useState(!isLoadedSimulation);
  
  const [hsCode, setHsCode] = useState(inputData.hsCode || '');
  const [confidenceScore, setConfidenceScore] = useState(inputData.confidenceScore || 0);
  const [baseRate, setBaseRate] = useState(inputData.baseRate || 0);
  const [ftaRate, setFtaRate] = useState<number | null>(inputData.ftaRate !== undefined ? inputData.ftaRate : null);
  const [originCountry, setOriginCountry] = useState(inputData.originCountry || '');
  const [openCountrySelect, setOpenCountrySelect] = useState(false);
  const [value, setValue] = useState(inputData.value || '');
  const [estimatedDuty, setEstimatedDuty] = useState(inputData.estimatedDuty || 0);
  const [productName, setProductName] = useState(inputData.productName || '');
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [documentType, setDocumentType] = useState<DocumentType | ''>(inputData.documentType || '');
  const [aiReasoning, setAiReasoning] = useState(inputData.aiReasoning || '');
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [needsCalculation, setNeedsCalculation] = useState(false);
  const [isCalculated, setIsCalculated] = useState(!!isLoadedSimulation);
  
  const [declarationDate, setDeclarationDate] = useState<Date>(
    inputData.declarationDate ? new Date(inputData.declarationDate) : new Date()
  );
  
  const [exchangeRate, setExchangeRate] = useState(inputData.exchangeRate || 1333.33);
  
  // Store the original values to detect changes
  const originalValues = useRef({
    hsCode: inputData.hsCode || '',
    originCountry: inputData.originCountry || '',
    value: inputData.value || '',
    declarationDate: inputData.declarationDate ? new Date(inputData.declarationDate) : new Date()
  });

  // Countries list
  const countries = [
    { code: "UNKNOWN", name: "알 수 없음" },
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

  // Generate AI reasoning based on product description
  const generateAiReasoning = () => {
    let reasoning = '';
    
    if (inputData.description.includes("전자") || inputData.description.includes("컴퓨터")) {
      reasoning = `
      ### AI 품목 분석 보고서

      **제품명**: 노트북 컴퓨터
      **HS 코드**: 8471.30.0000
      
      #### 분석 근거
      
      제출하신 제품에 대한 설명과 문서를 분석한 결과, 해당 제품은 "휴대용 자동자료처리기계(노트북 컴퓨터)"로 분류됩니다. 관세율표 제8471호에 따르면 "자동자료처리기계와 그 단위기기"를 규정하고 있으며, 특히 제8471.30호는 "휴대용 자동자료처리기계(중량이 10킬로그램 이하인 것으로서 적어도 중앙처리장치, 키보드 및 디스플레이를 갖추고 있는 것으로 한정한다)"를 명시하고 있습니다.
      
      제품이 다음 특성을 갖추고 있다고 판단되어 이 분류에 해당합니다:
      
      1. **휴대성**: 무게가 10kg 이하인 휴대용 컴퓨터입니다.
      2. **통합 구성요소**: 중앙처리장치(CPU), 키보드, 디스플레이를 하나의 기기에 통합하고 있습니다.
      3. **자동자료처리 기능**: 프로그램에 따라 논리연산과 산술연산을 수행할 수 있는 중앙처리장치를 갖추고 있습니다.
      4. **입출력 장치**: 키보드를 통한 입력과 디스플레이를 통한 출력이 가능합니다.
      
      관련 국내외 법령 및 판례:
      
      1. **관세법 별표 관세율표 통칙 제1호**: "표제, 부, 류, 절의 명칭은 참조의 편의를 위해 사용되며, 법적 분류는 해당 호의 용어와 주(註) 및 이 통칙에 따라 결정한다."
      
      2. **관세율표 제16부 주 제3호**: "둘 이상의 기계가 함께 작동하도록 결합되어 하나의 전체를 구성하는 기계는 그 전체를 구성하는 기계의 주된 기능에 따라 분류한다."
      
      3. **관세율표 제84류 주 제5호 마목**: "자동자료처리기계는 중앙처리장치, 입력장치, 출력장치를 갖추고 있어야 하며, 이들 장치는 함께 작동하는 시스템으로 제시되어야 한다."
      
      4. **대법원 판례 2015두57343**: "물품 분류에 있어 관세율표의 품목분류체계상 같은 호에 분류될 수 있는 물품 간의 분류에 관해서는 일반적으로 구체적인 물품에 특정되는 호가 포괄적인 물품에 특정되는 호에 우선한다."
      
      5. **WCO(세계관세기구) HSC 결정례 8471.30/1**: "휴대용 컴퓨터의 분류는 크기 및 무게뿐 아니라 일체형으로 설계되어 이동 중에도 사용할 수 있는지 여부가 중요하다."
      
      세계관세기구(WCO)의 분류 의견서 및 전 세계 관세당국의 판결례에서도, 귀하가 제출한 특성을 지닌 노트북 컴퓨터는 일관되게 HS 8471.30 하위에 분류하고 있습니다.
      
      추가적으로, 제출하신 자료에서 확인된 사양(CPU, 메모리, 저장장치, 디스플레이 등)은 모두 일반적인 노트북 컴퓨터의 특성을 나타내고 있으며, 다른 HS 코드로 분류될만한 특수 기능이나 용도를 가지고 있지 않습니다.
      
      #### 관세율 적용
      
      해당 HS 코드에 적용되는 기본 관세율은 8%입니다. 그러나 원산지가 미국인 경우, 한-미 FTA에 따라 0%의 협정세율이 적용됩니다. 귀하의 제품이 미국산임을 증명하는 원산지증명서가 있을 경우, 이 협정세율을 적용받을 수 있습니다.
      
      #### 기타 고려사항
      
      1. **부가가치세**: 수입 시 관세와 별도로 10%의 부가가치세가 부과됩니다.
      2. **관련 규제**: 전파법에 따른 KC 인증이 필요할 수 있으며, 배터리가 포함된 경우 위험물 안전 규정이 적용될 수 있습니다.
      3. **소프트웨어 라이선스**: 컴퓨터에 설치된 소프트웨어의 라이선스 비용도 과세가격에 포함될 수 있습니다.
      
      이 분석은 제공된 정보를 기반으로 하였으며, 실제 제품의 특성이나 추가 정보에 따라 분류가 달라질 수 있습니다.`;
    } else if (inputData.description.includes("옷") || inputData.description.includes("의류")) {
      reasoning = `
      ### AI 품목 분석 보고서

      **제품명**: 여성용 면 재킷
      **HS 코드**: 6104.32.0000
      
      #### 분석 근거
      
      제출하신 제품에 대한 설명과 문서를 분석한 결과, 해당 제품은 "여성용 면 재킷"으로 분류됩니다. 관세율표 제61류에서는 "의류와 그 부속품(메리야스 편물이나 뜨개질 편물만 해당한다)"을 다루고 있으며, 특히 제6104호는 "여성용이나 소녀용 슈트·앙상블·재킷·블레이저·드레스·스커트·치마바지·긴 바지·가슴받이와 멜빵이 있는 바지·짧은 바지(메리야스 편물이나 뜨개질 편물로 한정한다)"를 명시하고 있습니다.
      
      구체적으로 제6104.32호는 "면으로 만든 여성용 재킷"에 해당하며, 제공된 정보에 따르면 이 제품은 다음과 같은 특성을 갖추고 있다고 판단됩니다:
      
      1. **소재**: 면(cotton) 소재로 만들어졌습니다.
      2. **용도**: 여성용 의류입니다.
      3. **형태**: 재킷 형태로, 앞이 열리는 구조로 되어 있습니다.
      4. **제작 방식**: 메리야스 편물 또는 뜨개질 편물로 제작되었습니다.
      
      관련 국내외 법령 및 판례:
      
      1. **관세율표 제11부 주 제7호**: "이 부에서 '메리야스 편물'이란 경사(經絲)를 따라 연결된 실(thread)의 연속적인 고리로 형성된 것으로서, 각 고리를 통하여 다른 실이 통과함으로써 이어진 편물을 말한다."
      
      2. **관세율표 제61류 주 제4호**: "제6101호와 제6102호에는 허리 아랫부분까지 내려오는 의류와 적어도 허리 부분을 덮는 의류(제6101호 및 제6102호의 의류는 제외한다)로서 몸 앞부분이 열리고 소매가 있는 것을 분류한다."
      
      3. **관세율표 통칙 제3호 나목**: "혼합물, 서로 다른 재료로 구성되거나 서로 다른 구성요소로 이루어진 복합물과 소매용으로 하기 위하여 세트로 된 물품으로서 가목에 따라 분류할 수 없는 것은 가능한 한 이들 물품에 본질적인 특성을 부여하는 재료나 구성요소로 이루어진 물품으로 보아 분류한다."
      
      4. **대법원 판례 2014두12572**: "의류의 분류에 있어서는 그 형태, 용도, 재질 등을 종합적으로 고려하여 분류하여야 한다."
      
      5. **WCO(세계관세기구) 분류의견 6104.32/1**: "면직물로 된 여성용 재킷으로 편물제의 것은 HS 코드 6104.32에 분류된다."
      
      세계관세기구(WCO)의 분류 의견서 및 전 세계 관세당국의 판결례에서도, 귀하가 제출한 특성을 지닌 여성용 면 재킷은 일관되게 HS 6104.32 하위에 분류하고 있습니다.
      
      추가적으로, 제출하신 자료에서 확인된 제품 특성(여성용, 면 소재, 재킷 형태, 니트 제품)은 모두 HS 6104.32.0000으로 분류되기 위한 핵심 요건을 충족하고 있으며, 다른 HS 코드로 분류될만한 특수 기능이나 용도를 가지고 있지 않습니다.
      
      #### 관세율 적용
      
      해당 HS 코드에 적용되는 기본 관세율은 13%입니다. 그러나 원산지가 미국인 경우, 한-미 FTA에 따라 0%의 협정세율이 적용됩니다. 귀하의 제품이 미국산임을 증명하는 원산지증명서가 있을 경우, 이 협정세율을 적용받을 수 있습니다.
      
      #### 기타 고려사항
      
      1. **원산지 결정기준**: 면 재킷의 경우, 한-미 FTA에서는 "역내에서 직물의 제직과 의류의 재단 및 봉제가 모두 이루어진 경우" 원산지로 인정합니다.
      2. **안전규제**: KC 인증 중 안전확인 대상 품목에 해당할 수 있습니다. 특히 유아용이나 특수 처리된 의류의 경우 추가적인 안전 검사가 필요할 수 있습니다.
      3. **표시사항**: 섬유의류의 경우, 원산지, 소재, 세탁방법 등의 표시사항이 요구됩니다.
      
      이 분석은 제공된 정보를 기반으로 하였으며, 실제 제품의 특성이나 추가 정보에 따라 분류가 달라질 수 있습니다.`;
    } else {
      reasoning = `
      ### AI 품목 분석 보고서

      **제품명**: 완구
      **HS 코드**: 9503.00.3100
      
      #### 분석 근거
      
      제출하신 제품에 대한 설명과 문서를 분석한 결과, 해당 제품은 "완구(장난감)"로 분류됩니다. 관세율표 제95류에서는 "완구·유희용구·운동용구와 이들의 부분품과 부속품"을 다루고 있으며, 특히 제9503호는 "세발자전거·스쿠터·페달 자동차와 이와 유사한 바퀴가 달린 완구, 인형용 차, 인형, 기타 완구, 축소 모형과 이와 유사한 오락용 모형(작동하는 것인지에 상관없다), 각종 퍼즐"을 명시하고 있습니다.
      
      구체적으로 제9503.00.31호는 "기타의 조립식 완구(건설용 완구)"에 해당하며, 제공된 정보에 따르면 이 제품은 다음과 같은 특성을 갖추고 있다고 판단됩니다:
      
      1. **용도**: 오락 및 놀이용으로 설계된 제품입니다.
      2. **구성**: 여러 부품을 조립하여 건설물이나 구조물을 만들 수 있는 제품입니다.
      3. **대상 연령**: 어린이를 위한 제품으로, 교육적 요소가 포함되어 있습니다.
      4. **재질**: 주로 플라스틱 재질로 만들어졌습니다.
      
      관련 국내외 법령 및 판례:
      
      1. **관세율표 제95류 주 제1호**: "이 류에는 다음 각 목의 것을 포함하지 않는다. (가) 크리스마스 양초, 크리스마스트리용 장식품[촛대·유리구슬·전구 등], 크리스마스 폭죽 또는 이와 유사한 물품, 크리스마스트리용 거치대[제9505호]" - 이 제품은 이러한 제외 대상에 해당하지 않습니다.
      
      2. **관세율표 제95류 주 제4호**: "제9503호에서 '기타의 완구'란 본질적으로 사람(어린이 또는 성인)의 오락을 위하여 의도된 물품을 말한다." - 이 제품은 어린이의 오락을 위한 제품으로 이 정의에 해당합니다.
      
      3. **관세율표 통칙 제3호 가목**: "가장 특정한 표현으로 품명이 기재된 호가 일반적인 표현으로 품명이 기재된 호보다 우선한다." - 이 제품은 "조립식 완구(건설용 완구)"라는 특정한 표현에 해당하므로 이 원칙에 따라 분류됩니다.
      
      4. **대법원 판례 2018두41252**: "완구로서의 본질적 특성을 갖추고 있는지 여부는 제품의 객관적 특성, 포장 형태, 판매 방식, 광고 선전 내용 등을 종합적으로 고려하여 판단하여야 한다." - 이 제품은 완구로서의 본질적 특성을 갖추고 있습니다.
      
      5. **WCO(세계관세기구) 분류의견 9503.00/4**: "조립식 블록으로 구성된 건설용 완구는 HS 코드 9503.00.3100에 분류된다." - 이 제품은 이러한 분류 의견에 부합합니다.
      
      세계관세기구(WCO)의 분류 의견서 및 전 세계 관세당국의 판결례에서도, 귀하가 제출한 특성을 지닌 완구는 일관되게 HS 9503.00.31 하위에 분류하고 있습니다.
      
      추가적으로, 제출하신 자료에서 확인된 제품 특성(조립식 블록, 건설용 완구, 어린이용 놀이기구)은 모두 HS 9503.00.3100으로 분류되기 위한 핵심 요건을 충족하고 있습니다.
      
      #### 관세율 적용
      
      해당 HS 코드에 적용되는 기본 관세율은 8%입니다. 그러나 원산지가 미국인 경우, 한-미 FTA에 따라 0%의 협정세율이 적용됩니다. 귀하의 제품이 미국산임을 증명하는 원산지증명서가 있을 경우, 이 협정세율을 적용받을 수 있습니다.
      
      #### 기타 고려사항
      
      1. **안전인증**: 완구류는 어린이제품 안전 특별법에 따라 KC 안전인증이 필요합니다. 특히, 3세 이하 어린이용 완구는 더욱 엄격한 안전기준이 적용됩니다.
      2. **유해물질**: 완구류에는 프탈레이트 등 특정 유해물질 함유 제한이 있습니다.
      3. **표시사항**: 제조국, 제조자, 수입자, 사용연령, 주의사항 등의 표시가 필요합니다.
      
      이 분석은 제공된 정보를 기반으로 하였으며, 실제 제품의 특성이나 추가 정보에 따라 분류가 달라질 수 있습니다.`;
    }
    
    return reasoning;
  };

  useEffect(() => {
    if (isLoadedSimulation) {
      // If this is a loaded simulation, use its aiReasoning if available
      if (inputData.aiReasoning) {
        setAiReasoning(inputData.aiReasoning);
      }
      setIsLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      if (inputData.description.includes("전자") || inputData.description.includes("컴퓨터")) {
        setHsCode('8471.30.0000');
        setProductName('노트북 컴퓨터');
        setBaseRate(8);
        if (originCountry === 'US') setFtaRate(0);
      } else if (inputData.description.includes("옷") || inputData.description.includes("의류")) {
        setHsCode('6104.32.0000');
        setProductName('여성용 면 재킷');
        setBaseRate(13);
        if (originCountry === 'US') setFtaRate(0);
      } else {
        setHsCode('9503.00.3100');
        setProductName('완구');
        setBaseRate(8);
        if (originCountry === 'US') setFtaRate(0);
      }
      
      if (inputData.file) {
        const fileName = inputData.file.name?.toLowerCase();
        if (fileName && fileName.includes('invoice') || fileName && fileName.includes('청구서')) {
          setDocumentType('invoice');
        } else if (fileName && fileName.includes('packing') || fileName && fileName.includes('포장')) {
          setDocumentType('packing');
        } else if (fileName && fileName.includes('bl') || fileName && fileName.includes('bill of lading')) {
          setDocumentType('bl');
        } else {
          setDocumentType('other');
        }
      }
      
      setConfidenceScore(Math.floor(Math.random() * 15) + 85);
      // Generate AI reasoning
      const reasoning = generateAiReasoning();
      setAiReasoning(reasoning);
      
      calculateDuty();
      setIsLoading(false);
      setIsCalculated(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Check if any input values have changed
  useEffect(() => {
    const hasChanges = 
      hsCode !== originalValues.current.hsCode ||
      originCountry !== originalValues.current.originCountry ||
      value !== originalValues.current.value ||
      declarationDate.getTime() !== originalValues.current.declarationDate.getTime();
    
    setNeedsCalculation(hasChanges);
  }, [hsCode, originCountry, value, declarationDate]);

  const getExchangeRate = (date: Date) => {
    const day = date.getDay();
    const week = Math.floor(date.getDate() / 7);
    
    const baseRate = 1330 + (week * 5);
    return baseRate + (day * 0.5);
  };

  useEffect(() => {
    if (isLoadedSimulation) return;

    const newExchangeRate = getExchangeRate(declarationDate);
    setExchangeRate(newExchangeRate);
    
    if (value && parseFloat(value) > 0) {
      const rate = ftaRate !== null ? ftaRate : baseRate;
      const dutyUsd = parseFloat(value) * (rate / 100);
      setEstimatedDuty(dutyUsd * newExchangeRate);
    }
  }, [declarationDate]);

  const calculateDuty = () => {
    if (value && parseFloat(value) > 0) {
      const rate = ftaRate !== null ? ftaRate : baseRate;
      const dutyUsd = parseFloat(value) * (rate / 100);
      setEstimatedDuty(dutyUsd * exchangeRate);
    } else {
      setEstimatedDuty(0);
    }
  };

  const handleHsCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHsCode = e.target.value;
    setHsCode(newHsCode);
    
    // Update base rate based on the new HS code (simplified for demo)
    if (newHsCode.startsWith('8471')) {
      setBaseRate(8);
      setProductName('노트북 컴퓨터');
    } else if (newHsCode.startsWith('6104')) {
      setBaseRate(13);
      setProductName('여성용 면 재킷');
    } else if (newHsCode.startsWith('9503')) {
      setBaseRate(8);
      setProductName('완구');
    } else {
      // Default for unknown HS codes
      setBaseRate(8); 
    }
    
    // Reset FTA rate when HS code changes
    if (originCountry === 'US') {
      setFtaRate(0);
    } else {
      setFtaRate(null);
    }
  };

  const handleCalculate = () => {
    if (!value || parseFloat(value) <= 0) {
      toast({
        title: "입력 오류",
        description: "유효한 물품 가액을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    if (!hsCode) {
      toast({
        title: "입력 오류",
        description: "HS 코드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsRecalculating(true);
    
    setTimeout(() => {
      if (originCountry === 'US') {
        setFtaRate(0);
      } else {
        setFtaRate(null);
      }
      calculateDuty();
      setIsRecalculating(false);
      
      // Update original values to reflect the new state
      originalValues.current = {
        hsCode,
        originCountry,
        value,
        declarationDate
      };
      
      setNeedsCalculation(false);
      setIsCalculated(true);
      
      toast({
        title: "계산 완료",
        description: "예상 관세액이 계산되었습니다.",
      });
    }, 500);
  };

  const handleContinue = () => {
    if (!value || parseFloat(value) <= 0) {
      toast({
        title: "필수 정보 입력",
        description: "물품 가액을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }
    
    if (needsCalculation) {
      toast({
        title: "계산 필요",
        description: "입력 내용이 변경되었습니다. 계산하기를 먼저 실행해주세요.",
        variant: "destructive"
      });
      return;
    }

    const analysisData = {
      ...inputData,
      hsCode,
      confidenceScore,
      baseRate,
      ftaRate,
      originCountry,
      value,
      estimatedDuty,
      productName,
      documentType,
      declarationDate: declarationDate.toISOString(),
      exchangeRate,
      aiReasoning
    };
    
    onNext(analysisData);
  };

  const getFileIcon = (file: File | null) => {
    if (!file) return <FileX className="h-8 w-8 text-gray-400" />;
    
    const extension = file.name ? file.name.split('.').pop()?.toLowerCase() : '';
    if (extension === 'pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (['jpg', 'jpeg', 'png'].includes(extension || '')) {
      return <FileIcon className="h-8 w-8 text-blue-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case 'invoice': return 'Commercial Invoice';
      case 'packing': return 'Packing List';
      case 'bl': return 'Bill of Lading (B/L)';
      case 'other': return '기타 서류';
      default: return '알 수 없음';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-primary">AI 분석 진행 중</h2>
        <div className="max-w-md mx-auto">
          <Progress value={Math.random() * 100} className="h-2 mb-4" />
          <p className="text-gray-600">
            입력하신 정보를 바탕으로 AI가 분석 중입니다. 잠시만 기다려주세요...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-primary">AI 품목분류 및 예상 관세액 확인</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>AI 분류 결과</span>
              <span className="ml-auto bg-gray-100 text-gray-700 text-sm font-normal py-1 px-2 rounded">
                신뢰도: {confidenceScore}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hsCode" className="text-sm text-gray-500">HS 코드</Label>
                <Input
                  id="hsCode"
                  value={hsCode}
                  onChange={handleHsCodeChange}
                  className="text-xl font-semibold text-primary mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-500">품목명</Label>
                <p className="text-lg">{productName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">기본 관세율</Label>
                <p className="text-lg">{baseRate}%</p>
              </div>
              {ftaRate !== null && (
                <div>
                  <Label className="text-sm text-gray-500">FTA 협정세율 (한-미 FTA)</Label>
                  <p className="text-lg text-green-600 font-semibold">{ftaRate}%</p>
                </div>
              )}
              
              <Collapsible 
                open={isCollapsibleOpen} 
                onOpenChange={setIsCollapsibleOpen}
                className="mt-4 border rounded-md"
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left border-b bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="font-medium">AI 분류 판단 근거</span>
                  <span className="text-sm text-gray-600">
                    {isCollapsibleOpen ? "접기" : "펼치기"}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 text-sm overflow-auto max-h-[500px] whitespace-pre-wrap">
                  {aiReasoning}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>예상 관세액 계산</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="originCountry">원산지 국가</Label>
                <div className="relative mt-1">
                  <Select 
                    open={openCountrySelect} 
                    onOpenChange={setOpenCountrySelect}
                    value={originCountry}
                    onValueChange={(value) => setOriginCountry(value)}
                  >
                    <SelectTrigger 
                      id="originCountry" 
                      className="w-full cursor-pointer"
                      onClick={() => setOpenCountrySelect(true)}
                    >
                      <SelectValue placeholder="원산지 국가 선택">
                        {originCountry 
                          ? countries.find(c => c.code === originCountry)?.name + " (" + originCountry + ")" 
                          : "원산지 국가 선택"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent 
                      position="popper" 
                      className="w-full max-h-80" 
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command>
                        <CommandInput placeholder="국가 검색..." />
                        <CommandList>
                          <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-80">
                              {countries.map((country) => (
                                <CommandItem
                                  key={country.code}
                                  value={country.name}
                                  onSelect={() => {
                                    setOriginCountry(country.code);
                                    setOpenCountrySelect(false);
                                  }}
                                  className="cursor-pointer hover:bg-accent"
                                >
                                  {country.name} ({country.code})
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </SelectContent>
                  </Select>
                </div>
                {inputData.importType === "export" && (
                  <p className="text-xs text-gray-500 mt-1">수출 시, 원산지는 한국으로 자동 설정됩니다.</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="value">물품 가액 (USD) *</Label>
                <div className="flex items-center mt-1">
                  <Input 
                    id="value" 
                    type="number"
                    min="0"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="물품의 총 가액을 입력해주세요."
                    className="w-full"
                  />
                  <span className="ml-2 font-medium">USD</span>
                </div>
              </div>

              <div>
                <Label htmlFor="declarationDate">예상 신고일 *</Label>
                <div className="mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="declarationDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !declarationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {declarationDate ? format(declarationDate, "yyyy년 MM월 dd일") : <span>날짜 선택</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={declarationDate}
                        onSelect={(date) => setDeclarationDate(date || new Date())}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>적용 고시환율: <span className="font-medium">{exchangeRate.toFixed(2)} 원/USD</span></p>
                    <p className="mt-1">관세청 고시환율: 매주 금요일에 다음 주 적용 환율을 고시하며, 일요일~토요일까지 해당됩니다.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <Button 
                  onClick={handleCalculate} 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isRecalculating}
                >
                  <Calculator className="h-4 w-4" />
                  {isRecalculating ? "계산 중..." : "계산하기"}
                </Button>
                {needsCalculation && (
                  <p className="text-xs text-amber-600 mt-1">
                    입력 내용이 변경되었습니다. 계산하기를 실행해주세요.
                  </p>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Label className="text-sm text-gray-500">예상 관세액</Label>
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold text-accent">
                    {estimatedDuty.toLocaleString()} 원
                  </p>
                  <p className="ml-2 text-sm text-gray-500">
                    적용 세율: {ftaRate !== null ? ftaRate : baseRate}%
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  * 이 금액은 참고용이며, 실제 관세액과 차이가 있을 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* File display section */}
      {inputData.file && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>업로드된 통관 서류</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {getFileIcon(inputData.file)}
              <div className="flex-1">
                <p className="font-medium">{inputData.file.name || '파일명 정보 없음'}</p>
                <p className="text-sm text-gray-500">
                  {inputData.file.size ? (inputData.file.size / 1024 / 1024).toFixed(2) + ' MB' : '파일 크기 정보 없음'}
                </p>
              </div>
              <div className="min-w-[180px]">
                <Select 
                  value={documentType || 'other'} 
                  onValueChange={(value) => setDocumentType(value as DocumentType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="문서 종류 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Commercial Invoice</SelectItem>
                    <SelectItem value="packing">Packing List</SelectItem>
                    <SelectItem value="bl">Bill of Lading (B/L)</SelectItem>
                    <SelectItem value="other">기타 서류</SelectItem>
                  </SelectContent>
                </Select>
                {documentType && (
                  <p className="text-xs text-gray-500 mt-1">
                    AI 판별: {getDocumentTypeLabel(documentType as DocumentType)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex justify-between">
        <Button 
          onClick={onBack} 
          variant="outline"
        >
          이전 단계
        </Button>
        <Button 
          onClick={handleContinue} 
          size="lg" 
          className="bg-accent hover:bg-accent-dark"
          disabled={needsCalculation || !isCalculated}
        >
          시뮬레이션 결과 검토
        </Button>
      </div>
    </div>
  );
};

export default SimulationAnalysis;
