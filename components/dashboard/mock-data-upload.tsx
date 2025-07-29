"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle2, AlertCircle, Download, Zap } from "lucide-react"

interface MockDataUploadProps {
  onDataUploaded: (data: {
    propertyDetails: any
    t12Data: any
    rentRollData: any
    buyBox: any
    assumptions: any
  }) => void
}

export function MockDataUpload({ onDataUploaded }: MockDataUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".json")) {
      setError("Please upload a JSON file")
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate the structure
      const requiredFields = ["propertyDetails", "t12Data", "rentRollData", "buyBox", "assumptions"]
      const missingFields = requiredFields.filter((field) => !data[field])

      if (missingFields.length > 0) {
        throw new Error(
          `Missing required fields: ${missingFields.join(", ")}. Please ensure your JSON contains all required sections.`,
        )
      }

      // Validate buyBox structure
      const requiredBuyBoxFields = [
        "minYearBuilt",
        "minCoCReturn",
        "minCapRate",
        "maxPurchasePrice",
        "minUnits",
        "preferredMarkets",
      ]
      const missingBuyBoxFields = requiredBuyBoxFields.filter((field) => data.buyBox[field] === undefined)

      if (missingBuyBoxFields.length > 0) {
        throw new Error(`Missing buyBox fields: ${missingBuyBoxFields.join(", ")}`)
      }

      // Validate assumptions structure
      const requiredAssumptionFields = [
        "askingPrice",
        "downPayment",
        "interestRate",
        "loanTerm",
        "exitCapRate",
        "exitYear",
      ]
      const missingAssumptionFields = requiredAssumptionFields.filter((field) => data.assumptions[field] === undefined)

      if (missingAssumptionFields.length > 0) {
        throw new Error(`Missing assumptions fields: ${missingAssumptionFields.join(", ")}`)
      }

      onDataUploaded(data)
      setSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse JSON file")
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const downloadSampleFormat = () => {
    const sampleData = {
      propertyDetails: {
        address: "123 Sample Street, City, State 12345",
        propertyType: "Multi-Family",
        propertyYear: 1985,
        propertyUnit: 24,
        propertyCrimeRating: "B+",
        propertyMedianIncome: 65000,
        propertyAvgIncome: 58000,
        propertyEstimatedValue: 2400000,
        propertyMinValue: 2200000,
        propertyMaxValue: 2600000,
        propertySchoolsAndRating: [
          { InstitutionName: "Sample Elementary", schoolRating: "8/10" },
          { InstitutionName: "Sample Middle School", schoolRating: "7/10" },
          { InstitutionName: "Sample High School", schoolRating: "9/10" },
        ],
      },
      t12Data: {
        totalIncome: 600000,
        totalExpenses: 240000,
        netOperatingIncome: 360000,
        grossRentalIncome: 576000,
        otherIncome: 24000,
        operatingExpenses: 240000,
        vacancy: 0.04,
      },
      rentRollData: {
        totalUnits: 24,
        occupiedUnits: 23,
        occupancyRate: 95.8,
        totalRent: 48000,
        averageRent: 2000,
        units: [
          { unit: "101", rent: 1900, occupied: true, tenant: "John Doe" },
          { unit: "102", rent: 2100, occupied: true, tenant: "Jane Smith" },
          { unit: "103", rent: 2000, occupied: false, tenant: null },
          { unit: "104", rent: 2050, occupied: true, tenant: "Bob Johnson" },
        ],
      },
      buyBox: {
        minYearBuilt: 1980,
        minCoCReturn: 8,
        minCapRate: 6,
        maxPurchasePrice: 3000000,
        minUnits: 20,
        preferredMarkets: ["Austin", "Dallas", "Houston"],
      },
      assumptions: {
        askingPrice: 2400000,
        downPayment: 25,
        interestRate: 7,
        loanTerm: 30,
        exitCapRate: 6,
        exitYear: 5,
      },
    }

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "complete-deal-analysis.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className=" outline outline-1 border-real-estate-primary/30 bg-real-estate-primary/5">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <Upload className="h-5 w-5 text-real-estate-primary" />
          <span>Complete Deal Analysis Upload</span>
        </CardTitle>
        <CardDescription>Upload a complete JSON file with all deal data - no manual entry required!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className=" outline outline-1 border-real-estate-success/30 bg-real-estate-success/10">
            <CheckCircle2 className="h-4 w-4 text-real-estate-success" />
            <AlertDescription className="text-real-estate-success">
              <strong>Complete deal data uploaded successfully!</strong> All fields have been populated automatically.
              You can now analyze this deal immediately.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-center w-full">
            <Label
              htmlFor="mock-data-upload"
              className="flex flex-col outline-1 outline items-center justify-center w-full h-32  border-real-estate-primary/30 rounded-lg cursor-pointer bg-real-estate-primary/5 hover:bg-real-estate-primary/10 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-8 h-8 mb-4 text-real-estate-primary" />
                <p className="mb-2 text-sm text-real-estate-primary font-medium">
                  <span className="font-semibold">Click to upload</span> your complete deal JSON
                </p>
                <p className="text-xs text-real-estate-primary/70">
                  Includes property, financials, buy box & assumptions
                </p>
              </div>
              <Input
                id="mock-data-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </Label>
          </div>

          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSampleFormat}
              className="border-real-estate-primary/30 text-real-estate-primary hover:bg-real-estate-primary/10 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Complete Template
            </Button>
          </div>
        </div>

        {/* Enhanced Benefits Section */}
        <div className=" outline outline-1 bg-gradient-to-r from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 p-4 rounded-lg border border-real-estate-success/20">
          <div className="flex items-start space-x-3">
            <Zap className="h-5 w-5 text-real-estate-success mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-sm font-semibold text-real-estate-success mb-2">One-Click Deal Analysis</h4>
              <ul className="text-xs text-real-estate-success/80 space-y-1">
                <li>✅ Property details automatically populated</li>
                <li>✅ T12 and rent roll data loaded instantly</li>
                <li>✅ Buy box criteria pre-configured</li>
                <li>✅ Investment assumptions ready to go</li>
                <li>✅ Ready for immediate analysis - no manual entry!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Complete JSON Structure Required:</strong>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-2">
            <div>
              <p className="font-medium">Data Sections:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>propertyDetails</li>
                <li>t12Data</li>
                <li>rentRollData</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Analysis Settings:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>buyBox (criteria)</li>
                <li>assumptions (financing)</li>
              </ul>
            </div>
          </div>
          <p className="text-real-estate-primary/70 font-medium">
            💡 Download the template above to see the exact format required
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
