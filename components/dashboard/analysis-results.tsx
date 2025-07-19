'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Calendar, PieChart } from 'lucide-react';

interface AnalysisResultsProps {
  results: any;
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const data = results.data || results;
  const metrics = data.metrics || {};
  const decision = data.decision || 'N/A';
  const confidence = data.confidence || 'N/A';
  const reasoning = data.reasoning || [];
  const risks = data.risks || [];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Analysis Results</span>
          <Badge variant={decision === 'BUY' ? 'default' : decision === 'PASS' ? 'destructive' : 'secondary'}>
            {decision}
          </Badge>
        </CardTitle>
        <CardDescription>
          Comprehensive deal analysis based on your inputs - Confidence: {confidence}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm text-muted-foreground">Cash on Cash Return</p>
            <p className="text-lg font-semibold">{(metrics.cocReturn * 100)?.toFixed(2) || 'N/A'}%</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <PieChart className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground">Cap Rate</p>
            <p className="text-lg font-semibold">{(metrics.capRate * 100)?.toFixed(2) || 'N/A'}%</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-muted-foreground">IRR</p>
            <p className="text-lg font-semibold">{(metrics.irr * 100)?.toFixed(2) || 'N/A'}%</p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-orange-600" />
            <p className="text-sm text-muted-foreground">Price Per Unit</p>
            <p className="text-lg font-semibold">${metrics.pricePerUnit?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">DSCR</p>
            <p className="font-semibold">{metrics.dscr?.toFixed(2) || 'N/A'}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Expense Ratio</p>
            <p className="font-semibold">{(metrics.expenseRatio * 100)?.toFixed(1) || 'N/A'}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">GRM</p>
            <p className="font-semibold">{metrics.grossRentMultiplier?.toFixed(2) || 'N/A'}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Occupancy</p>
            <p className="font-semibold">{(metrics.occupancy * 100)?.toFixed(1) || 'N/A'}%</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant={results.recommendation === 'BUY' ? 'default' : 'destructive'}>
              {results.recommendation}
            </Badge>
          </div>
          {results.reasonsForRecommendation && (
            <ul className="text-sm space-y-1">
              {results.reasonsForRecommendation.map((reason: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-muted-foreground">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reasoning */}
        {reasoning.length > 0 && (
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Analysis Reasoning</h4>
            <ul className="text-sm space-y-2">
              {reasoning.map((reason: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {risks.length > 0 && (
          <div className="border rounded-lg p-4 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <h4 className="font-medium mb-3 text-orange-800 dark:text-orange-200">Risk Factors</h4>
            <ul className="text-sm space-y-2">
              {risks.map((risk: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span className="text-orange-800 dark:text-orange-200">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Debug Data */}
        <div className="border rounded-lg p-4 bg-muted/20">
          <h4 className="font-medium mb-3">Debug Data</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}