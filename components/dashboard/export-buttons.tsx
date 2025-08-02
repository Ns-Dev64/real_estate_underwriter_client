'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, FileText, FileSignature } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { useState } from 'react';

interface ExportButtonsProps {
  dealData: any;
  propertyDetails: any;
  t12Data: any;
  rentRollData: any;
  buyBox: any;
  assumptions: any;
  // New props for LOI
  userData?: {
    name?: string;
    company?: string;
    phone?: string;
    email?: string;
  };
}

export function ExportButtons({ 
  dealData, 
  propertyDetails, 
  buyBox, 
  assumptions,
  rentRollData,
  userData,

}: ExportButtonsProps) {
  const [isGeneratingLOI, setIsGeneratingLOI] = useState(false);

const exportToExcel = () => {
    const address = localStorage.getItem("address");

    const workbook = XLSX.utils.book_new();
    // Summary Sheet
    const summaryData = [
      ['REAL ESTATE UNDERWRITING MODEL', '', '', ''],
      ['Property Address:', propertyDetails.address?.toString() || 'N/A', '', ''],
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
      ['Address:', propertyDetails?.address || address || 'N/A', '', ''],
      ['Year Built:', propertyDetails?.yearBuilt || propertyDetails.propertyYear || 'N/A', '', ''],
      ['Total Units:', propertyDetails?.units || propertyDetails.propertyUnit || 'N/A', '', ''],
      ['Crime Rating:', propertyDetails?.crimeRating || propertyDetails.propertyCrimeRating || 'N/A', '', ''],
      ['Median Income:', `$${(propertyDetails?.medianIncome || propertyDetails.propertyMedianIncome || 0).toLocaleString()}`, '', ''],
      ['Estimated Value:', `$${(propertyDetails?.propertyValue || propertyDetails.propertyEstimatedValue || 0).toLocaleString()}`, '', ''],
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
      ...(dealData.risks || []).map((risk: any,) => [
        `${risk.risk ? risk.risk : risk}`, risk.risk ? risk.commentary : '', '', ''
      ]),
      ['Advices', '', '', ''],
      ...(dealData.advice || []).map((advice: any) => [
        `${advice.recommendation ? advice.recommendation : advice.details ? advice : ''}`, advice.details ? advice.details : ''
      ])
    ];
    
    const analysisSheet = XLSX.utils.aoa_to_sheet(analysisData);
    XLSX.utils.book_append_sheet(workbook, analysisSheet, 'Analysis');
    
    // Export the file
    const fileName = `Real_Estate_Analysis_${propertyDetails?.address?.replace(/[^a-zA-Z0-9]/g, '_') || 'Property'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };
  
const exportToPDF = () => {
    const address = localStorage.getItem("address");
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
    doc.text(`Property: ${propertyDetails.address || 'N/A'}`, pageWidth / 2, 45, { align: 'center' });
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
    const decisionColor = dealData.decision === 'PASS' ? [0, 128, 0] : dealData.decision === "FAIL" ? [255, 0, 0] : [255, 165, 0];
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
       (dealData.metrics?.capRate || 0) * 100 >= (buyBox?.minCapRate || 0) ? '[OK]' : '[X]'],
      ['Cash on Cash Return', `${((dealData.metrics?.cocReturn || 0) * 100).toFixed(2)}%`, `${buyBox?.minCoCReturn || 0}%`,
       (dealData.metrics?.cocReturn || 0) * 100 >= (buyBox?.minCoCReturn || 0) ? '[OK]' : '[X]'],
      ['IRR', `${((dealData.metrics?.irr || 0) * 100).toFixed(2)}%`, 'N/A', 'N/A'],
      ['DSCR', (dealData.metrics?.dscr || 0).toFixed(2), '> 1.25', 
       (dealData.metrics?.dscr || 0) > 1.25 ? '[OK]' : '[X]'],
      ['Price Per Unit', `$${(dealData.metrics?.pricePerUnit || 0).toLocaleString()}`, 'N/A', 'N/A'],
      ['Occupancy Rate', `${((dealData.metrics?.occupancy || 0) * 100).toFixed(1)}%`, '> 90%',
       (dealData.metrics?.occupancy || 0) * 100 > 90 ? '[OK]' : '[X]'],
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [metricsData[0]],
      body: metricsData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
    });
    
    // IMPORTANT: Update yPosition after the table
    yPosition = (doc as any).lastAutoTable.finalY + 20;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Property Details
    doc.setFont('helvetica', 'bold');
    doc.text('PROPERTY DETAILS', margin, yPosition);
    yPosition += 10;
    
    const propertyData = [
      ['Attribute', 'Value'],
      ['Property Address', propertyDetails.address || address || 'N/A'],
      ['Property Type', propertyDetails?.propertyType || 'N/A'],
      ['Year Built', propertyDetails?.yearBuilt || propertyDetails.propertyYear || 'N/A'],
      ['Total Units', propertyDetails?.units || propertyDetails.propertyUnit || 'N/A'],
      ['Crime Rating', propertyDetails?.crimeRating || propertyDetails.propertyCrimeRating || 'N/A'],
      ['Median Income', `$${(propertyDetails?.medianIncome || propertyDetails.propertyMedianIncome || 0).toLocaleString()}`],
      ['Estimated Value', `$${(propertyDetails?.propertyValue || propertyDetails.propertyEstimatedValue || 0).toLocaleString()}`],
    ];
    
    autoTable(doc, {
      startY: yPosition,
      head: [propertyData[0]],
      body: propertyData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [52, 152, 219] },
      margin: { left: margin, right: margin },
    });
    
    // Update yPosition after the property table
    yPosition = (doc as any).lastAutoTable.finalY + 20;
    
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }
    
    // Analysis Reasoning
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0); // Ensure text color is black
    doc.text('ANALYSIS REASONING', margin, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    (dealData.reasoning || []).forEach((reason: string, index: number) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${reason}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 6 + 2;
      
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
      doc.setTextColor(0, 0, 0); // Reset to black for title
      doc.text('RISK FACTORS', margin, yPosition);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 0, 0); // Red for risk factors
      dealData.risks.forEach((risk: any, index: number) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${risk.risk ? risk.risk + " :" : risk} ${risk.risk ? risk.commentary : ''}`, pageWidth - 2 * margin);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * 6 + 2;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      });
    }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('ADVICES', margin, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');

    dealData.advice.forEach((advice: any, index: number) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${advice.recommendation ? advice.recommendation + " :" : advice}  ${advice.recommendation ? advice.details : ""}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * 6 + 2;
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
    });
    
    // Reset text color to black for footer
    doc.setTextColor(0, 0, 0);
    
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

  // NEW: LOI Generator Function
const generateLOI = async () => {

    setIsGeneratingLOI(true);
    
    try {

      // Extract deal information
      const averageRent = rentRollData?.averageRent;
      const downPaymentAmount = (assumptions?.askingPrice || 0) * (assumptions?.downPayment/100 || 0.25);
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const RepresentationAndWarranties='Seller represents that all information provided regarding the property, including but not limited to rent roll, operating expenses, and title documents, is accurate and complete to the best of their knowledge. Seller warrants that there are no undisclosed liens, pending litigation, or claims against the property. Seller agrees to provide all necessary disclosures as required by California law prior to closing.'
      const BindingProvisions='The following provisions are binding upon execution of this Letter of Intent: (i) Exclusivity – Seller agrees not to solicit or accept other offers for a period of 30 days from acceptance of this LOI; (ii) Confidentiality – All negotiations and exchanged information shall remain confidential; and (iii) Governing Law – This LOI shall be governed by and construed under the laws of the State of California.'
      const Expiration='This Letter of Intent shall expire if not executed by both parties on or before [Insert Date].'

      // Create DOCX document
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              text: "LETTER OF INTENT",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Date and parties
            new Paragraph({
              children: [
                new TextRun({ text: "Date: ", bold: true }),
                new TextRun(currentDate)
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "To: ", bold: true }),
                new TextRun(propertyDetails?.propertyOwner || "[SELLER NAME]")
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "From: ", bold: true }),
                new TextRun(`${userData?.name || "[BUYER NAME]"}/${userData?.company || "[BUYER COMPANY]"}`)
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Re: ", bold: true }),
                new TextRun(propertyDetails?.address || "[PROPERTY ADDRESS]")
              ],
              spacing: { after: 400 }
            }),

            // Offer Terms Section
            new Paragraph({
              text: "OFFER TERMS",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Purchase Price: ", bold: true }),
                new TextRun(`$${(assumptions?.askingPrice || 0).toLocaleString()}`)
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Earnest Money: ", bold: true }),
                new TextRun(`$${Math.round((assumptions?.askingPrice || 0) * 0.012).toLocaleString()}`)
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Down Payment: ", bold: true }),
                new TextRun(`${((assumptions?.downPayment || 0.25))}% ($${downPaymentAmount.toLocaleString()})`)
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Financing: ", bold: true }),
                new TextRun(`${(((assumptions?.askingPrice || 0) - downPaymentAmount) / (assumptions?.askingPrice || 1) * 100).toFixed(0)}% conventional financing`)
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Due Diligence Period: ", bold: true }),
                new TextRun("45 days")
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Closing: ", bold: true }),
                new TextRun("60 days from executed Purchase Agreement")
              ],
              spacing: { after: 400 }
            }),


            // Key Conditions Section
            new Paragraph({
              text: "KEY CONDITIONS",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: `• Subject to financing approval (${assumptions?.loanTerm || 30}-year loan, ${((assumptions?.interestRate || 0.0625)).toFixed(2)}% interest rate)`,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• Subject to satisfactory property inspection and due diligence review",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• Subject to verification of rental income and operating expenses",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• Clear and marketable title required",
              spacing: { after: 400 }
            }),

            new Paragraph({
              text: "REPRESENTATIONS & WARRANTIES", //Representations & Warranties
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
             new Paragraph({
              text: `• Seller represents that all information provided regarding the property (including rent roll, operating expenses, and title documents) is accurate and complete to the best of their knowledge`,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "•  Seller warrants that there are no undisclosed liens, pending litigation, or claims against the property",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• Seller agrees to provide necessary disclosures as required by [STATE] law prior to closing",
              spacing: { after: 400 }
            }),
           

            // Property Details Section
            new Paragraph({
              text: "PROPERTY DETAILS",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Units: ", bold: true }),
                new TextRun((rentRollData?.totalUnits || 0).toString())
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Current Rent Roll: ", bold: true }),
                new TextRun(`$${averageRent}/month ($${(rentRollData.units[0]?.rentAmount || 0)} per unit)`)
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Year Built: ", bold: true }),
                new TextRun((propertyDetails?.yearBuilt || propertyDetails?.propertyYear || 0).toString())
              ],
              spacing: { after: 400 }
            }),

            // Divider

            // Next Steps Section
            new Paragraph({
              text: "NEXT STEPS",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: "• LOI response requested within 3 business days",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• Purchase Agreement execution within 7 days of LOI acceptance",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• 30 days exclusivity period upon acceptance",
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: "This Letter of Intent outlines basic terms for negotiation and is non-binding except for confidentiality and exclusivity provisions.",
              spacing: { after: 400 }
            }),
             new Paragraph({
              text: "BINDING PROVISIONS",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
             new Paragraph({
              text: `• Seller agrees not to solicit or accept other offers for 30 days from acceptance of this LOI`,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• All negotiations and exchanged information shall remain confidential",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "• This LOI shall be governed by the laws of the State of [STATE]",
              spacing: { after: 400 }
            }),

             new Paragraph({
              text: "EXPIRATION CLAUSE",
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 }
            }),
             new Paragraph({
              text: `This LOI shall expire if not executed by both parties on or before [specific date].`,
              spacing: { after: 400 }
            }),
            
            // Signature Section
            new Paragraph({
              
              spacing: { after: 200 },
              children:[
                new TextRun({
                  text: "Submitted by:",
              bold: true,
                })
              ]
            }),
            new Paragraph({
              text: "[SIGNATURE]",
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: userData?.name || "[BUYER NAME]",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: userData?.company || "[BUYER COMPANY]",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: `Phone: ${userData?.phone || "[PHONE]"}`,
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: `Email: ${userData?.email || "[EMAIL]"}`,
              spacing: { after: 400 }
            }),

            // Seller Acceptance
            new Paragraph({
              spacing: { after: 200 },
             children:[
              new TextRun({
                 text: "Seller Acceptance:",
                 bold:true
              })
             ]
            }),
            new Paragraph({
              text: "Signature: _________________________ Date: _________",
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: "Print Name: _________________________",
              spacing: { after: 200 }
            })
          ]
        }]
      });

      // Generate and download
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LOI_${propertyDetails?.address?.replace(/[^a-zA-Z0-9]/g, '_') || 'Property'}_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating LOI:', error);
      alert('Error generating LOI. Please try again.');
    } finally {
      setIsGeneratingLOI(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Export Analysis & Documents</span>
        </CardTitle>
        <CardDescription>
          Download your analysis and generate LOI documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <Button 
            onClick={generateLOI}
            disabled={isGeneratingLOI}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <FileSignature className="h-4 w-4" />
            <span>{isGeneratingLOI ? 'Generating...' : 'Generate LOI'}</span>
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• <strong>Excel Model:</strong> Complete underwriting model with all data sheets</p>
          <p>• <strong>PDF Summary:</strong> Professional investment summary report</p>
          <p>• <strong>LOI Document:</strong> Letter of Intent ready for submission to seller</p>
        </div>

        {/* LOI Preview Section */}
        {(userData?.name || propertyDetails?.propertyOwner) && (
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">LOI Preview</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Seller:</span> {propertyDetails?.propertyOwner || "[Not provided]"}</p>
              <p><span className="font-medium">Property:</span> {propertyDetails?.address || "[Property address]"}</p>
              <p><span className="font-medium">Offer Price:</span> ${(assumptions?.askingPrice || 0).toLocaleString()}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}