'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, Loader2, Plus, X } from 'lucide-react';
import { BuyBox, Assumptions } from './dashboard';

// Mock data for testing
const MOCK_PROPERTY_DETAILS = {
  address: "4529 Winona Court, Denver, CO 80212",
  propertyType: "Multi-Family",
  propertyYear: 1985,
  propertyUnit: 32,
  propertyCrimeRating: "B+",
  propertyMedianIncome: 65000,
  propertyAvgIncome: 58000,
  propertyEstimatedValue: 4900000,
  propertyMinValue: 4500000,
  propertyMaxValue: 5300000,
  propertySchoolsAndRating: [
    { InstitutionName: "Denver Elementary", schoolRating: "8/10" },
    { InstitutionName: "Jefferson Middle School", schoolRating: "7/10" },
    { InstitutionName: "Washington High School", schoolRating: "9/10" }
  ]
};

const MOCK_T12_DATA = {
  totalIncome: 1200000,
  totalExpenses: 465000,
  netOperatingIncome: 735000,
  grossRentalIncome: 1150000,
  otherIncome: 50000,
  operatingExpenses: 465000,
  vacancy: 0.05
};

const MOCK_RENT_ROLL_DATA = {
  totalUnits: 32,
  occupiedUnits: 28,
  occupancyRate: 87.5,
  totalRent: 96000,
  averageRent: 3000,
  units: [
    { unit: "101", rent: 2800, occupied: true, tenant: "John Doe" },
    { unit: "102", rent: 3200, occupied: true, tenant: "Jane Smith" },
    { unit: "103", rent: 2900, occupied: false, tenant: null },
    { unit: "104", rent: 3100, occupied: true, tenant: "Bob Johnson" }
  ]
};

interface InvestmentCriteriaProps {
  buyBox: BuyBox;
  assumptions: Assumptions;
  onBuyBoxChange: (buyBox: BuyBox) => void;
  onAssumptionsChange: (assumptions: Assumptions) => void;
  onAnalyze: () => any;
  onAnalysisComplete: (results: any) => void;
  canAnalyze: boolean;
}

export function AnalysisResults({
  buyBox,
  assumptions,
  onBuyBoxChange,
  onAssumptionsChange,
  onAnalyze,
  onAnalysisComplete,
  canAnalyze,
}: InvestmentCriteriaProps) {
  const [loading, setLoading] = useState(false);
  const [newMarket, setNewMarket] = useState('');
  const [useMockData, setUseMockData] = useState(false);

  const addMarket = () => {
    if (newMarket.trim() && !buyBox.preferredMarkets.includes(newMarket.trim())) {
      onBuyBoxChange({
        ...buyBox,
        preferredMarkets: [...buyBox.preferredMarkets, newMarket.trim()],
      });
      setNewMarket('');
    }
  };

  const removeMarket = (market: string) => {
    onBuyBoxChange({
      ...buyBox,
      preferredMarkets: buyBox.preferredMarkets.filter(m => m !== market),
    });
  };

  const handleAnalyze = async () => {
    if (!canAnalyze && !useMockData) return;

    setLoading(true);
    
    try {
      if(useMockData) localStorage.setItem("address",MOCK_PROPERTY_DETAILS.address);
        
      const analysisData = useMockData ? {
        propertyDetails: MOCK_PROPERTY_DETAILS,
        t12Data: MOCK_T12_DATA,
        rentRollData: MOCK_RENT_ROLL_DATA,
        buyBox,
        assumptions,
      } : onAnalyze();
      
      const payload = {
        userData: {
          buyBox,
          assumptions,
        },
        t12Data: analysisData.t12Data,
        rentRollData: analysisData.rentRollData,
        propertyData: analysisData.propertyDetails,
      };
      console.log(payload)

      const token = localStorage.getItem('token');
      const response = await fetch('https://real-estate-underwriter-server.onrender.com/api/v1/deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = 'Analysis failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `Analysis failed with status ${response.status}`;
        } catch {
          try {
            const errorText = await response.text();
            errorMessage = errorText || `Analysis failed with status ${response.status}`;
          } catch {
            errorMessage = `Analysis failed with status ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const results = await response.json();
      onAnalysisComplete(results);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5" />
          <span>Investment Criteria</span>
        </CardTitle>
        <CardDescription>
          Set your investment parameters and assumptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buybox" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buybox">Buy Box</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buybox" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minYearBuilt">Min Year Built</Label>
                <Input
                  id="minYearBuilt"
                  type="number"
                  value={buyBox.minYearBuilt}
                  onChange={(e) => onBuyBoxChange({ ...buyBox, minYearBuilt: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minUnits">Min Units</Label>
                <Input
                  id="minUnits"
                  type="number"
                  value={buyBox.minUnits}
                  onChange={(e) => onBuyBoxChange({ ...buyBox, minUnits: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minCoCReturn">Min CoC Return (%)</Label>
                <Input
                  id="minCoCReturn"
                  type="number"
                  step="0.1"
                  value={buyBox.minCoCReturn}
                  onChange={(e) => onBuyBoxChange({ ...buyBox, minCoCReturn: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minCapRate">Min Cap Rate (%)</Label>
                <Input
                  id="minCapRate"
                  type="number"
                  step="0.1"
                  value={buyBox.minCapRate}
                  onChange={(e) => onBuyBoxChange({ ...buyBox, minCapRate: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxPurchasePrice">Max Purchase Price ($)</Label>
              <Input
                id="maxPurchasePrice"
                type="number"
                value={buyBox.maxPurchasePrice}
                onChange={(e) => onBuyBoxChange({ ...buyBox, maxPurchasePrice: Number(e.target.value) })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Preferred Markets</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add market"
                  value={newMarket}
                  onChange={(e) => setNewMarket(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addMarket()}
                />
                <Button size="sm" onClick={addMarket}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {buyBox.preferredMarkets.map((market) => (
                  <Badge key={market} variant="secondary" className="flex items-center space-x-1">
                    <span>{market}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeMarket(market)} />
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="assumptions" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="askingPrice">Asking Price ($)</Label>
                <Input
                  id="askingPrice"
                  type="number"
                  value={assumptions.askingPrice}
                  onChange={(e) => onAssumptionsChange({ ...assumptions, askingPrice: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment (%)</Label>
                <Input
                  id="downPayment"
                  type="number"
                  step="0.1"
                  value={assumptions.downPayment}
                  onChange={(e) => onAssumptionsChange({ ...assumptions, downPayment: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={assumptions.interestRate}
                  onChange={(e) => onAssumptionsChange({ ...assumptions, interestRate: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={assumptions.loanTerm}
                  onChange={(e) => onAssumptionsChange({ ...assumptions, loanTerm: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exitCapRate">Exit Cap Rate (%)</Label>
                <Input
                  id="exitCapRate"
                  type="number"
                  step="0.1"
                  value={assumptions.exitCapRate}
                  onChange={(e) => onAssumptionsChange({ ...assumptions, exitCapRate: Number(e.target.value) })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exitYear">Exit Year</Label>
                <Input
                  id="exitYear"
                  type="number"
                  value={assumptions.exitYear}
                  onChange={(e) => onAssumptionsChange({ ...assumptions, exitYear: Number(e.target.value) })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-4 border-t">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="useMockData"
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="useMockData" className="text-sm">
              Use mock data for testing (bypasses file uploads)
            </Label>
          </div>
          
          <Button 
            onClick={handleAnalyze} 
            disabled={(!canAnalyze && !useMockData) || loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Deal... (This may take 30-40 seconds)
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-5 w-5" />
                {useMockData ? 'Analyze Deal (Mock Data)' : 'Analyze Deal'}
              </>
            )}
          </Button>
          
          {!canAnalyze && !useMockData && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Please complete property search and file uploads to analyze, or use mock data for testing
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}