'use client';

import { useState } from 'react';
import { Header } from './header';
import { PropertySearch } from './property-search';
import { FileUploads } from './file-uploads';
import { InvestmentCriteria } from './investment-criteria';
import { AnalysisResults } from './analysis-results';
import { Card } from '@/components/ui/card';

export interface PropertyDetails {
  address: string;
  [key: string]: any;
}

export interface T12Data {
  [key: string]: any;
}

export interface RentRollData {
  [key: string]: any;
}

export interface BuyBox {
  minYearBuilt: number;
  minCoCReturn: number;
  minCapRate: number;
  maxPurchasePrice: number;
  minUnits: number;
  preferredMarkets: string[];
}

export interface Assumptions {
  askingPrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  exitCapRate: number;
  exitYear: number;
}

export function Dashboard() {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [t12Data, setT12Data] = useState<T12Data | null>(null);
  const [rentRollData, setRentRollData] = useState<RentRollData | null>(null);
  const [buyBox, setBuyBox] = useState<BuyBox>({
    minYearBuilt: 1980,
    minCoCReturn: 8,
    minCapRate: 6,
    maxPurchasePrice: 1000000,
    minUnits: 10,
    preferredMarkets: [],
  });
  const [assumptions, setAssumptions] = useState<Assumptions>({
    askingPrice: 0,
    downPayment: 25,
    interestRate: 7,
    loanTerm: 30,
    exitCapRate: 6,
    exitYear: 5,
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Real Estate Deal Analyzer</h1>
          <p className="text-muted-foreground">Analyze your real estate investments with precision</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <PropertySearch 
              onPropertyDetails={setPropertyDetails} 
              propertyDetails={propertyDetails}
            />
            
            <FileUploads 
              onT12Upload={setT12Data}
              onRentRollUpload={setRentRollData}
              t12Data={t12Data}
              rentRollData={rentRollData}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <InvestmentCriteria
              buyBox={buyBox}
              assumptions={assumptions}
              onBuyBoxChange={setBuyBox}
              onAssumptionsChange={setAssumptions}
              onAnalyze={() => ({
                propertyDetails,
                t12Data,
                rentRollData,
                buyBox,
                assumptions,
              })}
              onAnalysisComplete={setAnalysisResults}
              canAnalyze={!!(propertyDetails && t12Data && rentRollData)}
            />
          </div>
        </div>

        {analysisResults && (
          <AnalysisResults 
            results={analysisResults}
            propertyDetails={propertyDetails}
            t12Data={t12Data}
            rentRollData={rentRollData}
            buyBox={buyBox}
            assumptions={assumptions}
          />
        )}
      </main>
    </div>
  );
}