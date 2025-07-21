'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExportButtonsProps {
  dealData: any;
  propertyDetails: any;
  t12Data: any;
  rentRollData: any;
  buyBox: any;
  assumptions: any;
}

export function ExportButtons({ 
  dealData, 
  propertyDetails, 
  t12Data, 
  rentRollData, 
  buyBox, 
  assumptions 
}: ExportButtonsProps) {
  
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['REAL ESTATE UNDERWRITING MODEL', '', '', ''],
      ['Property Address:', propertyDetails?.address || 'N/A', '', ''],
      ['Analysis Date:', new Date().toLocaleDateString(), '', ''],
      ['', '', '', ''],
      ['INVESTMENT DECISION', '', '', ''],
      ['Recommendation:', dealData.decision || 'N/A', '', ''],
      ['Confidence Level:', dealData.confidence || 'N/A', '', ''],
      ['', '', '', ''],
      ['KEY METRICS', '', '', ''],
      ['Cap Rate:', `${((dealData.metrics?.capRate || 0) * 100).toFixed(2)}%`, '', ''],
      ['Cash on Cash Return:', `${((dealData.metrics?.cocReturn || 0) * 100).toFixed(2)}%`, '', ''],
      ['IRR:', `${((dealData.metrics?.irr || 0) * 100).toFixed(2)}%`, '', ''],
      ['DSCR:', (dealData.metrics?.dscr || 0).toFixed(2), '', ''],
      ['Price Per Unit:', `$${(dealData.metrics?.pricePerUnit || 0).toLocaleString()}`, '', ''],
      ['Expense Ratio:', `${((dealData.metrics?.expenseRatio || 0) * 100).toFixed(2)}%`, '', ''],
      ['Gross Rent Multiplier:', (dealData.metrics?.grossRentMultiplier || 0).toFixed(2), '', ''],
      ['Occupancy Rate:', `${((dealData.metrics?.occupancy || 0) * 100).toFixed(1)}%`, '', ''],
    ];
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Property Details Sheet
    const propertyData = [
      ['PROPERTY DETAILS', '', '', ''],
      ['Address:', propertyDetails?.address || 'N/A', '', ''],
      ['Property Type:', propertyDetails?.propertyType || 'N/A', '', ''],
      ['Year Built:', propertyDetails?.propertyYear || 'N/A', '', ''],
      ['Total Units:', propertyDetails?.propertyUnit || 'N/A', '', ''],
      ['Crime Rating:', propertyDetails?.propertyCrimeRating || 'N/A', '', ''],
      ['Median Income:', `$${(propertyDetails?.propertyMedianIncome || 0).toLocaleString()}`, '', ''],
      ['Average Income:', `$${(propertyDetails?.propertyAvgIncome || 0).toLocaleString()}`, '', ''],
      ['Estimated Value:', `$${(propertyDetails?.propertyEstimatedValue || 0).toLocaleString()}`, '', ''],
      ['Min Value:', `$${(propertyDetails?.propertyMinValue || 0).toLocaleString()}`, '', ''],
      ['Max Value:', `$${(propertyDetails?.propertyMaxValue || 0).toLocaleString()}`, '', ''],
    ];
    
    const propertySheet = XLSX.utils.aoa_to_sheet(propertyData);
    XLSX.utils.book_append_sheet(workbook, propertySheet, 'Property Details');
    
    // Financial Analysis Sheet
    const financialData = [
      ['FINANCIAL ANALYSIS', '', '', ''],
      ['', '', '', ''],
      ['ASSUMPTIONS', '', '', ''],
      ['Asking Price:', `$${(assumptions?.askingPrice || 0).toLocaleString()}`, '', ''],
      ['Down Payment:', `${assumptions?.downPayment || 0}%`, '', ''],
      ['Interest Rate:', `${assumptions?.interestRate || 0}%`, '', ''],
      ['Loan Term:', `${assumptions?.loanTerm || 0} years`, '', ''],
      ['Exit Cap Rate:', `${assumptions?.exitCapRate || 0}%`, '', ''],
      ['Exit Year:', assumptions?.exitYear || 0, '', ''],
      ['', '', '', ''],
      ['T12 SUMMARY', '', '', ''],
      ['Total Income:', `$${(t12Data?.totalIncome || 0).toLocaleString()}`, '', ''],
      ['Total Expenses:', `$${(t12Data?.totalExpenses || 0).toLocaleString()}`, '', ''],
      ['Net Operating Income:', `$${(t12Data?.netOperatingIncome || 0).toLocaleString()}`, '', ''],
      ['', '', '', ''],
      ['RENT ROLL SUMMARY', '', '', ''],
      ['Total Units:', rentRollData?.totalUnits || 0, '', ''],
      ['Occupied Units:', rentRollData?.occupiedUnits || 0, '', ''],
      ['Occupancy Rate:', `${rentRollData?.occupancyRate || 0}%`, '', ''],
      ['Total Rent:', `$${(rentRollData?.totalRent || 0).toLocaleString()}`, '', ''],
      ['Average Rent:', `$${(rentRollData?.averageRent || 0).toLocaleString()}`, '', ''],
    ];
    
    const financialSheet = XLSX.utils.aoa_to_sheet(financialData);
    XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Analysis');
    
    // Buy Box Criteria Sheet
    const buyBoxData = [
      ['BUY BOX CRITERIA', '', '', ''],
      ['', '', '', ''],
      ['INVESTMENT CRITERIA', '', '', ''],
      ['Min Year Built:', buyBox?.minYearBuilt || 0, '', ''],
      ['Min CoC Return:', `${buyBox?.minCoCReturn || 0}%`, '', ''],
      ['Min Cap Rate:', `${buyBox?.minCapRate || 0}%`, '', ''],
      ['Max Purchase Price:', `$${(buyBox?.maxPurchasePrice || 0).toLocaleString()}`, '', ''],
      ['Min Units:', buyBox?.minUnits || 0, '', ''],
      ['', '', '', ''],
      ['PREFERRED MARKETS', '', '', ''],
      ...(buyBox?.preferredMarkets || []).map((market: string, index: number) => [
        `Market ${index + 1}:`, market, '', ''
      ]),
    ];
    
    const buyBoxSheet = XLSX.utils.aoa_to_sheet(buyBoxData);
    XLSX.utils.book_append_sheet(workbook, buyBoxSheet, 'Buy Box');
    
    // Analysis Results Sheet
    const analysisData = [
      ['ANALYSIS RESULTS', '', '', ''],
      ['', '', '', ''],
      ['REASONING', '', '', ''],
      ...(dealData.reasoning || []).map((reason: string, index: number) => [
        `${index + 1}.`, reason, '', ''
      ]),
      ['', '', '', ''],
      ['RISK FACTORS', '', '', ''],
      ...(dealData.risks || []).map((risk: string, index: number) => [
        `Risk ${index + 1}:`, risk, '', ''
      ]),
    ];
    
    const analysisSheet = XLSX.utils.aoa_to_sheet(analysisData);
    XLSX.utils.book_append_sheet(workbook, analysisSheet, 'Analysis');
    
    // Export the file
    const fileName = `Real_Estate_Analysis_${propertyDetails?.address?.replace(/[^a-zA-Z0-9]/g, '_') || 'Property'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('REAL ESTATE INVESTMENT SUMMARY', pageWidth / 2, 30, { align: 'center' });
    
    // Property Address
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Property: ${propertyDetails?.address || 'N/A'}`, pageWidth / 2, 45, { align: 'center' });
    doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 55, { align: 'center' });
    
    let yPosition = 75;
    
    // Investment Decision
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('INVESTMENT DECISION', margin, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Decision box
    const decisionColor = dealData.decision === 'BUY' ? [0, 128, 0] : 
                         dealData.decision === 'PASS' ? [255, 0, 0] : [255, 165, 0];
    doc.setFillColor(decisionColor[0], decisionColor[1], decisionColor[2]);
    doc.rect(margin, yPosition - 5, 60, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(dealData.decision || 'N/A', margin + 30, yPosition + 5, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(`Confidence: ${dealData.confidence || 'N/A'}`, margin + 70, yPosition + 5);
    yPosition += 25;
    
    // Key Metrics Table
    doc.setFont('helvetica', 'bold');
    doc.text('KEY FINANCIAL METRICS', margin, yPosition);
    yPosition += 10;
    
    const metricsData = [
      ['Metric', 'Value', 'Target', 'Status'],
      ['Cap Rate', `${((dealData.metrics?.capRate || 0) * 100).toFixed(2)}%`, `${buyBox?.minCapRate || 0}%`, 
       (dealData.metrics?.capRate || 0) * 100 >= (buyBox?.minCapRate || 0) ? '✓' : '✗'],
      ['Cash on Cash Return', `${((dealData.metrics?.cocReturn || 0) * 100).toFixed(2)}%`, `${buyBox?.minCoCReturn || 0}%`,
       (dealData.metrics?.cocReturn || 0) * 100 >= (buyBox?.minCoCReturn || 0) ? '✓' : '✗'],
      ['IRR', `${((dealData.metrics?.irr || 0) * 100).toFixed(2)}%`, 'N/A', 'N/A'],
      ['DSCR', (dealData.metrics?.dscr || 0).toFixed(2), '> 1.25', 
       (dealData.metrics?.dscr || 0) > 1.25 ? '✓' : '✗'],
      ['Price Per Unit', `$${(dealData.metrics?.pricePerUnit || 0).toLocaleString()}`, 'N/A', 'N/A'],
      ['Occupancy Rate', `${((dealData.metrics?.occupancy || 0) * 100).toFixed(1)}%`, '> 90%',
       (dealData.metrics?.occupancy || 0) * 100 > 90 ? '✓' : '✗'],
    ];
    
    (doc as any).autoTable({
      startY: yPosition,
      head: [metricsData[0]],
      body: metricsData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
    });
    
    yPosition = (doc as any).autoTable.previous.finalY + 20;
    
    // Property Details
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('PROPERTY DETAILS', margin, yPosition);
    yPosition += 10;
    
    const propertyData = [
      ['Attribute', 'Value'],
      ['Property Type', propertyDetails?.propertyType || 'N/A'],
      ['Year Built', propertyDetails?.propertyYear || 'N/A'],
      ['Total Units', propertyDetails?.propertyUnit || 'N/A'],
      ['Crime Rating', propertyDetails?.propertyCrimeRating || 'N/A'],
      ['Median Income', `$${(propertyDetails?.propertyMedianIncome || 0).toLocaleString()}`],
      ['Estimated Value', `$${(propertyDetails?.propertyEstimatedValue || 0).toLocaleString()}`],
    ];
    
    (doc as any).autoTable({
      startY: yPosition,
      head: [propertyData[0]],
      body: propertyData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219] },
      margin: { left: margin, right: margin },
    });
    
    yPosition = (doc as any).autoTable.previous.finalY + 20;
    
    // Analysis Reasoning
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.text('ANALYSIS REASONING', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    (dealData.reasoning || []).forEach((reason: string, index: number) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${reason}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 6 + 5;
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
    });
    
    // Risk Factors
    if (dealData.risks && dealData.risks.length > 0) {
      yPosition += 10;
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text('RISK FACTORS', margin, yPosition);
      yPosition += 15;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 0, 0);
      dealData.risks.forEach((risk: string, index: number) => {
        const lines = doc.splitTextToSize(`⚠ ${risk}`, pageWidth - 2 * margin);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 6 + 5;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });
      doc.text('Generated by RealEstate Analyzer', margin, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    const fileName = `Investment_Summary_${propertyDetails?.address?.replace(/[^a-zA-Z0-9]/g, '_') || 'Property'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Analysis</span>
        </CardTitle>
        <CardDescription>
          Download your analysis as Excel or PDF format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={exportToExcel}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Excel Model</span>
          </Button>
          
          <Button 
            onClick={exportToPDF}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <FileText className="h-4 w-4" />
            <span>Export PDF Summary</span>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• <strong>Excel Model:</strong> Complete underwriting model with all data sheets</p>
          <p>• <strong>PDF Summary:</strong> Professional investment summary report</p>
        </div>
      </CardContent>
    </Card>
  );
}