
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Trash2, Calendar, DollarSign, Tag, Globe } from "lucide-react";
import { CalculationData } from './CostCalculator';

interface SavedCalculation {
  id: string;
  name: string;
  date: string;
  data: CalculationData;
}

interface SavedCalculationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedCalculations: SavedCalculation[];
  onLoadCalculation: (calculationData: CalculationData) => void;
  onDeleteCalculation: (id: string) => void;
}

const SavedCalculationsModal: React.FC<SavedCalculationsModalProps> = ({
  open,
  onOpenChange,
  savedCalculations,
  onLoadCalculation,
  onDeleteCalculation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter calculations based on search term
  const filteredCalculations = savedCalculations.filter(calc => 
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.data.hsCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.data.originCountry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.data.destinationCountry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.data.incoterms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort calculations
  const sortedCalculations = [...filteredCalculations].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc' 
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }
    if (sortBy === 'amount') {
      return sortOrder === 'desc'
        ? b.data.totalAmount - a.data.totalAmount
        : a.data.totalAmount - b.data.totalAmount;
    }
    return 0;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteCalculation(deleteConfirmId);
      setDeleteConfirmId(null);
    }
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

  return (
    <>
      <Button onClick={() => onOpenChange(true)} variant="outline" className="flex items-center">
        <FileText className="mr-2 h-4 w-4" />
        저장된 계산 불러오기
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>저장된 비용 계산</DialogTitle>
          </DialogHeader>
          
          <div className="my-4 relative">
            <Input
              placeholder="이름, HS 코드, 국가, 인코텀즈로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <ScrollArea className="flex-1 mb-4 max-h-[60vh]">
            {sortedCalculations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort('name')}
                    >
                      이름 {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      저장 날짜 {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>인코텀즈</TableHead>
                    <TableHead>원산지/도착지</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('amount')}
                    >
                      총 비용 {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCalculations.map((calc) => (
                    <TableRow key={calc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onLoadCalculation(calc.data)}>
                      <TableCell className="font-medium">
                        {calc.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{calc.date.split(' ')[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {calc.data.incoterms}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {getCountryName(calc.data.originCountry)} → {getCountryName(calc.data.destinationCountry)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {calc.data.totalAmount.toLocaleString()} {calc.data.totalCurrency}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(calc.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? '검색 결과가 없습니다.' : '저장된 비용 계산이 없습니다.'}
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>비용 계산 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 비용 계산을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Import necessary icons
import { FileText } from 'lucide-react';

export default SavedCalculationsModal;
