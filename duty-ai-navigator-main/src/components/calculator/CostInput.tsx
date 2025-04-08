
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, Plus, FileText, Calculator, Package, Plane, Save, Download, CalendarIcon, Eye } from 'lucide-react';
import { CostItem, CalculationData } from './CostCalculator';
import { getExchangeRate, generateSimulationId, getSortedCountries, formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const INCOTERMS_OPTIONS = [
  { value: 'EXW', label: 'EXW - Ex Works' },
  { value: 'FCA', label: 'FCA - Free Carrier' },
  { value: 'FAS', label: 'FAS - Free Alongside Ship' },
  { value: 'FOB', label: 'FOB - Free On Board' },
  { value: 'CFR', label: 'CFR - Cost and Freight' },
  { value: 'CIF', label: 'CIF - Cost, Insurance and Freight' },
  { value: 'CPT', label: 'CPT - Carriage Paid To' },
  { value: 'CIP', label: 'CIP - Carriage And Insurance Paid To' },
  { value: 'DAP', label: 'DAP - Delivered At Place' },
  { value: 'DPU', label: 'DPU - Delivered at Place Unloaded' },
  { value: 'DDP', label: 'DDP - Delivered Duty Paid' }
];

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'KRW', label: 'KRW (₩)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CNY', label: 'CNY (¥)' }
];

const CATEGORY_OPTIONS = [
  { value: 'customs', label: '관세' },
  { value: 'freight', label: '운송비' },
  { value: 'warehouse', label: '창고료' },
  { value: 'insurance', label: '보험료' },
  { value: 'other', label: '기타' }
];

const EXCHANGE_RATES_TO_KRW = {
  USD: 1330,   // 1 USD = 1,330 KRW
  KRW: 1,      // 1 KRW = 1 KRW
  EUR: 1450,   // 1 EUR = 1,450 KRW
  JPY: 8.8,    // 1 JPY = 8.8 KRW
  CNY: 183     // 1 CNY = 183 KRW
};

// Move getCategoryLabel function definition before it's used
const getCategoryLabel = (category: string): string => {
  const categories: Record<string, string> = {
    'customs': '관세',
    'freight': '운송비',
    'warehouse': '창고료',
    'insurance': '보험료',
    'other': '기타'
  };
  return categories[category] || '기타';
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'customs': 'bg-blue-100 text-blue-800',
    'freight': 'bg-green-100 text-green-800',
    'warehouse': 'bg-purple-100 text-purple-800',
    'insurance': 'bg-yellow-100 text-yellow-800',
    'other': 'bg-gray-100 text-gray-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

interface CostInputProps {
  onCalculate: (data: CalculationData) => void;
  initialData?: CalculationData | null;
  onOpenSaved: () => void;
  onSave: (name: string) => void;
  onGeneratePDF: () => void;
}

const CostInput: React.FC<CostInputProps> = ({ 
  onCalculate, 
  initialData, 
  onOpenSaved,
  onSave,
  onGeneratePDF
}) => {
  const [hsCode, setHsCode] = useState('');
  const [originCountry, setOriginCountry] = useState('KR');
  const [destinationCountry, setDestinationCountry] = useState('US');
  const [importType, setImportType] = useState<'import' | 'export'>('import');
  const [incoterms, setIncoterms] = useState('FOB');
  const [costItems, setCostItems] = useState<CostItem[]>([
    {
      id: generateSimulationId(),
      name: '관세',
      amount: 0,
      currency: 'USD',
      category: 'customs',
      exchangeDate: new Date(),
      amountInKRW: 0
    },
    {
      id: generateSimulationId(),
      name: '운송비',
      amount: 0,
      currency: 'USD',
      category: 'freight',
      exchangeDate: new Date(),
      amountInKRW: 0
    }
  ]);
  const [totalCurrency, setTotalCurrency] = useState('USD');
  const [calculated, setCalculated] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationData | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [calculationName, setCalculationName] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  const sortedCountries = getSortedCountries(COUNTRIES).filter(c => c.code !== 'UNKNOWN');

  // Initialize form with saved data if available
  useEffect(() => {
    if (initialData) {
      setHsCode(initialData.hsCode);
      setOriginCountry(initialData.originCountry);
      setDestinationCountry(initialData.destinationCountry);
      setImportType(initialData.importType);
      setIncoterms(initialData.incoterms);
      setCostItems(initialData.costItems.map(item => ({
        ...item,
        exchangeDate: item.exchangeDate || new Date(),
        amountInKRW: item.amountInKRW || calculateKRWAmount(item.amount, item.currency)
      })));
      setTotalCurrency(initialData.totalCurrency);
      setCalculated(true);
      setCalculationResult(initialData);
    }
  }, [initialData]);

  const calculateKRWAmount = (amount: number, currency: string): number => {
    return amount * (EXCHANGE_RATES_TO_KRW[currency as keyof typeof EXCHANGE_RATES_TO_KRW] || 1);
  };

  const handleAddCostItem = () => {
    const newItem: CostItem = {
      id: generateSimulationId(),
      name: '',
      amount: 0,
      currency: totalCurrency,
      category: 'other',
      exchangeDate: new Date(),
      amountInKRW: 0
    };
    setCostItems([...costItems, newItem]);
  };

  const handleRemoveCostItem = (id: string) => {
    setCostItems(costItems.filter(item => item.id !== id));
  };

  const handleCostItemChange = (id: string, field: keyof CostItem, value: any) => {
    setCostItems(costItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // If amount or currency changes, update the KRW amount
        if (field === 'amount' || field === 'currency' || field === 'exchangeDate') {
          updatedItem.amountInKRW = calculateKRWAmount(
            field === 'amount' ? value : item.amount,
            field === 'currency' ? value : item.currency
          );
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleCalculate = () => {
    // Calculate total in the selected currency and KRW
    const totalAmount = costItems.reduce((sum, item) => {
      if (item.currency === totalCurrency) {
        return sum + item.amount;
      } else {
        // Convert to the selected currency using KRW as intermediary
        const amountInKRW = item.amountInKRW || calculateKRWAmount(item.amount, item.currency);
        return sum + (amountInKRW / (EXCHANGE_RATES_TO_KRW[totalCurrency as keyof typeof EXCHANGE_RATES_TO_KRW] || 1));
      }
    }, 0);
    
    const totalAmountInKRW = costItems.reduce((sum, item) => {
      return sum + (item.amountInKRW || calculateKRWAmount(item.amount, item.currency));
    }, 0);
    
    const result: CalculationData = {
      hsCode,
      originCountry,
      destinationCountry,
      importType,
      incoterms,
      costItems: costItems.map(item => ({
        ...item,
        amountInKRW: item.amountInKRW || calculateKRWAmount(item.amount, item.currency)
      })),
      totalCurrency,
      totalAmount,
      totalAmountInKRW
    };
    
    setCalculationResult(result);
    setCalculated(true);
    onCalculate(result);
  };

  const handleSave = () => {
    if (calculationName.trim()) {
      onSave(calculationName);
      setSaveDialogOpen(false);
    }
  };

  // Group cost items by category when result is available
  const costItemsByCategory = calculationResult?.costItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CostItem[]>) || {};

  // Calculate totals by category when result is available
  const categoryTotals = calculationResult ? Object.entries(costItemsByCategory).map(([category, items]) => {
    const total = items.reduce((sum, item) => {
      if (item.currency === calculationResult.totalCurrency) {
        return sum + item.amount;
      } else {
        // Calculate based on KRW intermediary
        const amountInKRW = item.amountInKRW || 0;
        return sum + (amountInKRW / 1330); // Approximate conversion back to USD for display
      }
    }, 0);

    const totalInKRW = items.reduce((sum, item) => {
      return sum + (item.amountInKRW || 0);
    }, 0);
    
    return {
      category,
      total,
      totalInKRW,
      label: getCategoryLabel(category)
    };
  }) : [];

  const getCountryName = (code: string): string => {
    const countries: Record<string, string> = {
      'KR': '대한민국',
      'US': '미국',
      'CN': '중국',
      'JP': '일본',
      'DE': '독일',
      'FR': '프랑스',
      'GB': '영국',
      'IT': '이탈리아',
      'AU': '호주',
      'CA': '캐나다',
      'SG': '싱가포르',
      'VN': '베트남',
      'TH': '태국',
      'ID': '인도네시아',
      'MY': '말레이시아'
    };
    return countries[code] || code;
  };

  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'KRW': '₩',
      'EUR': '€',
      'JPY': '¥',
      'CNY': '¥'
    };
    return symbols[currency] || '';
  };

  const formatAmount = (amount: number, currency: string): string => {
    return `${getCurrencySymbol(currency)} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={onOpenSaved} className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          저장된 계산 불러오기
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hsCode">HS 코드</Label>
            <Input
              id="hsCode"
              placeholder="예: 8471.30.0000"
              value={hsCode}
              onChange={(e) => setHsCode(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>수출입 구분</Label>
            <RadioGroup 
              value={importType} 
              onValueChange={(value) => setImportType(value as 'import' | 'export')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="import" id="import" />
                <Label htmlFor="import">수입</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="export" id="export" />
                <Label htmlFor="export">수출</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="incoterms">인코텀즈</Label>
            <Select 
              value={incoterms} 
              onValueChange={setIncoterms}
            >
              <SelectTrigger id="incoterms">
                <SelectValue placeholder="인코텀즈 선택" />
              </SelectTrigger>
              <SelectContent>
                {INCOTERMS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originCountry">원산지</Label>
              <Select 
                value={originCountry} 
                onValueChange={setOriginCountry}
              >
                <SelectTrigger id="originCountry">
                  <SelectValue placeholder="원산지 선택" />
                </SelectTrigger>
                <SelectContent>
                  {sortedCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationCountry">도착지</Label>
              <Select 
                value={destinationCountry}
                onValueChange={setDestinationCountry}
              >
                <SelectTrigger id="destinationCountry">
                  <SelectValue placeholder="도착지 선택" />
                </SelectTrigger>
                <SelectContent>
                  {sortedCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalCurrency">최종 통화</Label>
            <Select 
              value={totalCurrency} 
              onValueChange={setTotalCurrency}
            >
              <SelectTrigger id="totalCurrency">
                <SelectValue placeholder="통화 선택" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-medium">비용 항목</h3>
          <Button onClick={handleAddCostItem} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            항목 추가
          </Button>
        </div>
        
        {costItems.length > 0 ? (
          <div className="space-y-4">
            {costItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md">
                <div className="col-span-3 space-y-1">
                  <Label htmlFor={`item-name-${index}`}>항목명</Label>
                  <Input
                    id={`item-name-${index}`}
                    value={item.name}
                    onChange={(e) => handleCostItemChange(item.id, 'name', e.target.value)}
                    placeholder="비용 항목명"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor={`item-category-${index}`}>카테고리</Label>
                  <Select 
                    value={item.category} 
                    onValueChange={(value) => handleCostItemChange(item.id, 'category', value)}
                  >
                    <SelectTrigger id={`item-category-${index}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor={`item-amount-${index}`}>금액</Label>
                  <Input
                    id={`item-amount-${index}`}
                    type="number"
                    value={item.amount === 0 ? '' : item.amount}
                    onChange={(e) => handleCostItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor={`item-currency-${index}`}>통화</Label>
                  <Select 
                    value={item.currency} 
                    onValueChange={(value) => handleCostItemChange(item.id, 'currency', value)}
                  >
                    <SelectTrigger id={`item-currency-${index}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor={`item-exchange-date-${index}`}>환율적용일자</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id={`item-exchange-date-${index}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {item.exchangeDate ? format(item.exchangeDate, 'yyyy-MM-dd') : '날짜 선택'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={item.exchangeDate}
                        onSelect={(date) => handleCostItemChange(item.id, 'exchangeDate', date || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="col-span-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveCostItem(item.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-md">
            비용 항목이 없습니다. 항목을 추가해주세요.
          </div>
        )}
        
        <div className="flex justify-end mt-6">
          <Button onClick={handleCalculate} className="flex items-center">
            <Calculator className="mr-2 h-4 w-4" />
            비용 계산하기
          </Button>
        </div>
      </div>

      {importType && incoterms && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">인코텀즈 시각화</h3>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-6 relative">
              <div className="w-full h-2 bg-gray-200 absolute"></div>
              <div className="z-10 bg-white p-1 border rounded-full">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="z-10 bg-white p-1 border rounded-full">
                <Plane className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="grid grid-cols-11 gap-1 text-xs text-center">
              {["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"].map(term => (
                <div 
                  key={term} 
                  className={`py-1 px-0.5 ${term === incoterms ? 'bg-primary/20 text-primary font-bold' : ''}`}
                >
                  {term}
                </div>
              ))}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">판매자 부담 구간</h4>
                <div className="text-sm text-muted-foreground">
                  {renderSellerResponsibility(incoterms)}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">구매자 부담 구간</h4>
                <div className="text-sm text-muted-foreground">
                  {renderBuyerResponsibility(incoterms)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 계산 결과 표시 영역 */}
      {calculated && calculationResult && (
        <div className="mt-6">
          <Separator className="my-6" />
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">비용 계산 결과</h3>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setPreviewDialogOpen(true)} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                미리보기
              </Button>
              <Button onClick={() => setSaveDialogOpen(true)} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                저장하기
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">카테고리별 비용</h4>
                <div className="bg-muted/40 rounded-lg p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2">카테고리</th>
                        <th className="text-right pb-2">금액 ({calculationResult.totalCurrency})</th>
                        <th className="text-right pb-2">원화 환산액</th>
                        <th className="text-right pb-2">비율</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryTotals.map((cat) => (
                        <tr key={cat.category} className="border-b border-dashed last:border-0">
                          <td className="py-2">
                            <Badge className={getCategoryColor(cat.category)}>
                              {cat.label}
                            </Badge>
                          </td>
                          <td className="text-right py-2">
                            {formatAmount(cat.total, calculationResult.totalCurrency)}
                          </td>
                          <td className="text-right py-2">
                            {cat.totalInKRW.toLocaleString()} KRW
                          </td>
                          <td className="text-right py-2">
                            {calculationResult.totalAmount > 0 
                              ? `${((cat.total / calculationResult.totalAmount) * 100).toFixed(1)}%` 
                              : '0%'}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-medium">
                        <td className="py-2">총계</td>
                        <td className="text-right py-2">
                          {formatAmount(calculationResult.totalAmount, calculationResult.totalCurrency)}
                        </td>
                        <td className="text-right py-2">
                          {(calculationResult.totalAmountInKRW || 0).toLocaleString()} KRW
                        </td>
                        <td className="text-right py-2">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-primary/10 p-6 rounded-lg flex flex-col items-center justify-center h-full">
                <div className="text-lg text-muted-foreground mb-2">총 비용</div>
                <div className="text-3xl font-bold">
                  {formatAmount(calculationResult.totalAmount, calculationResult.totalCurrency)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">({calculationResult.totalCurrency})</div>
                {calculationResult.totalAmountInKRW && (
                  <div className="mt-2 text-lg font-medium">
                    원화 환산: ₩{calculationResult.totalAmountInKRW.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 저장 다이얼로그 */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비용 계산 저장</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="calculationName">계산 이름</Label>
              <Input
                id="calculationName"
                placeholder="예: 미국 전자제품 수입 비용"
                value={calculationName}
                onChange={(e) => setCalculationName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>취소</Button>
            <Button onClick={handleSave}>저장하기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 미리보기 다이얼로그 */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>비용 계산서 미리보기</DialogTitle>
          </DialogHeader>
          
          <div className="p-6 border rounded-md max-h-[60vh] overflow-y-auto">
            {calculationResult && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold">비용 계산서</h2>
                  <p className="text-sm text-muted-foreground">생성일: {new Date().toLocaleDateString('ko-KR')}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">기본 정보</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-1 font-medium">수출입 구분:</td>
                        <td>{calculationResult.importType === 'import' ? '수입' : '수출'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium">HS 코드:</td>
                        <td>{calculationResult.hsCode || '-'}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium">인코텀즈:</td>
                        <td>{calculationResult.incoterms}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium">원산지:</td>
                        <td>{getCountryName(calculationResult.originCountry)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-medium">도착지:</td>
                        <td>{getCountryName(calculationResult.destinationCountry)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">비용 항목 상세</h3>
                  <table className="w-full border-collapse border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">항목명</th>
                        <th className="border p-2 text-left">카테고리</th>
                        <th className="border p-2 text-right">금액</th>
                        <th className="border p-2 text-right">통화</th>
                        <th className="border p-2 text-right">원화 환산액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.costItems.map((item) => (
                        <tr key={item.id}>
                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2">{getCategoryLabel(item.category)}</td>
                          <td className="border p-2 text-right">{item.amount.toLocaleString()}</td>
                          <td className="border p-2 text-right">{item.currency}</td>
                          <td className="border p-2 text-right">
                            {(item.amountInKRW || 0).toLocaleString()} KRW
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">카테고리별 비용</h3>
                  <table className="w-full border-collapse border text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">카테고리</th>
                        <th className="border p-2 text-right">금액 ({calculationResult.totalCurrency})</th>
                        <th className="border p-2 text-right">원화 환산액</th>
                        <th className="border p-2 text-right">비율</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryTotals.map((cat) => (
                        <tr key={cat.category}>
                          <td className="border p-2">{cat.label}</td>
                          <td className="border p-2 text-right">
                            {formatAmount(cat.total, calculationResult.totalCurrency)}
                          </td>
                          <td className="border p-2 text-right">
                            {cat.totalInKRW.toLocaleString()} KRW
                          </td>
                          <td className="border p-2 text-right">
                            {calculationResult.totalAmount > 0 
                              ? `${((cat.total / calculationResult.totalAmount) * 100).toFixed(1)}%` 
                              : '0%'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/50 font-medium">
                        <td className="border p-2">총계</td>
                        <td className="border p-2 text-right">
                          {formatAmount(calculationResult.totalAmount, calculationResult.totalCurrency)}
                        </td>
                        <td className="border p-2 text-right">
                          {(calculationResult.totalAmountInKRW || 0).toLocaleString()} KRW
                        </td>
                        <td className="border p-2 text-right">100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
                  본 비용 계산서는 참고용으로 제공되며, 실제 비용은 상황에 따라 다를 수 있습니다.
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>닫기</Button>
            <Button onClick={onGeneratePDF}>PDF 다운로드</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const COUNTRIES = [
  { code: "KR", name: "대한민국" },
  { code: "US", name: "미국" },
  { code: "CN", name: "중국" },
  { code: "JP", name: "일본" },
  { code: "DE", name: "독일" },
  { code: "FR", name: "프랑스" },
  { code: "GB", name: "영국" },
  { code: "IT", name: "이탈리아" },
  { code: "AU", name: "호주" },
  { code: "CA", name: "캐나다" },
  { code: "SG", name: "싱가포르" },
  { code: "VN", name: "베트남" },
  { code: "TH", name: "태국" },
  { code: "ID", name: "인도네시아" },
  { code: "MY", name: "말레이시아" }
];

const renderSellerResponsibility = (incoterms: string): string => {
  switch (incoterms) {
    case 'EXW': 
      return '판매자 창고에서 물품 준비';
    case 'FCA': 
      return '판매자 창고에서 물품 준비, 운송인에게 인도';
    case 'FAS': 
      return '판매자 창고에서 물품 준비, 선적항 선박 접안장소까지 운송';
    case 'FOB': 
      return '판매자 창고에서 물품 준비, 선적항 본선까지 운송 및 선적';
    case 'CFR': 
      return '판매자 창고에서 물품 준비, 선적항 본선까지 운송 및 선적, 도착항까지의 해상운임';
    case 'CIF': 
      return '판매자 창고에서 물품 준비, 선적항 본선까지 운송 및 선적, 도착항까지의 해상운임, 해상보험';
    case 'CPT': 
      return '판매자 창고에서 물품 준비, 지정된 목적지까지 운송비 지불';
    case 'CIP': 
      return '판매자 창고에서 물품 준비, 지정된 목적지까지 운송비 지불, 보험 가입';
    case 'DAP': 
      return '판매자 창고에서 물품 준비, 지정된 목적지까지 배송';
    case 'DPU': 
      return '판매자 창고에서 물품 준비, 지정된 목적지 하역지점까지 배송 및 하역';
    case 'DDP': 
      return '판매자 창고에서 물품 준비, 지정된 목적지까지 배송, 관세 및 세금 지불';
    default: 
      return '정보 없음';
  }
};

const renderBuyerResponsibility = (incoterms: string): string => {
  switch (incoterms) {
    case 'EXW': 
      return '판매자 창고에서 인수 후 모든 운송, 보험, 관세, 세금';
    case 'FCA': 
      return '운송인 지정, 운송인 인수 후 모든 운송, 보험, 관세, 세금';
    case 'FAS': 
      return '선박 지정, 선적, 해상운송, 도착지 운송, 관세, 세금';
    case 'FOB': 
      return '선박 지정, 본선 수령 후 해상운송, 도착지 운송, 관세, 세금';
    case 'CFR': 
      return '본선 수령 후 하역, 도착지 운송, 관세, 세금';
    case 'CIF': 
      return '본선 수령 후 하역, 도착지 운송, 관세, 세금';
    case 'CPT': 
      return '지정된 목적지에서 인수 후 하역, 관세, 세금';
    case 'CIP': 
      return '지정된 목적지에서 인수 후 하역, 관세, 세금';
    case 'DAP': 
      return '도착지에서 하역, 관세, 세금';
    case 'DPU': 
      return '하역 후 관세, 세금';
    case 'DDP': 
      return '도착지에서 물품 인수';
    default: 
      return '정보 없음';
  }
};

export default CostInput;
