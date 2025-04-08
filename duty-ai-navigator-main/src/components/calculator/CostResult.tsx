
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Save, Download, Eye } from 'lucide-react';
import { CalculationData, CostItem } from './CostCalculator';
import { Badge } from '@/components/ui/badge';

interface CostResultProps {
  calculationData: CalculationData;
  onSave: (name: string) => void;
  onGeneratePDF: () => void;
}

const CostResult: React.FC<CostResultProps> = ({
  calculationData,
  onSave,
  onGeneratePDF
}) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [calculationName, setCalculationName] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const handleSave = () => {
    if (calculationName.trim()) {
      onSave(calculationName);
      setSaveDialogOpen(false);
    }
  };

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

  // Group cost items by category
  const costItemsByCategory = calculationData.costItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, CostItem[]>);

  // Calculate totals by category
  const categoryTotals = Object.entries(costItemsByCategory).map(([category, items]) => {
    const total = items.reduce((sum, item) => {
      if (item.currency === calculationData.totalCurrency) {
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
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">기본 정보</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="text-sm text-muted-foreground">수출입 구분</div>
            <div>{calculationData.importType === 'import' ? '수입' : '수출'}</div>
            
            <div className="text-sm text-muted-foreground">HS 코드</div>
            <div>{calculationData.hsCode || '-'}</div>
            
            <div className="text-sm text-muted-foreground">인코텀즈</div>
            <div>{calculationData.incoterms}</div>
            
            <div className="text-sm text-muted-foreground">원산지</div>
            <div>{getCountryName(calculationData.originCountry)}</div>
            
            <div className="text-sm text-muted-foreground">도착지</div>
            <div>{getCountryName(calculationData.destinationCountry)}</div>
          </div>
        </div>
        
        <div>
          <div className="bg-primary/10 p-6 rounded-lg flex flex-col items-center justify-center h-full">
            <div className="text-lg text-muted-foreground mb-2">총 비용</div>
            <div className="text-3xl font-bold">
              {formatAmount(calculationData.totalAmount, calculationData.totalCurrency)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">({calculationData.totalCurrency})</div>
            {calculationData.totalAmountInKRW && (
              <div className="mt-2 text-lg font-medium">
                원화 환산: ₩{calculationData.totalAmountInKRW.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">비용 항목 상세</h3>
        <div className="space-y-4">
          {Object.entries(costItemsByCategory).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Badge className={getCategoryColor(category)}>
                  {getCategoryLabel(category)}
                </Badge>
              </h4>
              <div className="bg-muted/40 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">항목명</th>
                      <th className="text-right pb-2">금액</th>
                      <th className="text-right pb-2">통화</th>
                      <th className="text-right pb-2">원화 환산액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-dashed last:border-0">
                        <td className="py-2">{item.name}</td>
                        <td className="text-right py-2">{item.amount.toLocaleString()}</td>
                        <td className="text-right py-2">{item.currency}</td>
                        <td className="text-right py-2">
                          {(item.amountInKRW || 0).toLocaleString()} KRW
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">카테고리별 비용</h3>
        <div className="bg-muted/40 rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">카테고리</th>
                <th className="text-right pb-2">금액 ({calculationData.totalCurrency})</th>
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
                    {formatAmount(cat.total, calculationData.totalCurrency)}
                  </td>
                  <td className="text-right py-2">
                    {cat.totalInKRW.toLocaleString()} KRW
                  </td>
                  <td className="text-right py-2">
                    {calculationData.totalAmount > 0 
                      ? `${((cat.total / calculationData.totalAmount) * 100).toFixed(1)}%` 
                      : '0%'}
                  </td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="py-2">총계</td>
                <td className="text-right py-2">
                  {formatAmount(calculationData.totalAmount, calculationData.totalCurrency)}
                </td>
                <td className="text-right py-2">
                  {(calculationData.totalAmountInKRW || 0).toLocaleString()} KRW
                </td>
                <td className="text-right py-2">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setPreviewDialogOpen(true)} className="flex items-center">
          <Eye className="mr-2 h-4 w-4" />
          미리보기
        </Button>
        <Button variant="outline" onClick={onGeneratePDF} className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          PDF 다운로드
        </Button>
        <Button onClick={() => setSaveDialogOpen(true)} className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          저장하기
        </Button>
      </div>
      
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
                    <td>{calculationData.importType === 'import' ? '수입' : '수출'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">HS 코드:</td>
                    <td>{calculationData.hsCode || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">인코텀즈:</td>
                    <td>{calculationData.incoterms}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">원산지:</td>
                    <td>{getCountryName(calculationData.originCountry)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">도착지:</td>
                    <td>{getCountryName(calculationData.destinationCountry)}</td>
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
                  {calculationData.costItems.map((item) => (
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
                    <th className="border p-2 text-right">금액 ({calculationData.totalCurrency})</th>
                    <th className="border p-2 text-right">원화 환산액</th>
                    <th className="border p-2 text-right">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryTotals.map((cat) => (
                    <tr key={cat.category}>
                      <td className="border p-2">{cat.label}</td>
                      <td className="border p-2 text-right">
                        {formatAmount(cat.total, calculationData.totalCurrency)}
                      </td>
                      <td className="border p-2 text-right">
                        {cat.totalInKRW.toLocaleString()} KRW
                      </td>
                      <td className="border p-2 text-right">
                        {calculationData.totalAmount > 0 
                          ? `${((cat.total / calculationData.totalAmount) * 100).toFixed(1)}%` 
                          : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 font-medium">
                    <td className="border p-2">총계</td>
                    <td className="border p-2 text-right">
                      {formatAmount(calculationData.totalAmount, calculationData.totalCurrency)}
                    </td>
                    <td className="border p-2 text-right">
                      {(calculationData.totalAmountInKRW || 0).toLocaleString()} KRW
                    </td>
                    <td className="border p-2 text-right">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
              본 비용 계산서는 참고용으로 제공되며, 실제 비용은 상황에 따라 다를 수 있습니다.
            </div>
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

export default CostResult;
