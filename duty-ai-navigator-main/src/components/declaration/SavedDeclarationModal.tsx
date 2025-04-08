import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Trash2, Calendar, FileText } from "lucide-react";
import { DeclarationFormData, DocumentFile } from '@/pages/DeclarationPage';

interface SavedDeclaration {
  id: string;
  name: string;
  date: string;
  formData: DeclarationFormData;
  documents?: DocumentFile[];
}

interface SavedDeclarationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedDeclarations: SavedDeclaration[];
  onLoadDeclaration: (declaration: DeclarationFormData | SavedDeclaration) => void;
  onDeleteDeclaration: (id: string) => void;
  mode: 'save' | 'load';
}

const SavedDeclarationModal: React.FC<SavedDeclarationModalProps> = ({
  open,
  onOpenChange,
  savedDeclarations,
  onLoadDeclaration,
  onDeleteDeclaration,
  mode
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [declarationName, setDeclarationName] = useState('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredDeclarations = savedDeclarations.filter(dec => 
    dec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dec.formData.hsCode?.includes(searchTerm) ||
    dec.formData.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dec.formData.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDeclarations = [...filteredDeclarations].sort((a, b) => {
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

  const handleLoadDeclaration = (declaration: DeclarationFormData | SavedDeclaration) => {
    onLoadDeclaration(declaration);
    onOpenChange(false);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteDeclaration(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleSaveDeclaration = () => {
    if (mode === 'save') {
      onLoadDeclaration({
        ...savedDeclarations[0]?.formData,
        _saveAction: true,
        _saveName: declarationName
      } as any);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {mode === 'save' ? '신고서 저장' : '저장된 신고서'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'save' ? '신고서를 저장하려면 이름을 입력하세요.' : '저장된 신고서 목록입니다.'}
            </DialogDescription>
          </DialogHeader>
          
          {mode === 'save' && (
            <div className="my-4">
              <label className="block text-sm font-medium mb-1">신고서 이름</label>
              <Input
                placeholder="저장할 신고서 이름을 입력하세요"
                value={declarationName}
                onChange={(e) => setDeclarationName(e.target.value)}
              />
            </div>
          )}

          {mode === 'load' && (
            <div className="my-4 relative">
              <Input
                placeholder="이름, HS코드, 품목명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          )}

          <ScrollArea className="flex-1 mb-4 max-h-[60vh]">
            {sortedDeclarations.length > 0 ? (
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
                    <TableHead>품명</TableHead>
                    <TableHead>신고 구분</TableHead>
                    <TableHead>신고인</TableHead>
                    <TableHead className="text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedDeclarations.map((dec) => (
                    <TableRow key={dec.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium" onClick={() => handleLoadDeclaration(dec.formData)}>
                        {dec.name}
                      </TableCell>
                      <TableCell onClick={() => handleLoadDeclaration(dec.formData)}>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{dec.date.split(' ')[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => handleLoadDeclaration(dec.formData)}>
                        {dec.formData.hsCode ? (
                          <Badge variant="outline" className="font-mono">
                            {dec.formData.hsCode}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">없음</span>
                        )}
                      </TableCell>
                      <TableCell onClick={() => handleLoadDeclaration(dec.formData)}>
                        <div className="max-w-[150px] truncate">{dec.formData.itemName || '미지정'}</div>
                      </TableCell>
                      <TableCell onClick={() => handleLoadDeclaration(dec.formData)}>
                        <Badge variant="secondary">
                          {dec.formData.declarationType === 'import' ? '수입' : '수출'}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={() => handleLoadDeclaration(dec.formData)}>
                        <div className="max-w-[150px] truncate">{dec.formData.declarerName || '미지정'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(dec.id);
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
                {searchTerm ? '검색 결과가 없습니다.' : '저장된 신고서가 없습니다.'}
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            {mode === 'save' && (
              <Button 
                disabled={!declarationName.trim()} 
                onClick={handleSaveDeclaration}
              >
                저장하기
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {mode === 'save' ? '취소' : '닫기'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>신고서 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 신고서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default SavedDeclarationModal;
