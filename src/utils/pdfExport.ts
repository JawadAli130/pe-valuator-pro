import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Report, ExportOptions, qualitativeFactorOptions } from '../types/report';

function getFactorLabel(name: string): string {
  const factor = qualitativeFactorOptions.find(f => f.name === name);
  return factor ? factor.label : name;
}

export function exportReportToPDF(report: Report, options: ExportOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Title and Header
  doc.setFontSize(20);
  doc.text('PE Valuator Report', pageWidth / 2, 20, { align: 'center' });

  // Report Details
  doc.setFontSize(12);
  doc.text(`Report Name: ${report.name}`, 20, 40);
  doc.text(`Asset Class: ${report.assetClass}`, 20, 50);
  doc.text(`Quarter: ${report.quarter}`, 20, 60);
  doc.text(`Date: ${report.date}`, 20, 70);
  doc.text(`Status: ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}`, 20, 80);

  let yPosition = 100;

  // Additional Information
  if (options.currentNAV || options.fundManager || options.vintage) {
    doc.setFontSize(14);
    doc.text('Fund Information', 20, yPosition);
    doc.setFontSize(12);
    yPosition += 15;

    if (options.currentNAV) {
      doc.text(`Current NAV: $${options.currentNAV.toFixed(2)}M`, 20, yPosition);
      yPosition += 10;
    }
    if (options.fundManager) {
      doc.text(`Fund Manager: ${options.fundManager}`, 20, yPosition);
      yPosition += 10;
    }
    if (options.vintage) {
      doc.text(`Vintage: ${options.vintage}`, 20, yPosition);
      yPosition += 20;
    }
  }

  // Pricing Details
  doc.setFontSize(14);
  doc.text('Pricing Details', 20, yPosition);
  yPosition += 10;

  const pricingData = [
    ['Market Average', `${report.marketAverage.toFixed(1)}%`],
    ['Final Price', `${report.finalPrice.toFixed(1)}%`],
    ['Price Range', `${report.priceRangeMin.toFixed(1)}% - ${report.priceRangeMax.toFixed(1)}%`],
    ['Deferral Price', `${report.deferralPrice.toFixed(1)}%`],
    ['Deferral Price Range', `${report.deferralRangeMin.toFixed(1)}% - ${report.deferralRangeMax.toFixed(1)}%`],
    ['Volatility Score', report.volatilityScore.toString()]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [['Metric', 'Value']],
    body: pricingData,
    theme: 'striped',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: 20 }
  });

  // Qualitative Factors
  if (options.includeQualitativeFactors && report.qualitativeFactors.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Qualitative Factors', 20, 20);

    const qualitativeData = report.qualitativeFactors.map(factor => [
      getFactorLabel(factor.name),
      factor.score > 0 ? `+${factor.score}` : factor.score.toString(),
      factor.weight.toString()
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Factor', 'Score', 'Weight']],
      body: qualitativeData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
      margin: { left: 20 }
    });
  }

  // Potential Buyers
  if (options.buyers) {
    const currentY = doc.previousAutoTable?.finalY || doc.internal.pageSize.height - 40;
    doc.setFontSize(14);
    doc.text('Potential Buyers', 20, currentY + 20);
    doc.setFontSize(12);
    
    const buyers = options.buyers.split('\n').filter(line => line.trim());
    let buyerY = currentY + 35;
    
    buyers.forEach(buyer => {
      if (buyerY > doc.internal.pageSize.height - 20) {
        doc.addPage();
        buyerY = 20;
      }
      doc.text(`• ${buyer.trim()}`, 25, buyerY);
      buyerY += 10;
    });
  }

  // Save the PDF
  const fileName = `${report.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${report.quarter.toLowerCase()}.pdf`;
  doc.save(fileName);
}