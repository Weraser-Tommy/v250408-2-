
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Trash2, Calendar, DollarSign, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SavedSimulation {
  id: string;
  name: string;
  date: string;
  data: any;
}

interface SavedSimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedSimulations: SavedSimulation[];
  onLoadSimulation: (simulation: any) => void;
  onDeleteSimulation: (id: string) => void;
}

const SavedSimulationModal: React.FC<SavedSimulationModalProps> = ({
  open,
  onOpenChange,
  savedSimulations,
  onLoadSimulation,
  onDeleteSimulation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter simulations based on search term
  const filteredSimulations = savedSimulations.filter(sim => 
    sim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sim.data.hsCode?.includes(searchTerm) ||
    sim.data.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort simulations
  const sortedSimulations = [...filteredSimulations].sort((a, b) => {
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
    if (sortBy === 'value') {
      const aValue = parseFloat(a.data.value || '0');
      const bValue = parseFloat(b.data.value || '0');
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
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

  const handleLoadSimulation = (simulation: any) => {
    onLoadSimulation(simulation);
    onOpenChange(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteSimulation(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getImportTypeLabel = (type: string) => {
    return type === 'import' ? '수입' : '수출';
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>저장된 시뮬레이션</DialogTitle>
          </DialogHeader>
          
          <div className="my-4 relative">
            <Input
              placeholder="이름, HS코드, 품목명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <ScrollArea className="flex-1 mb-4 max-h-[60vh]">
            {sortedSimulations.length > 0 ? (
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
                    <TableHead>HS 코드</TableHead>
                    <TableHead>품목명</TableHead>
                    <TableHead>수출입 구분</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort('value')}
                    >
                      물품 가액 {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSimulations.map((sim) => (
                    <TableRow key={sim.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium" onClick={() => handleLoadSimulation(sim.data)}>
                        {sim.name}
                      </TableCell>
                      <TableCell onClick={() => handleLoadSimulation(sim.data)}>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{sim.date.split(' ')[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => handleLoadSimulation(sim.data)}>
                        {sim.data.hsCode ? (
                          <Badge variant="outline" className="font-mono">
                            {sim.data.hsCode}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">없음</span>
                        )}
                      </TableCell>
                      <TableCell onClick={() => handleLoadSimulation(sim.data)}>
                        <div className="max-w-[150px] truncate">{sim.data.productName || '미지정'}</div>
                      </TableCell>
                      <TableCell onClick={() => handleLoadSimulation(sim.data)}>
                        <Badge variant="secondary">
                          {getImportTypeLabel(sim.data.importType)}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={() => handleLoadSimulation(sim.data)}>
                        {sim.data.value ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{Number(sim.data.value).toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">미지정</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(sim.id);
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
                {searchTerm ? '검색 결과가 없습니다.' : '저장된 시뮬레이션이 없습니다.'}
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
            <AlertDialogTitle>시뮬레이션 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 시뮬레이션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default SavedSimulationModal;
