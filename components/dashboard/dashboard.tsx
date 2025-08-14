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
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react"
import { MockDataUpload } from "./mock-data-upload"
import { DealStatistics } from "./deal-statistics"
import { useAuth } from "@/hooks/use-auth"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

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
  userData: {
    propertyDetails: PropertyDetails | null
    t12Data: T12Data | null
    rentRollData: RentRollData | null
    buyBox: BuyBox
    assumptions: Assumptions
  }
  dealData: {
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
  }
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

// Local storage keys - only for active session data
const STORAGE_KEYS = {
  PROPERTY_DETAILS: "dashboard_property_details",
  T12_DATA: "dashboard_t12_data",
  RENT_ROLL_DATA: "dashboard_rent_roll_data",
  BUY_BOX: "dashboard_buy_box",
  ASSUMPTIONS: "dashboard_assumptions",
  ANALYSIS_RESULTS: "dashboard_analysis_results",
  IS_FROM_SAVED_DEAL: "dashboard_is_from_saved_deal",
  CURRENT_STEP: "dashboard_current_step",
}

export function Dashboard() {
  const { makeAuthenticatedRequest } = useAuth()
  
  // Initialize state with data from localStorage (only for active sessions)
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

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP)
      return saved ? parseInt(saved) : 1
    }
    return 1
  })

  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([])
  const [isLoadingDeals, setIsLoadingDeals] = useState(true)
  const [dealsError, setDealsError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [viewedDeals, setViewedDeals] = useState<Set<string>>(new Set())
  const [isResetting, setIsResetting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const envType = process.env.NEXT_PUBLIC_ENV_TYPE
  const isDev = envType === "dev" ? true : false

  // Save to localStorage only when not viewing a saved deal (for active session persistence)
  useEffect(() => {
    if (typeof window !== "undefined" && !isFromSavedDeal) {
      if (propertyDetails) {
        localStorage.setItem(STORAGE_KEYS.PROPERTY_DETAILS, JSON.stringify(propertyDetails))
      } else {
        localStorage.removeItem(STORAGE_KEYS.PROPERTY_DETAILS)
      }
    }
  }, [propertyDetails, isFromSavedDeal])

  useEffect(() => {
    if (typeof window !== "undefined" && !isFromSavedDeal) {
      if (t12Data) {
        localStorage.setItem(STORAGE_KEYS.T12_DATA, JSON.stringify(t12Data))
      } else {
        localStorage.removeItem(STORAGE_KEYS.T12_DATA)
      }
    }
  }, [t12Data, isFromSavedDeal])

  useEffect(() => {
    if (typeof window !== "undefined" && !isFromSavedDeal) {
      if (rentRollData) {
        localStorage.setItem(STORAGE_KEYS.RENT_ROLL_DATA, JSON.stringify(rentRollData))
      } else {
        localStorage.removeItem(STORAGE_KEYS.RENT_ROLL_DATA)
      }
    }
  }, [rentRollData, isFromSavedDeal])

  useEffect(() => {
    if (typeof window !== "undefined" && !isFromSavedDeal) {
      localStorage.setItem(STORAGE_KEYS.BUY_BOX, JSON.stringify(buyBox))
    }
  }, [buyBox, isFromSavedDeal])

  useEffect(() => {
    if (typeof window !== "undefined" && !isFromSavedDeal) {
      localStorage.setItem(STORAGE_KEYS.ASSUMPTIONS, JSON.stringify(assumptions))
    }
  }, [assumptions, isFromSavedDeal])

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString())
    }
  }, [currentStep])

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
        id: "documents",
        title: "Financial Documents",
        description: "Upload T12 and rent roll",
        icon: FileText,
        completed: !!t12Data && !!rentRollData,
        required: true,
      },
      {
        id: "criteria",
        title: "Investment Analysis",
        description: "Set criteria and analyze",
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
      setCurrentStep(1)

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
        
        const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL_DEV || process.env.NEXT_PUBLIC_BACKEND_URL_DEP}/deals`)

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
  }, [makeAuthenticatedRequest])

  const refreshSavedDeals = async () => {
    try {
      setIsLoadingDeals(true)
      setDealsError(null)
      
      const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL_DEV || process.env.NEXT_PUBLIC_BACKEND_URL_DEP}/deals`)

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
    if (analysisResults && analysisResults._id === deal._id) {
      // If this deal is currently being viewed, close it and clear form data
      setAnalysisResults(null)
      setIsFromSavedDeal(false)
      setViewedDeals((prev) => {
        const newSet = new Set(prev)
        newSet.delete(deal._id)
        return newSet
      })

      // Clear form data when closing saved deal view
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
      setCurrentStep(1)
    } else {
      // Load the deal data into the current analysis from the saved deal
      setAnalysisResults(deal)
      setIsFromSavedDeal(true)
      setCurrentStep(4) // Go to results step

      // Populate form fields with saved deal data (no localStorage needed)
      if (deal.userData) {
        setPropertyDetails(deal.userData.propertyDetails || null)
        setT12Data(deal.userData.t12Data || null)
        setRentRollData(deal.userData.rentRollData || null)
        setBuyBox(
          deal.userData.buyBox || {
            minYearBuilt: 1980,
            minCoCReturn: 8,
            minCapRate: 6,
            maxPurchasePrice: 1000000,
            minUnits: 10,
            preferredMarkets: [],
          },
        )
        setAssumptions(
          deal.userData.assumptions || {
            askingPrice: 0,
            downPayment: 25,
            interestRate: 7,
            loanTerm: 30,
            exitCapRate: 6,
            exitYear: 5,
          },
        )
      }

      setViewedDeals((prev) => new Set(prev).add(deal._id))
      setSidebarOpen(false) // Close sidebar after selecting deal
    }
  }

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) {
      return
    }

    try {
      const response = await makeAuthenticatedRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL_DEV || process.env.NEXT_PUBLIC_BACKEND_URL_DEP}/deals/${dealId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSavedDeals((prev) => prev.filter((deal) => deal._id !== dealId))

        // If the deleted deal was currently being viewed, clear the view
        if (analysisResults && analysisResults._id === dealId) {
          setAnalysisResults(null)
          setIsFromSavedDeal(false)
          setViewedDeals((prev) => {
            const newSet = new Set(prev)
            newSet.delete(dealId)
            return newSet
          })
        }
      } else {
        alert("Failed to delete deal")
      }
    } catch (error) {
      console.error("Error deleting deal:", error)
      alert("Error deleting deal")
    }
  }

  const handleLoadDemoData = () => {
    // Only load demo data if not viewing a saved deal
    if (isFromSavedDeal) {
      return
    }

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

    // Go to final step
    setCurrentStep(3)
  }

  const handleMockDataUpload = (data: {
    propertyDetails: any
    t12Data: any
    rentRollData: any
    buyBox: any
    assumptions: any
  }) => {
    // Only upload mock data if not viewing a saved deal
    if (isFromSavedDeal) {
      return
    }

    setPropertyDetails(data.propertyDetails)
    setT12Data(data.t12Data)
    setRentRollData(data.rentRollData)
    setBuyBox(data.buyBox)
    setAssumptions(data.assumptions)
    setCurrentStep(3) // Go to final step
  }

  const handleStartNewAnalysis = () => {
    // Clear saved deal view and start fresh
    setAnalysisResults(null)
    setIsFromSavedDeal(false)
    setViewedDeals(new Set())
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
    setCurrentStep(1)
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 1:
        return true
      case 2:
        return !!propertyDetails
      case 3:
        return !!propertyDetails && !!t12Data && !!rentRollData
      default:
        return false
    }
  }

  // Sidebar content
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Saved Deals Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-real-estate-primary" />
            Saved Deals
          </h3>
          <Badge variant="secondary" className="px-2 py-1">
            {savedDeals.length}
          </Badge>
        </div>

        {isLoadingDeals ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-real-estate-primary" />
          </div>
        ) : dealsError ? (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-destructive">{dealsError}</p>
          </div>
        ) : savedDeals.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No saved deals yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedDeals.map((deal) => {
              const metrics = deal.dealData?.metrics || {}
              const decision = deal.dealData?.decision || "N/A"
              const isCurrentlyViewed = viewedDeals.has(deal._id)

              return (
                <Card
                  key={deal._id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isCurrentlyViewed ? "border-real-estate-primary/50 bg-real-estate-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge
                        variant={decision === "PASS" ? "default" : decision === "FAIL" ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {decision}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDeal(deal)}
                          className="h-6 w-6 p-0"
                        >
                          {isCurrentlyViewed ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteDeal(deal._id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">CoC:</span>
                        <p className="font-medium">{((metrics.cocReturn || 0) * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cap:</span>
                        <p className="font-medium">{((metrics.capRate || 0) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Deal Statistics */}
      {savedDeals.length > 0 && (
        <div>
          <DealStatistics savedDeals={savedDeals} />
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-teal-950/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-real-estate-primary/3 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-real-estate-secondary/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/3 left-1/3 w-60 h-60 bg-real-estate-accent/2 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <Header />
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white/90 backdrop-blur">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Dashboard Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hero Section */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-100">
              <h1 className="text-4xl font-bold text-foreground mb-3 text-real-estate-gradient animate-pulse">
                Real Estate Deal Analyzer
              </h1>
              <p className="text-lg text-muted-foreground mb-6">Smart insights for property investments.</p>
            </div>

            {/* Demo CTA Section */}
            {!isFromSavedDeal && currentStep === 1 && (
              <Card className="border-2 border-real-estate-info/20 bg-gradient-to-r from-cyan-50/50 to-blue-50/30 dark:from-cyan-950/20 dark:to-blue-950/20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-200 hover:shadow-lg hover:scale-[1.01] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-real-estate-info">
                        🚀 Jumpstart Your Investment Journey
                      </h3>
                      <p className="text-real-estate-info/80 text-sm">
                        Explore real-world data and see how our platform helps you analyze multifamily deals with
                        confidence.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleLoadDemoData}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        Try Demo Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Saved Deal View Banner */}
            {isFromSavedDeal && (
              <Card className="border-2 border-real-estate-primary/30 bg-gradient-to-r from-real-estate-primary/10 to-real-estate-secondary/10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-real-estate-primary/20 rounded-full p-2">
                        <Clock className="h-5 w-5 text-real-estate-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-real-estate-primary">Viewing Saved Deal</h3>
                        <p className="text-real-estate-primary/80 text-sm">
                          You're currently viewing a previously analyzed deal.
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleStartNewAnalysis}
                      className="bg-white border border-black text-black font-medium px-6 py-2 rounded-lg transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 hover:shadow-lg"
                    >
                      Start New Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mock Data Upload Section - only show when not viewing saved deal */}
            {!isFromSavedDeal && isDev && currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-250">
                <MockDataUpload onDataUploaded={handleMockDataUpload} />
              </div>
            )}

            {/* Progress Overview */}
            <Card className="real-estate-card-premium shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-300 hover:shadow-xl hover:scale-[1.01] transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-real-estate-primary animate-pulse" />
                    <span>Analysis Progress</span>
                    {isFromSavedDeal && (
                      <Badge variant="outline" className="border-real-estate-primary/30 text-real-estate-primary">
                        <Clock className="h-3 w-3 mr-1" />
                        Saved Deal
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={canAnalyze ? "default" : "secondary"}
                      className={`px-3 py-1 ${canAnalyze ? "bg-real-estate-primary text-white" : ""}`}
                    >
                      {completedSteps}/{totalSteps} Complete
                    </Badge>
                    {!isFromSavedDeal &&
                      (propertyDetails || t12Data || rentRollData || assumptions.askingPrice > 0) && (
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
                              Clear Progress
                            </>
                          )}
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
                  <Progress
                    value={progressPercentage}
                    className="h-3 transition-all duration-1000 ease-out [&>div]:bg-real-estate-gradient"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysisSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-300 cursor-pointer group ${
                        currentStep === index + 1
                          ? "bg-real-estate-primary/10 border-real-estate-primary/30"
                          : step.completed
                          ? "bg-real-estate-success/10 border-real-estate-success/30"
                          : "bg-card/50 hover:shadow-md hover:scale-105 hover:-translate-y-1"
                      }`}
                      onClick={() => {
                        if (!isFromSavedDeal && canProceedToStep(index + 1)) {
                          setCurrentStep(index + 1)
                        }
                      }}
                      style={{ animationDelay: `${index * 50 + 400}ms` }}
                    >
                      <div
                        className={`flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                          currentStep === index + 1
                            ? "text-real-estate-primary"
                            : step.completed
                            ? "text-real-estate-success"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium transition-colors duration-300 ${
                            currentStep === index + 1
                              ? "text-real-estate-primary"
                              : step.completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
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

            {/* Step Content */}
            <div className="space-y-6">
              {/* Step 1: Property Search */}
              {currentStep === 1 && (
                <Card className="real-estate-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-500 group">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-real-estate-primary group-hover:scale-110 transition-transform duration-300" />
                      <span>Step 1: Property Search</span>
                      {propertyDetails && (
                        <Badge
                          variant="outline"
                          className="ml-auto border-real-estate-success/30 text-real-estate-success"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PropertySearch
                      onPropertyDetails={setPropertyDetails}
                      propertyDetails={propertyDetails}
                      disabled={isFromSavedDeal}
                    />
                    {propertyDetails && !isFromSavedDeal && (
                      <div className="mt-6 flex justify-end">
                        <Button onClick={handleNextStep} className="flex items-center space-x-2">
                          <span>Next: Upload Documents</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: File Uploads */}
              {currentStep === 2 && (
                <Card className="real-estate-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-600 group">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-real-estate-primary group-hover:scale-110 transition-transform duration-300" />
                      <span>Step 2: Financial Documents</span>
                      <div className="ml-auto flex space-x-2">
                        {t12Data && (
                          <Badge
                            variant="outline"
                            className="text-xs border-real-estate-success/30 text-real-estate-success"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            T12
                          </Badge>
                        )}
                        {rentRollData && (
                          <Badge
                            variant="outline"
                            className="text-xs border-real-estate-success/30 text-real-estate-success"
                          >
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
                      disabled={isFromSavedDeal}
                    />
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep} className="flex items-center space-x-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                      </Button>
                      {t12Data && rentRollData && !isFromSavedDeal && (
                        <Button onClick={handleNextStep} className="flex items-center space-x-2">
                          <span>Next: Set Criteria & Analyze</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Investment Criteria */}
              {currentStep === 3 && (
                <Card className="real-estate-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-right-4 duration-700 ease-out delay-700 group">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-real-estate-primary group-hover:scale-110 transition-transform duration-300" />
                      <span>Step 3: Investment Analysis</span>
                      {assumptions.askingPrice > 0 && (
                        <Badge
                          variant="outline"
                          className="ml-auto border-real-estate-success/30 text-real-estate-success"
                        >
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
                      onAnalysisComplete={(results) => {
                        setAnalysisResults(results)
                        setCurrentStep(4)
                      }}
                      canAnalyze={canAnalyze && !isFromSavedDeal}
                      onAnalysisStart={() => {
                        setIsFromSavedDeal(false)
                        setIsAnalyzing(true)
                      }}
                      onDealSaved={refreshSavedDeals}
                      disabled={isFromSavedDeal}
                    />
                    <div className="mt-6 flex justify-between">
                      {!isFromSavedDeal && (
                        <Button variant="outline" onClick={handlePrevStep} className="flex items-center space-x-2">
                          <ArrowLeft className="h-4 w-4" />
                          <span>Back</span>
                        </Button>
                      )}
                      {isFromSavedDeal && (
                        <Button
                          onClick={handleStartNewAnalysis}
                          variant="outline"
                          className="border-2 border-real-estate-primary/30 text-real-estate-primary hover:bg-real-estate-primary/10 hover:text-real-estate-primary font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 bg-transparent"
                        >
                          🚀 Start New Analysis
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Analysis Results */}
              {analysisResults && currentStep === 4 && (
                <div
                  id="analysis-results"
                  className="scroll-mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-900"
                >
                  <Card className="real-estate-card-premium border-2 border-real-estate-primary/20 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                    <CardHeader className="bg-real-estate-gradient/5">
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-real-estate-primary" />
                        <span>Analysis Results</span>
                        {isFromSavedDeal && (
                          <Badge
                            variant="outline"
                            className="ml-auto border-real-estate-primary/30 text-real-estate-primary"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            Saved Deal
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <AnalysisResults
                        handleReset={handleResetAll}
                        results={analysisResults.dealData || analysisResults}
                        propertyDetails={analysisResults.userData?.propertyDetails || propertyDetails}
                        t12Data={analysisResults.userData?.t12Data || t12Data}
                        rentRollData={analysisResults.userData?.rentRollData || rentRollData}
                        buyBox={analysisResults.userData?.buyBox || buyBox}
                        assumptions={analysisResults.userData?.assumptions || assumptions}
                        isFromSavedDeal={isFromSavedDeal}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-6">
              <Card className="real-estate-card-premium shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Menu className="h-5 w-5 text-real-estate-primary" />
                    <span>Dashboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SidebarContent />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}