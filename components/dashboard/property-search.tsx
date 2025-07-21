'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2, CheckCircle } from 'lucide-react';
import { PropertyDetails } from './dashboard';

interface PropertySearchProps {
  onPropertyDetails: (details: PropertyDetails) => void;
  propertyDetails: PropertyDetails | null;
}

export function PropertySearch({ onPropertyDetails, propertyDetails }: PropertySearchProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   const handleSearch = async () => {
    if (!address.trim()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      localStorage.setItem("address",address);
      const response = await fetch(`https://real-estate-underwriter-server.onrender.com/api/v1/property?address=${address}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch property details');
      }

      const response_data = await response.json();
      onPropertyDetails({ address, ...response_data.data });
    } catch (err) {
      setError('Failed to fetch property details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <span>Property Search</span>
        </CardTitle>
        <CardDescription>
          Enter a property address to get detailed information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Property Address</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Format: Street Number Street Name, City, State ZIP (e.g., 4529 Winona Court, Denver, CO 80212)
          </p>
          <div className="flex space-x-2">
            <Input
              id="address"
              placeholder="4529 Winona Court, Denver, CO 80212"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading || !address.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        {propertyDetails && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span>Property details loaded successfully</span>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md space-y-3">
              <h4 className="font-medium mb-3">Property Information</h4>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{propertyDetails.propertyType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Year Built:</span>
                  <p className="font-medium">{propertyDetails.propertyYear || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Units:</span>
                  <p className="font-medium">{propertyDetails.propertyUnit || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Crime Rating:</span>
                  <p className="font-medium">{propertyDetails.propertyCrimeRating}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Median Income:</span>
                  <p className="font-medium">${propertyDetails.propertyMedianIncome?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Income:</span>
                  <p className="font-medium">${propertyDetails.propertyAvgIncome?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-muted-foreground text-sm">Estimated Property Value:</span>
                <p className="font-medium">
                  ${propertyDetails.propertyMinValue?.toLocaleString()} - ${propertyDetails.propertyMaxValue?.toLocaleString()}
                  <span className="text-muted-foreground ml-2">(Est: ${propertyDetails.propertyEstimatedValue?.toLocaleString()})</span>
                </p>
              </div>
              
              {propertyDetails.propertySchoolsAndRating && (
                <div className="space-y-2">
                  <span className="text-muted-foreground text-sm">Schools:</span>
                  <div className="space-y-1">
                    {propertyDetails.propertySchoolsAndRating.slice(0, 3).map((school: any, index: number) => (
                      <div key={index} className="flex justify-between text-xs">
                        <span>{school.InstitutionName}</span>
                        <span className="font-medium">{school.schoolRating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}