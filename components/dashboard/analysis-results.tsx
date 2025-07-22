'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ExportButtons } from './export-buttons';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Percent, 
  Calculator,
  Save,
  Loader2
} from 'lucide-react';

interface AnalysisResultsProps {
  results: any;
  propertyDetails: any;
  t12Data: any;
  rentRollData: any;
  buyBox: any;
  assumptions: any;
  isFromSavedDeal?: boolean;
}

export function AnalysisResults({ 
  results, 
  propertyDetails, 
  t12Data, 
  rentRollData, 
  buyBox, 
  assumptions,
  isFromSavedDeal = false
}: AnalysisResultsProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Check if deal is already saved
  const isDealSaved = results?._id || isFromSavedDeal;

  const handleSaveDeal = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://real-estate-underwriter-server.onrender.com/api/v1/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({deal:results}),
      });

      if (response.ok) {
        const savedDeal = await response.json();
        // Update the results with the saved deal ID to prevent duplicate saves
        if (savedDeal._id) {
          results._id = savedDeal._id;
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save deal:', error);
    } finally {
      setSaving(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision?.toUpperCase()) {
      case 'BUY': return 'bg-green-500';
      case 'PASS': return 'bg-red-500';
      case 'FAIL': return 'bg-red-600';
      default: return 'bg-yellow-500';
    }
  };

  const getDecisionVariant = (decision: string) => {
    switch (decision?.toUpperCase()) {
      case 'BUY': return 'default';
      case 'PASS': return 'destructive';
      case 'FAIL': return 'destructive';
      default: return 'secondary';
    }
  };

  const metrics = results?.metrics || {};
  const decision = results?.decision || 'N/A';
  const confidence = results?.confidence || 'N/A';
  const reasoning = results?.reasoning || [];
  const risks = results?.risks || [];

  return (
    <div className="space-y-6">
      {/* Decision Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full ${getDecisionColor(decision)} flex items-center justify-center`}>
                {decision === 'BUY' ? (
                  <CheckCircle className="h-8 w-8 text-white" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">Investment Decision</CardTitle>
                <CardDescription>AI-powered analysis results</CardDescription>
              </div>
            </div>
            {!isDealSaved && (
              <Button 
                onClick={handleSaveDeal}
                disabled={saving || saved}
                className="flex items-center space-x-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saved ? 'Saved!' : saving ? 'Saving...' : 'Save Deal'}</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Recommendation</h3>
              <Badge variant={getDecisionVariant(decision)} className="text-lg px-4 py-2">
                {decision}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Confidence Level</h3>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {confidence}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Key Financial Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Cap Rate</span>
              </div>
              <p className="text-2xl font-bold">
                {((metrics.capRate || 0) * 100).toFixed(2)}%
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Target: {buyBox?.minCapRate || 0}%</span>
                {(metrics.capRate || 0) * 100 >= (buyBox?.minCapRate || 0) ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">CoC Return</span>
              </div>
              <p className="text-2xl font-bold">
                {((metrics.cocReturn || 0) * 100).toFixed(2)}%
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Target: {buyBox?.minCoCReturn || 0}%</span>
                {(metrics.cocReturn || 0) * 100 >= (buyBox?.minCoCReturn || 0) ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">IRR</span>
              </div>
              <p className="text-2xl font-bold">
                {((metrics.irr || 0) * 100).toFixed(2)}%
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">DSCR</span>
              </div>
              <p className="text-2xl font-bold">
                {(metrics.dscr || 0).toFixed(2)}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">Target: > 1.25</span>
                {(metrics.dscr || 0) > 1.25 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Price Per Unit</span>
              <p className="text-lg font-semibold">
                ${(metrics.pricePerUnit || 0).toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Expense Ratio</span>
              <p className="text-lg font-semibold">
                {((metrics.expenseRatio || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Occupancy Rate</span>
              <p className="text-lg font-semibold">
                {((metrics.occupancy || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Details */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="reasoning" className="space-y-4">
            <TabsList>
              <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
              <TabsTrigger value="risks">Risk Factors</TabsTrigger>
              <TabsTrigger value="metrics">All Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reasoning" className="space-y-3">
              {reasoning.length > 0 ? (
                <div className="space-y-3">
                  {reasoning.map((reason: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-md">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reasoning provided.</p>
              )}
            </TabsContent>
            
            <TabsContent value="risks" className="space-y-3">
              {risks.length > 0 ? (
                <div className="space-y-3">
                  {risks.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-destructive/10 rounded-md border border-destructive/20">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                      <p className="text-sm leading-relaxed">{risk}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specific risks identified.</p>
              )}
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-semibold">
                      {typeof value === 'number' 
                        ? key.includes('Rate') || key.includes('Return') || key.includes('Ratio') 
                          ? `${(value * 100).toFixed(2)}%`
                          : key.includes('Price') || key.includes('Income') || key.includes('Expense')
                          ? `$${value.toLocaleString()}`
                          : value.toFixed(2)
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Export Options */}
      <ExportButtons
        dealData={results}
        propertyDetails={propertyDetails}
        t12Data={t12Data}
        rentRollData={rentRollData}
        buyBox={buyBox}
        assumptions={assumptions}
      />
    </div>
  );
}