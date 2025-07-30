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
import { MockDataUpload } from "./mock-data-upload"
import { DealStatistics } from "./deal-statistics"
import {config} from "@/lib/config"

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
}

export function Dashboard() {
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

  const [savedDeals, setSavedDeals] = useState<SavedDeal[]>([])
  const [isLoadingDeals, setIsLoadingDeals] = useState(true)
  const [dealsError, setDealsError] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [viewedDeals, setViewedDeals] = useState<Set<string>>(new Set())
  const [isResetting, setIsResetting] = useState(false)
  const envType=process.env.NEXT_PUBLIC_ENV_TYPE;
  const isDev= envType ==="dev" ? true : false

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
        const response = await fetch(`${config.BACKEND_URL}/deals`, {
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
      const response = await fetch(`${config.BACKEND_URL}/deals`, {
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
    } else {
      // Load the deal data into the current analysis from the saved deal
      setAnalysisResults(deal)
      setIsFromSavedDeal(true)
      
      // Populate form fields with saved deal data (no localStorage needed)
      if (deal.userData) {
        setPropertyDetails(deal.userData.propertyDetails || null)
        setT12Data(deal.userData.t12Data || null)
        setRentRollData(deal.userData.rentRollData || null)
        setBuyBox(deal.userData.buyBox || {
          minYearBuilt: 1980,
          minCoCReturn: 8,
          minCapRate: 6,
          maxPurchasePrice: 1000000,
          minUnits: 10,
          preferredMarkets: [],
        })
        setAssumptions(deal.userData.assumptions || {
          askingPrice: 0,
          downPayment: 25,
          interestRate: 7,
          loanTerm: 30,
          exitCapRate: 6,
          exitYear: 5,
        })
      }
      
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
      const response = await fetch(`${config.BACKEND_URL}/deals/${dealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

    // Show success message
    // You could add a toast notification here
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
  }

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

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-100">
          <h1 className="text-4xl font-bold text-foreground mb-3 text-real-estate-gradient animate-pulse">
            Real Estate Deal Analyzer
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Smart insights for property investments.
          </p>
        </div>

        {/* Demo CTA Section */}
        {!isFromSavedDeal && (
          <Card className="border-2 border-real-estate-info/20 bg-gradient-to-r from-cyan-50/50 to-blue-50/30 dark:from-cyan-950/20 dark:to-blue-950/20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-200 hover:shadow-lg hover:scale-[1.01] transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-real-estate-info">🚀 Jumpstart Your Investment Journey</h3>
                  <p className="text-real-estate-info/80 text-sm">
                    Explore real-world data and see how our platform helps you analyze multifamily deals with confidence.
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
        {!isFromSavedDeal && isDev &&  (
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
               {!isFromSavedDeal && (propertyDetails || t12Data || rentRollData || assumptions.askingPrice > 0) && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysisSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border bg-card/50 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out hover:shadow-md hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer group"
                  style={{ animationDelay: `${index * 50 + 400}ms` }}
                >
                  <div
                    className={`flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${step.completed ? "text-real-estate-success" : "text-muted-foreground"}`}
                  >
                    {step.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
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
            <Card className="real-estate-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-500 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-real-estate-primary group-hover:scale-110 transition-transform duration-300" />
                  <span>Property Search</span>
                  {propertyDetails && (
                    <Badge variant="outline" className="ml-auto border-real-estate-success/30 text-real-estate-success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                  {isFromSavedDeal && (
                    <Badge variant="outline" className="ml-2 border-real-estate-primary/30 text-real-estate-primary text-xs">
                      Saved Data
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
              </CardContent>
            </Card>

            <Card className="real-estate-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-600 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-real-estate-primary group-hover:scale-110 transition-transform duration-300" />
                  <span>Financial Documents</span>
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
                    {isFromSavedDeal && (
                      <Badge variant="outline" className="text-xs border-real-estate-primary/30 text-real-estate-primary">
                        Saved Data
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
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="real-estate-card transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 animate-in fade-in slide-in-from-right-4 duration-700 ease-out delay-700 group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-real-estate-primary group-hover:scale-110 transition-transform duration-300" />
                  <span>Investment Dashboard</span>
                  {assumptions.askingPrice > 0 && (
                    <Badge variant="outline" className="ml-auto border-real-estate-success/30 text-real-estate-success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Set
                    </Badge>
                  )}
                  {isFromSavedDeal && (
                    <Badge variant="outline" className="ml-2 border-real-estate-primary/30 text-real-estate-primary text-xs">
                      Saved Data
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
                  }}
                  canAnalyze={canAnalyze && !isFromSavedDeal}
                  onAnalysisStart={() => {
                    setIsFromSavedDeal(false)
                    setIsAnalyzing(true)
                  }}
                  onDealSaved={refreshSavedDeals}
                  disabled={isFromSavedDeal}
                />

                {!canAnalyze && !isFromSavedDeal && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/20 border border-real-estate-warning/30 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out hover:shadow-md transition-all">
                    <div className="flex items-start space-x-3">
                      <div className="bg-real-estate-warning/20 rounded-full p-1 animate-bounce">
                        <AlertCircle className="h-4 w-4 text-real-estate-warning" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-real-estate-warning mb-1">Almost Ready to Analyze!</p>
                        <p className="text-xs text-real-estate-warning/80 mb-3">
                          Complete:{" "}
                          {analysisSteps
                            .filter((s) => !s.completed)
                            .map((s) => s.title)
                            .join(", ")}
                        </p>
                      
                      </div>
                    </div>
                  </div>
                )}

                {isFromSavedDeal && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-real-estate-primary/10 to-real-estate-secondary/10 border border-real-estate-primary/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="bg-real-estate-primary/20 rounded-full p-1">
                        <Clock className="h-4 w-4 text-real-estate-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-real-estate-primary mb-1">Viewing Saved Deal</p>
                        <p className="text-xs text-real-estate-primary/80 mb-3">
                          This analysis was previously completed. To run a new analysis, start a new session.
                        </p>
                        <Button
                          onClick={handleStartNewAnalysis}
                          variant="outline"
                          size="sm"
                          className="border-2 border-real-estate-primary/30 text-real-estate-primary hover:bg-real-estate-primary/10 hover:text-real-estate-primary font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 bg-transparent"
                        >
                          🚀 Start New Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Saved Deals Section */}
        <Card className="real-estate-card-premium shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-800 hover:shadow-xl hover:scale-[1.01] transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-real-estate-primary" />
                <span>Saved Deals</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="px-3 py-1 bg-real-estate-primary/10 text-real-estate-primary">
                  {savedDeals.length} {savedDeals.length === 1 ? "Deal" : "Deals"}
                </Badge>
                {isLoadingDeals && <Loader className="h-4 w-4 animate-spin text-real-estate-primary" />}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDeals ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader className="h-8 w-8 animate-spin mx-auto text-real-estate-primary" />
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
                <div className="bg-real-estate-gradient/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <BarChart3 className="h-10 w-10 text-real-estate-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Analyze Your First Deal?</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Complete an analysis above to save and track your real estate investment decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button
                    onClick={handleLoadDemoData}
                    variant="outline"
                    className="border-2 border-real-estate-primary text-real-estate-primary hover:bg-real-estate-primary hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 bg-transparent"
                    disabled={isFromSavedDeal}
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
                  const metrics = savedDeal.dealData?.metrics || {}
                  const decision = savedDeal.dealData?.decision || "N/A"
                  const isCurrentlyViewed = viewedDeals.has(savedDeal._id)
                  
                  return (
                    <Card
                      key={savedDeal._id}
                      className={`real-estate-card hover:shadow-lg transition-all duration-300 border-2 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out hover:scale-105 hover:-translate-y-2 group cursor-pointer ${
                        isCurrentlyViewed 
                          ? "border-real-estate-primary/50 bg-real-estate-primary/5" 
                          : "hover:border-real-estate-primary/20"
                      }`}
                      style={{ animationDelay: `${index * 50 + 900}ms` }}
                    >
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <Badge
                            variant={
                              decision === "PASS" ? "outline" : decision==="FAIL" ? 'destructive' : decision==="PASS WITH CONDITIONS" ? 'outline' : 'default'
                            }
                            className={`px-3 py-1 font-medium group-hover:scale-110 transition-transform duration-300 ${
                               decision ==="PASS" ? 'bg-green-500 text-white' : decision==="FAIL" ? 'bg-red-500 text-white' : decision==="PASS WITH CONDITIONS" ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                            }`}
                          > 
                            {decision}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5 border-real-estate-primary/30 text-real-estate-primary"
                            >
                              {savedDeal.dealData?.confidence || "N/A"}
                            </Badge>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewDeal(savedDeal)}
                                className={`h-8 w-8 p-0 transition-all duration-300 hover:scale-125 ${
                                  isCurrentlyViewed
                                    ? "bg-real-estate-primary/10 text-real-estate-primary hover:bg-real-estate-primary/20"
                                    : "hover:bg-real-estate-primary/10"
                                }`}
                              >
                                {isCurrentlyViewed ? (
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
                              <p className="font-semibold text-real-estate-success group-hover:scale-110 transition-transform duration-300">
                                {(metrics.cocReturn * 100)?.toFixed(1) || "N/A"}%
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-xs">Cap Rate</span>
                              <p className="font-semibold text-real-estate-info group-hover:scale-110 transition-transform duration-300">
                                {(metrics.capRate * 100)?.toFixed(1) || "N/A"}%
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-muted-foreground text-xs">IRR</span>
                              <p className="font-semibold text-real-estate-accent group-hover:scale-110 transition-transform duration-300">
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

                          {savedDeal.dealData?.reasoning && savedDeal.dealData.reasoning.length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-1">
                                <span className="text-muted-foreground text-xs">Key Insight</span>
                                <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                                  {savedDeal.dealData.reasoning[0]}
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

        {/* Deal Statistics */}
        {savedDeals.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-850">
            <DealStatistics savedDeals={savedDeals} />
          </div>
        )}


        {/* Analysis Results */}
        {analysisResults && (
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
                    <Badge variant="outline" className="ml-auto border-real-estate-primary/30 text-real-estate-primary">
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
      </main>
    </div>
  )
}