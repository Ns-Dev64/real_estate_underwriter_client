'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Loader2, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { T12Data, RentRollData } from './dashboard';
import { config } from '@/lib/config';
interface FileUploadsProps {
  onT12Upload: (data: T12Data) => void;
  onRentRollUpload: (data: RentRollData) => void;
  t12Data: T12Data | null;
  rentRollData: RentRollData | null;
}

export function FileUploads({ onT12Upload, onRentRollUpload, t12Data, rentRollData }: FileUploadsProps) {
  const [t12Loading, setT12Loading] = useState(false);
  const [rentRollLoading, setRentRollLoading] = useState(false);
  const [errors, setErrors] = useState<{ t12?: string; rentRoll?: string }>({});
  const [t12File, setT12File] = useState<File | null>(null);
  const [rentRollFile, setRentRollFile] = useState<File | null>(null);

  // File integrity validation
  const validateFileIntegrity = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          // Check if file content is readable
          const content = reader.result;
          if (!content || (typeof content === 'string' && content.length === 0)) {
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (error) {
          resolve(false);
        }
      };
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file);
    });
  };

  // Additional file validation
  const validateFile = (file: File, type: 't12' | 'rentRoll'): string | null => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    // Check file type
    const allowedTypes = type === 't12' 
      ? ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
      : ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Please upload ${type === 't12' ? 'PDF or Excel' : 'CSV or Excel'} files only.`;
    }

    return null;
  };

  const handleT12Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setT12Loading(true);
    setErrors({ ...errors, t12: '' });

    try {
      // Validate file
      const validationError = validateFile(file, 't12');
      if (validationError) {
        setErrors({ ...errors, t12: validationError });
        return;
      }

      // Check file integrity
      const isValid = await validateFileIntegrity(file);
      if (!isValid) {
        setErrors({ ...errors, t12: 'File appears to be corrupted. Please try a different file.' });
        return;
      }

      setT12File(file);
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BACKEND_URL}/t12`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload T12 file');
      }

      const data = await response.json();
      onT12Upload(data.data);
    } catch (err) {
      setErrors({ ...errors, t12: 'Failed to upload T12 file. Please try again.' });
    } finally {
      setT12Loading(false);
    }
  };

  const handleRentRollUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRentRollLoading(true);
    setErrors({ ...errors, rentRoll: '' });

    try {
      // Validate file
      const validationError = validateFile(file, 'rentRoll');
      if (validationError) {
        setErrors({ ...errors, rentRoll: validationError });
        return;
      }

      // Check file integrity
      const isValid = await validateFileIntegrity(file);
      if (!isValid) {
        setErrors({ ...errors, rentRoll: 'File appears to be corrupted. Please try a different file.' });
        return;
      }

      setRentRollFile(file);
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${config.BACKEND_URL}/rent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload rent roll file');
      }

      const data = await response.json();
      onRentRollUpload(data.data);
    } catch (err) {
      setErrors({ ...errors, rentRoll: 'Failed to upload rent roll file. Please try again.' });
    } finally {
      setRentRollLoading(false);
    }
  };

  // Remove file functions
  const removeT12File = () => {
    setT12File(null);
    onT12Upload(null as any); // Clear the data
    setErrors({ ...errors, t12: '' });
    // Reset file input
    const fileInput = document.getElementById('t12-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const removeRentRollFile = () => {
    setRentRollFile(null);
    onRentRollUpload(null as any); // Clear the data
    setErrors({ ...errors, rentRoll: '' });
    // Reset file input
    const fileInput = document.getElementById('rentroll-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>File Uploads</span>
        </CardTitle>
        <CardDescription>
          Upload your T12 and Rent Roll files for analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* T12 Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">T12 Document</span>
            </div>
            {t12Data && (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="t12-input"
              type="file"
              accept=".pdf,.xlsx,.xls"
              onChange={handleT12Upload}
              disabled={t12Loading}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {t12Loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {(t12Data || t12File) && !t12Loading && (
              <Button
                size="sm"
                variant="outline"
                onClick={removeT12File}
                className="flex items-center space-x-1 text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
                <span>Remove</span>
              </Button>
            )}
          </div>
          
          {errors.t12 && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
              {errors.t12}
            </div>
          )}
          
          {t12Data && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">T12 file processed successfully</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Income:</span>
                  <p className="font-medium">${t12Data.totalIncome?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Expenses:</span>
                  <p className="font-medium">${t12Data.totalExpenses?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">NOI:</span>
                  <p className="font-medium">${t12Data.netOperatingIncome?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rent Roll Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Rent Roll</span>
            </div>
            {rentRollData && (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="rentroll-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleRentRollUpload}
              disabled={rentRollLoading}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            {rentRollLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {(rentRollData || rentRollFile) && !rentRollLoading && (
              <Button
                size="sm"
                variant="outline"
                onClick={removeRentRollFile}
                className="flex items-center space-x-1 text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
                <span>Remove</span>
              </Button>
            )}
          </div>
          
          {errors.rentRoll && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
              {errors.rentRoll}
            </div>
          )}
          
          {rentRollData && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">Rent roll file processed successfully</p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Total Units:</span>
                  <p className="font-medium">{rentRollData.totalUnits}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Occupied:</span>
                  <p className="font-medium">{rentRollData.occupiedUnits}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Occupancy Rate:</span>
                  <p className="font-medium">{rentRollData.occupancyRate}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Rent:</span>
                  <p className="font-medium">${rentRollData.totalRent?.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Average Rent:</span>
                <span className="font-medium ml-1">${rentRollData.averageRent?.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}