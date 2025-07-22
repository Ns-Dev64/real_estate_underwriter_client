'use client';
import { useState, useEffect } from 'react';
import { Header } from './header';
import { PropertySearch } from './property-search';
import { FileUploads } from './file-uploads';
import { InvestmentCriteria } from './investment-criteria';
import { AnalysisResults } from './analysis-results';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Calendar, Eye, Trash2, Loader } from 'lucide-react';

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

interface SavedDeal {
  _id: string;
  decision: string;
  confidence: string;
  reasoning: string[];
  metrics: {
    capRate: number;
    cocReturn: number;
    irr: number;
    dscr: number;
    pricePerUnit: number;
    expenseRatio: number;
  };
  risks: string[];
  userEmail: string;
  [key: string]: any;
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
  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [dealsError, setDealsError] = useState<string | null>(null);
  const [isFromSavedDeal, setIsFromSavedDeal] = useState(false);

  // Fetch saved deals on component mount
  useEffect(() => {
    const fetchSavedDeals = async () => {
      try {
        setIsLoadingDeals(true);
        setDealsError(null);

        const token=localStorage.getItem("token");
        const response = await fetch('https://real-estate-underwriter-server.onrender.com/api/v1/deals',{
          method:'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const deals = await response.json();
          setSavedDeals(Array.isArray(deals) ? deals : []);
        } else {
          setDealsError('Failed to load saved deals');
        }
      } catch (error) {
        console.error('Error fetching saved deals:', error);
        setDealsError('Error loading saved deals');
      } finally {
        setIsLoadingDeals(false);
      }
    };

    fetchSavedDeals();
  }, []);

  const handleViewDeal = (deal: SavedDeal) => {
    // Load the deal data into the current analysis - the deal data is the saved deal itself
    setAnalysisResults(deal);
    setIsFromSavedDeal(true);
    
    // Optionally scroll to the analysis results
    const resultsElement = document.getElementById('analysis-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    try {
      const token=localStorage.getItem("token");
      const response = await fetch(`https://real-estate-underwriter-server.onrender.com/api/v1/deals/${dealId}`, {
        method: 'DELETE',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.ok) {
        setSavedDeals(prev => prev.filter(deal => deal._id !== dealId));
      } else {
        alert('Failed to delete deal');
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Error deleting deal');
    }
  };

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
              onAnalysisStart={() => setIsFromSavedDeal(false)}
              onAnalysisStart={() => setIsFromSavedDeal(false)}
            />
          </div>
        </div>

        {/* Saved Deals Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Saved Deals</span>
              <Badge variant="secondary">{savedDeals.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingDeals ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin mr-2" />
                <span>Loading saved deals...</span>
              </div>
            ) : dealsError ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{dealsError}</p>
              </div>
            ) : savedDeals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved deals yet. Complete an analysis and save your first deal!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedDeals.map((savedDeal) => {
                  const metrics = savedDeal.metrics || {};
                  const decision = savedDeal.decision || 'N/A';
                  
                  return (
                    <Card key={savedDeal._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant={decision === 'BUY' ? 'default' : decision === 'PASS' ? 'destructive' : decision === 'FAIL' ? 'destructive' : 'secondary'}>
                            {decision}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {savedDeal.confidence}
                            </Badge>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDeal(savedDeal)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteDeal(savedDeal._id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CoC Return:</span>
                            <span className="font-medium">
                              {(metrics.cocReturn * 100)?.toFixed(1) || 'N/A'}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cap Rate:</span>
                            <span className="font-medium">
                              {(metrics.capRate * 100)?.toFixed(1) || 'N/A'}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IRR:</span>
                            <span className="font-medium">
                              {(metrics.irr * 100)?.toFixed(1) || 'N/A'}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price/Unit:</span>
                            <span className="font-medium">
                              ${metrics.pricePerUnit?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        {savedDeal.reasoning && savedDeal.reasoning.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {savedDeal.reasoning[0]}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <div id="analysis-results">
            <AnalysisResults 
              results={analysisResults}
              propertyDetails={propertyDetails}
              t12Data={t12Data}
              rentRollData={rentRollData}
              buyBox={buyBox}
              assumptions={assumptions}
              isFromSavedDeal={isFromSavedDeal}
            />
          </div>
        )}
      </main>
    </div>
  );
}