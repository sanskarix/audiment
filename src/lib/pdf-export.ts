/**
 * pdf-export.ts
 *
 * Exports HTML to PDF using html2canvas-pro + jsPDF.
 * Uses an off-screen print clone, excludes unwanted report sections,
 * and captures at higher resolution for better quality.
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { format } from 'date-fns';

type ExportOptions = {
  printWidth?: number;
};

const waitForPaint = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

function buildPrintClone(element: HTMLElement, printWidth: number): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;

  clone.style.width = `${printWidth}px`;
  clone.style.maxWidth = `${printWidth}px`;
  clone.style.height = 'auto';
  clone.style.minHeight = 'auto';
  clone.style.overflow = 'visible';
  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.position = 'static';
  clone.style.boxSizing = 'border-box';
  clone.style.background = '#ffffff';

  const all = clone.querySelectorAll('*');
  all.forEach(node => {
    const el = node as HTMLElement;
    el.style.boxSizing = 'border-box';
  });

  return clone;
}

function excludeReportHeaderBits(clone: HTMLElement): void {
  const selectors = [
    '[data-html2canvas-ignore]',
    '.report-exclude-from-pdf',
    '.pdf-exclude',
  ];

  selectors.forEach(selector => {
    clone.querySelectorAll(selector).forEach(node => node.remove());
  });

  const all = Array.from(clone.querySelectorAll('*')) as HTMLElement[];
  all.forEach(el => {
    const text = (el.textContent || '').trim().toLowerCase();
    if (
      text.includes('2 critical failures') ||
      text === 'critical failures' ||
      text.includes('critical failures')
    ) {
      const card = el.closest('div, section, article');
      if (card) card.remove();
    }
  });
}

async function mountPrintContainer(clone: HTMLElement): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.id = '__pdf_print_container__';
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = clone.style.width || '1200px';
  container.style.visibility = 'visible';
  container.style.display = 'block';
  container.style.background = '#ffffff';
  container.style.zIndex = '-1';
  container.style.overflow = 'visible';

  container.appendChild(clone);
  document.body.appendChild(container);

  await waitForPaint();
  await waitForPaint();

  return container;
}

async function cleanupPrintContainer(container: HTMLElement): Promise<void> {
  container.remove();
  await waitForPaint();
}

export async function exportElementToPDF(
  element: HTMLElement,
  filename: string,
  options: ExportOptions = {}
): Promise<void> {
  if (!element || !document.body.contains(element)) {
    throw new Error('Invalid element. Make sure the ref is attached to a real DOM node.');
  }

  const printWidth = options.printWidth ?? 1200;
  const clone = buildPrintClone(element, printWidth);
  excludeReportHeaderBits(clone);

  const container = await mountPrintContainer(clone);

  try {
    const captureTarget = clone;

    const rect = captureTarget.getBoundingClientRect();
    const width = Math.ceil(rect.width || captureTarget.scrollWidth || printWidth);
    const height = Math.ceil(rect.height || captureTarget.scrollHeight || 0);

    if (!width || !height) {
      throw new Error(
        `Report content is not rendered yet. Clone size is ${width}x${height}.`
      );
    }

    const canvas = await html2canvas(captureTarget, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width,
      height,
      windowWidth: printWidth,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (el) =>
        el.classList?.contains('report-exclude-from-pdf') ||
        el.classList?.contains('pdf-exclude') ||
        el.getAttribute('data-html2canvas-ignore') !== null,
    });

    if (!canvas.width || !canvas.height) {
      throw new Error('Canvas capture resulted in an empty frame.');
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let position = 0;
    let heightLeft = imgHeight;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } finally {
    await cleanupPrintContainer(container);
  }
}

export function buildAuditPDFFilename(locationName: string, auditTitle: string): string {
  const loc = (locationName || 'Location').replace(/\s+/g, '');
  const title = (auditTitle || 'Audit').replace(/\s+/g, '');
  const date = format(new Date(), 'ddMMMyyyy');
  return `${loc}-${title}-${date}.pdf`;
}