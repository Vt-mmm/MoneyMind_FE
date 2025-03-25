declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableOptions {
    startY?: number;
    margin?: { left: number; right: number };
    head?: string[][];
    body?: any[][];
    theme?: string;
    headStyles?: {
      fillColor?: number[];
      textColor?: number[];
      fontSize?: number;
      cellPadding?: number;
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
      lineWidth?: number;
    };
    styles?: {
      fontSize?: number;
      cellPadding?: number;
      overflow?: 'linebreak' | 'ellipsize' | 'visible' | 'hidden';
      cellWidth?: 'auto' | 'wrap' | number;
      halign?: 'left' | 'center' | 'right';
      valign?: 'top' | 'middle' | 'bottom';
      lineColor?: number[];
      lineWidth?: number;
    };
    columnStyles?: {
      [key: string]: {
        cellWidth?: number;
      };
    };
    didDrawPage?: (data: { pageNumber: number; pageCount: number; }) => void;
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export default autoTable;
} 