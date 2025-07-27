"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Header } from "./header"
import { PropertySearch } from "./property-search"
import { FileUploads } from "./file-uploads"
import { InvestmentCriteria } from "./investment-criteria"
import { AnalysisResults } from "./analysis-results"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  Eye,
  EyeOff,
  Trash2,
  Loader,
  CheckCircle2,
  Circle,
  MapPin,
  FileText,
  Settings,
  BarChart3,
  AlertCircle,
  Clock,
  RotateCcw,
  RefreshCw,
} from "lucide-react"

export interface PropertyDetails {
  address: string
  [key: string]: any
}

export interface T12Data {
  [key: string]: any
}

export interface RentRollData {
  [key: string]: any
}

export interface BuyBox {
  minYearBuilt: number
  minCoCReturn: number
  minCapRate: number
  maxPurchasePrice: number
  minUnits: number
  preferredMarkets: string[]
}

export interface Assumptions {
  askingPrice: number
  downPayment: number
  interestRate: number
  loanTerm: number
  exitCapRate: number
  exitYear: number
}

interface SavedDeal {
  _id: string
  decision: string
  confidence: string
  reasoning: string[]
  metrics: {
    capRate: number
    cocReturn: number
    irr: number
    dscr: number
    pricePerUnit: number
    expenseRatio: number
  }
  risks: string[]
  userEmail: string
  [key: string]: any
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  completed: boolean
  required: boolean
}

// Local storage keys
const STORAGE_KEYS = {
  PROPERTY_DETAILS: "dashboard_property_details",
  T12_DATA: "dashboard_t12_data",
  RENT_ROLL_DATA: "dashboard_rent_roll_data",
  BUY_BOX: "dashboard_buy_box",
  ASSUMPTIONS: "dashboard_assumptions",
  ANALYSIS_RESULTS: "dashboard_analysis_results",
  IS_FROM_SAVED_DEAL: "dashboard_is_from_saved_deal",
}

export function Dashboard() {
  // Initialize state with data from localStorage
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTY_DETAILS)
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const [t12Data, setT12Data] = useState<T12Data | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.T12_DATA)
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const [rentRollData, setRentRollData] = useState<RentRollData | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.RENT_ROLL_DATA)
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const [buyBox, setBuyBox] = useState<BuyBox>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.BUY_BOX)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      minYearBuilt: 1980,
      minCoCReturn: 8,
      minCapRate: 6,
      maxPurchasePrice: 1000000,
      minUnits: 10,
      preferredMarkets: [],
    }
  })

  const [assumptions, setAssumptions] = useState<Assumptions>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSUMPTIONS)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      askingPrice: 0,
      downPayment: 25,
      interestRate: 7,
      loanTerm: 30,
      exitCapRate: 6,
      exitYear: 5,
    }
  })

  const [analysisResults, setAnalysisResults] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULTS)
      return saved ? JSON.parse(saved) : null
    }
    return null
  })

  const [isFromSavedDeal, setIsFromSavedDeal] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.IS_FROM_SAVED_DEAL)
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([])
  const [isLoadingDeals, setIsLoadingDeals] = useState(true)
  const [dealsError, setDealsError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [viewedDeals, setViewedDeals] = useState<Set<string>>(new Set())
  const [isResetting, setIsResetting] = useState(false)

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (propertyDetails) {
        localStorage.setItem(STORAGE_KEYS.PROPERTY_DETAILS, JSON.stringify(propertyDetails))
      } else {
        localStorage.removeItem(STORAGE_KEYS.PROPERTY_DETAILS)
      }
    }
  }, [propertyDetails])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (t12Data) {
        localStorage.setItem(STORAGE_KEYS.T12_DATA, JSON.stringify(t12Data))
      } else {
        localStorage.removeItem(STORAGE_KEYS.T12_DATA)
      }
    }
  }, [t12Data])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (rentRollData) {
        localStorage.setItem(STORAGE_KEYS.RENT_ROLL_DATA, JSON.stringify(rentRollData))
      } else {
        localStorage.removeItem(STORAGE_KEYS.RENT_ROLL_DATA)
      }
    }
  }, [rentRollData])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.BUY_BOX, JSON.stringify(buyBox))
    }
  }, [buyBox])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ASSUMPTIONS, JSON.stringify(assumptions))
    }
  }, [assumptions])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (analysisResults) {
        localStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULTS, JSON.stringify(analysisResults))
      } else {
        localStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULTS)
      }
    }
  }, [analysisResults])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.IS_FROM_SAVED_DEAL, JSON.stringify(isFromSavedDeal))
    }
  }, [isFromSavedDeal])

  // Calculate analysis steps and progress
  const analysisSteps: AnalysisStep[] = useMemo(
    () => [
      {
        id: "property",
        title: "Property Details",
        description: "Search and select property",
        icon: MapPin,
        completed: !!propertyDetails,
        required: true,
      },
      {
        id: "t12",
        title: "T12 Statement",
        description: "Upload financial data",
        icon: FileText,
        completed: !!t12Data,
        required: true,
      },
      {
        id: "rentroll",
        title: "Rent Roll",
        description: "Upload rent roll data",
        icon: FileText,
        completed: !!rentRollData,
        required: true,
      },
      {
        id: "criteria",
        title: "Investment Criteria",
        description: "Set buy box and assumptions",
        icon: Settings,
        completed: assumptions.askingPrice > 0,
        required: true,
      },
    ],
    [propertyDetails, t12Data, rentRollData, assumptions.askingPrice],
  )

  const completedSteps = analysisSteps.filter((step) => step.completed).length
  const totalSteps = analysisSteps.length
  const progressPercentage = (completedSteps / totalSteps) * 100
  const canAnalyze = analysisSteps.every((step) => step.completed)

  // Reset all data function
  const handleResetAll = async () => {
    if (!confirm("Are you sure you want to reset all data? This will clear all your inputs and analysis results.")) {
      return
    }

    setIsResetting(true)

    try {
      // Clear all state
      setPropertyDetails(null)
      setT12Data(null)
      setRentRollData(null)
      setBuyBox({
        minYearBuilt: 1980,
        minCoCReturn: 8,
        minCapRate: 6,
        maxPurchasePrice: 1000000,
        minUnits: 10,
        preferredMarkets: [],
      })
      setAssumptions({
        askingPrice: 0,
        downPayment: 25,
        interestRate: 7,
        loanTerm: 30,
        exitCapRate: 6,
        exitYear: 5,
      })
      setAnalysisResults(null)
      setIsFromSavedDeal(false)
      setViewedDeals(new Set())

      // Clear localStorage
      if (typeof window !== "undefined") {
        Object.values(STORAGE_KEYS).forEach((key) => {
          localStorage.removeItem(key)
        })
        // Also clear the address key used by mock data
        localStorage.removeItem("address")
      }

      // Small delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsResetting(false)
    }
  }

  // Fetch saved deals on component mount
  useEffect(() => {
    const fetchSavedDeals = async () => {
      try {
        setIsLoadingDeals(true)
        setDealsError(null)
        const token = localStorage.getItem("token")
        const response = await fetch("https://real-estate-underwriter-server.onrender.com/api/v1/deals", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const deals = await response.json()
          setSavedDeals(Array.isArray(deals) ? deals : [])
        } else {
          setDealsError("Failed to load saved deals")
        }
      } catch (error) {
        console.error("Error fetching saved deals:", error)
        setDealsError("Error loading saved deals")
      } finally {
        setIsLoadingDeals(false)
      }
    }

    fetchSavedDeals()
  }, [])

  const refreshSavedDeals = async () => {
    try {
      setIsLoadingDeals(true)
      setDealsError(null)
      const token = localStorage.getItem("token")
      const response = await fetch("https://real-estate-underwriter-server.onrender.com/api/v1/deals", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const deals = await response.json()
        setSavedDeals(Array.isArray(deals) ? deals : [])
      } else {
        setDealsError("Failed to load saved deals")
      }
    } catch (error) {
      console.error("Error fetching saved deals:", error)
      setDealsError("Error loading saved deals")
    } finally {
      setIsLoadingDeals(false)
    }
  }

  const handleViewDeal = (deal: SavedDeal) => {
    const isCurrentlyViewed = viewedDeals.has(deal._id)

    if (analysisResults && analysisResults._id === deal._id) {
      // If this deal is currently being viewed, close it
      setAnalysisResults(null)
      setIsFromSavedDeal(false)
      setViewedDeals((prev) => {
        const newSet = new Set(prev)
        newSet.delete(deal._id)
        return newSet
      })
    } else {
      // Load the deal data into the current analysis
      setAnalysisResults(deal)
      setIsFromSavedDeal(true)
      setViewedDeals((prev) => new Set(prev).add(deal._id))

      // Optionally scroll to the analysis results
      setTimeout(() => {
        const resultsElement = document.getElementById("analysis-results")
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://real-estate-underwriter-server.onrender.com/api/v1/deals/${dealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSavedDeals((prev) => prev.filter((deal) => deal._id !== dealId))
      } else {
        alert("Failed to delete deal")
      }
    } catch (error) {
      console.error("Error deleting deal:", error)
      alert("Error deleting deal")
    }
  }

  const handleLoadDemoData = () => {
    // Load sample property details
    setPropertyDetails({
      address: "123 Maple Street Apartments, Austin, TX 78701",
      propertyType: "Multifamily",
      units: 24,
      yearBuilt: 1985,
      squareFootage: 18500,
    })

    // Load sample T12 data
    setT12Data({
      totalIncome: 312000,
      totalExpenses: 187200,
      netOperatingIncome: 124800,
      vacancy: 8.5,
    })

    // Load sample rent roll data
    setRentRollData({
      totalUnits: 24,
      occupiedUnits: 22,
      averageRent: 1300,
      totalPotentialRent: 374400,
    })

    // Update assumptions with realistic values
    setAssumptions((prev) => ({
      ...prev,
      askingPrice: 1850000,
    }))

    // Show success message
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/3 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-60 h-60 bg-indigo-500/2 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <Header />
      </div>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-100">
          <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-pulse">
            Real Estate Deal Analyzer
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Analyze your real estate investments with precision and confidence
          </p>
        </div>

        {/* Demo CTA Section */}
        <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-200 hover:shadow-lg hover:scale-[1.01] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">🚀 Experience Our Platform</h3>
                <p className="text-blue-700 dark:text-blue-200 text-sm">
                  Get a taste of our powerful analysis capabilities with sample data from a real multifamily property
                  deal.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleLoadDemoData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 hover:scale-105 transition-all duration-300"
                >
                  Try Demo Data
                </Button>
                <Button
                  onClick={handleResetAll}
                  disabled={isResetting}
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 bg-transparent hover:scale-105 transition-all duration-300"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset All
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="border-2 border-primary/10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-300 hover:shadow-xl hover:scale-[1.01] transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary animate-pulse" />
                <span>Analysis Progress</span>
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Badge variant={canAnalyze ? "default" : "secondary"} className="px-3 py-1 animate-pulse">
                  {completedSteps}/{totalSteps} Complete
                </Badge>
                {(propertyDetails || t12Data || rentRollData || assumptions.askingPrice > 0) && (
                  <Button
                    onClick={handleResetAll}
                    disabled={isResetting}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:scale-110 transition-all duration-300"
                  >
                    {isResetting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3 transition-all duration-1000 ease-out" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border bg-card/50 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out hover:shadow-md hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer group"
                  style={{ animationDelay: `${index * 50 + 400}ms` }}
                >
                  <div
                    className={`flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${step.completed ? "text-green-500" : "text-muted-foreground"}`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5 animate-pulse" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Analysis Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-500 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Property Search</span>
                  {propertyDetails && (
                    <Badge variant="outline" className="ml-auto animate-pulse">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PropertySearch onPropertyDetails={setPropertyDetails} propertyDetails={propertyDetails} />
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-600 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Financial Documents</span>
                  <div className="ml-auto flex space-x-2">
                    {t12Data && (
                      <Badge variant="outline" className="text-xs animate-pulse">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        T12
                      </Badge>
                    )}
                    {rentRollData && (
                      <Badge variant="outline" className="text-xs animate-pulse">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Rent Roll
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploads
                  onT12Upload={setT12Data}
                  onRentRollUpload={setRentRollData}
                  t12Data={t12Data}
                  rentRollData={rentRollData}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-right-4 duration-700 ease-out delay-700 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Investment Criteria</span>
                  {assumptions.askingPrice > 0 && (
                    <Badge variant="outline" className="ml-auto animate-pulse">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Set
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                  canAnalyze={canAnalyze}
                  onAnalysisStart={() => {
                    setIsFromSavedDeal(false)
                    setIsAnalyzing(true)
                  }}
                  onDealSaved={refreshSavedDeals}
                />

                {!canAnalyze && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out hover:shadow-md transition-all">
                    <div className="flex items-start space-x-3">
                      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-1 animate-bounce">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                          Almost Ready to Analyze!
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                          Complete:{" "}
                          {analysisSteps
                            .filter((s) => !s.completed)
                            .map((s) => s.title)
                            .join(", ")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={handleLoadDemoData}
                            variant="outline"
                            size="sm"
                            className="text-amber-700 border-amber-300 hover:bg-amber-100 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-900/20 bg-transparent hover:scale-105 transition-all duration-300"
                          >
                            🎯 Use Sample Data
                          </Button>
                          <span className="text-xs text-amber-600 dark:text-amber-400 self-center">
                            Perfect for exploring our platform's capabilities
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Saved Deals Section */}
        <Card className="shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-800 hover:shadow-xl hover:scale-[1.01] transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Saved Deals</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="px-3 py-1">
                  {savedDeals.length} {savedDeals.length === 1 ? "Deal" : "Deals"}
                </Badge>
                {isLoadingDeals && <Loader className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDeals ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading your saved deals...</p>
                </div>
              </div>
            ) : dealsError ? (
              <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4 animate-bounce" />
                <p className="text-destructive font-medium">{dealsError}</p>
                <p className="text-muted-foreground text-sm mt-2">Please try refreshing the page</p>
              </div>
            ) : savedDeals.length === 0 ? (
              <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <BarChart3 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Analyze Your First Deal?</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Complete an analysis above to save and track your real estate investment decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button
                    onClick={handleLoadDemoData}
                    variant="outline"
                    className="flex items-center space-x-2 bg-transparent hover:scale-105 transition-all duration-300"
                  >
                    <span>🎯</span>
                    <span>Try with Sample Data</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">or upload your own property files above</span>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedDeals.map((savedDeal, index) => {
                  const metrics = savedDeal.metrics || {}
                  const decision = savedDeal.decision || "N/A"

                  return (
                    <Card
                      key={savedDeal._id}
                      className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out hover:scale-105 hover:-translate-y-2 group cursor-pointer"
                      style={{ animationDelay: `${index * 50 + 900}ms` }}
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <Badge
                            variant={
                              decision === "BUY"
                                ? "default"
                                : decision === "PASS" || decision === "FAIL"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="px-3 py-1 font-medium group-hover:scale-110 transition-transform duration-300"
                          >
                            {decision}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              {savedDeal.confidence}
                            </Badge>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDeal(savedDeal)}
                                className={`h-8 w-8 p-0 transition-all duration-300 hover:scale-125 ${
                                  viewedDeals.has(savedDeal._id)
                                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                                    : "hover:bg-primary/10"
                                }`}
                              >
                                {viewedDeals.has(savedDeal._id) ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteDeal(savedDeal._id)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 hover:scale-125 transition-all duration-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-xs">CoC Return</span>
                              <p className="font-semibold text-green-600 group-hover:scale-110 transition-transform duration-300">
                                {(metrics.cocReturn * 100)?.toFixed(1) || "N/A"}%
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-xs">Cap Rate</span>
                              <p className="font-semibold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                {(metrics.capRate * 100)?.toFixed(1) || "N/A"}%
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-xs">IRR</span>
                              <p className="font-semibold text-purple-600 group-hover:scale-110 transition-transform duration-300">
                                {(metrics.irr * 100)?.toFixed(1) || "N/A"}%
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-xs">Price/Unit</span>
                              <p className="font-semibold group-hover:scale-110 transition-transform duration-300">
                                ${metrics.pricePerUnit?.toLocaleString() || "N/A"}
                              </p>
                            </div>
                          </div>

                          {savedDeal.reasoning && savedDeal.reasoning.length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-1">
                                <span className="text-muted-foreground text-xs">Key Insight</span>
                                <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                                  {savedDeal.reasoning[0]}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <div
            id="analysis-results"
            className="scroll-mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-900"
          >
            <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary animate-pulse" />
                  <span>Analysis Results</span>
                  {isFromSavedDeal && (
                    <Badge variant="outline" className="ml-auto animate-pulse">
                      <Clock className="h-3 w-3 mr-1" />
                      Saved Deal
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnalysisResults
                  results={analysisResults}
                  propertyDetails={propertyDetails}
                  t12Data={t12Data}
                  rentRollData={rentRollData}
                  buyBox={buyBox}
                  assumptions={assumptions}
                  isFromSavedDeal={isFromSavedDeal}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
