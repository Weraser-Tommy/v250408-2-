
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    theme?: string;
    styles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    html?: string | HTMLTableElement;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    didDrawPage?: (data: any) => void;
    didParseCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
  }

  function autoTable(doc: jsPDF, options: UserOptions): void;

  namespace autoTable {
    // Namespace for additional properties or methods if needed
  }

  export default autoTable;
}
