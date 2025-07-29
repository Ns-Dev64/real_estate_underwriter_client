"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3, Target, DollarSign, Percent, AlertTriangle } from "lucide-react"

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

interface DealStatisticsProps {
  savedDeals: SavedDeal[]
}

export function DealStatistics({ savedDeals }: DealStatisticsProps) {
  const statistics = useMemo(() => {
    if (savedDeals.length === 0) {
      return {
        totalDeals: 0,
        passDeals: 0,
        failDeals: 0,
        passRate: 0,
        failRate: 0,
        averageMetrics: {
          capRate: 0,
          cocReturn: 0,
          irr: 0,
          dscr: 0,
          pricePerUnit: 0,
          expenseRatio: 0,
        },
        overallRecommendation: "INSUFFICIENT_DATA",
      }
    }

    const totalDeals = savedDeals.length
    const passDeals = savedDeals.filter((deal) => deal.dealData.decision === "PASS").length
    const failDeals = savedDeals.filter((deal) => deal.dealData.decision === "FAIL").length

    const passRate = (passDeals / totalDeals) * 100
    const failRate = (failDeals / totalDeals) * 100

    // Calculate average metrics
    const validDeals = savedDeals.filter((deal) => deal.dealData.metrics)
    const averageMetrics =
      validDeals.length > 0
        ? {
            capRate: validDeals.reduce((sum, deal) => sum + (deal.dealData.metrics.capRate || 0), 0) / validDeals.length,
            cocReturn: validDeals.reduce((sum, deal) => sum + (deal.dealData.metrics.cocReturn || 0), 0) / validDeals.length,
            irr: validDeals.reduce((sum, deal) => sum + (deal.dealData.metrics.irr || 0), 0) / validDeals.length,
            dscr: validDeals.reduce((sum, deal) => sum + (deal.dealData.metrics.dscr || 0), 0) / validDeals.length,
            pricePerUnit:
              validDeals.reduce((sum, deal) => sum + (deal.dealData.metrics.pricePerUnit || 0), 0) / validDeals.length,
            expenseRatio:
              validDeals.reduce((sum, deal) => sum + (deal.dealData.metrics.expenseRatio || 0), 0) / validDeals.length,
          }
        : {
            capRate: 0,
            cocReturn: 0,
            irr: 0,
            dscr: 0,
            pricePerUnit: 0,
            expenseRatio: 0,
          }

    // Determine overall recommendation
    let overallRecommendation = "PASS"
     if (failRate >= 60) {
      overallRecommendation = "FAIL"
    }

    return {
      totalDeals,
      passDeals,
      failDeals,
      passRate,
      failRate,
      averageMetrics,
      overallRecommendation,
    }
  }, [savedDeals])

  if (statistics.totalDeals === 0) {
    return null
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "PASS_WITH_CONDITIONS":
        return "bg-real-estate-warning text-white"
      case "FAIL":
        return "bg-destructive text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "PASS_WITH_CONDITIONS":
        return "Selective Approach"
      case "FAIL":
        return "Market Concerns"
      default:
        return "Neutral"
    }
  }

  return (
    <Card className="real-estate-card-premium shadow-lg border-2 border-real-estate-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-real-estate-primary" />
          <span>Portfolio Analysis</span>
          <Badge className={`ml-auto px-3 py-1 ${getRecommendationColor(statistics.overallRecommendation)}`}>
            {getRecommendationText(statistics.overallRecommendation)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deal Distribution */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Deal Distribution</h4>
          <div className="grid grid-cols-3 gap-4">

            <div className="text-center space-y-2">
              <div className="bg-real-estate-warning/10 p-3 rounded-lg">
                <Target className="h-6 w-6 text-real-estate-warning mx-auto mb-1" />
                <p className="text-2xl font-bold text-real-estate-warning">{statistics.passDeals}</p>
                <p className="text-xs text-muted-foreground">PASS</p>
              </div>
              <Progress value={statistics.passRate} className="h-2 [&>div]:bg-real-estate-warning" />
              <p className="text-xs font-medium">{statistics.passRate.toFixed(1)}%</p>
            </div>

            <div className="text-center space-y-2">
              <div className="bg-destructive/10 p-3 rounded-lg">
                <TrendingDown className="h-6 w-6 text-destructive mx-auto mb-1" />
                <p className="text-2xl font-bold text-destructive">{statistics.failDeals}</p>
                <p className="text-xs text-muted-foreground">FAIL</p>
              </div>
              <Progress value={statistics.failRate} className="h-2 [&>div]:bg-destructive" />
              <p className="text-xs font-medium">{statistics.failRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Average Metrics */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Average Performance Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <Percent className="h-4 w-4 text-real-estate-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-real-estate-primary">
                {(statistics.averageMetrics.cocReturn * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg CoC Return</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <Percent className="h-4 w-4 text-real-estate-info mx-auto mb-1" />
              <p className="text-lg font-bold text-real-estate-info">
                {(statistics.averageMetrics.capRate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Cap Rate</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <Percent className="h-4 w-4 text-real-estate-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-real-estate-accent">
                {(statistics.averageMetrics.irr * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg IRR</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <DollarSign className="h-4 w-4 text-real-estate-secondary mx-auto mb-1" />
              <p className="text-lg font-bold text-real-estate-secondary">
                ${statistics.averageMetrics.pricePerUnit.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Avg Price/Unit</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <BarChart3 className="h-4 w-4 text-real-estate-neutral mx-auto mb-1" />
              <p className="text-lg font-bold text-real-estate-neutral">{statistics.averageMetrics.dscr.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Avg DSCR</p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-center">
              <Percent className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-bold text-muted-foreground">
                {(statistics.averageMetrics.expenseRatio * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Expense Ratio</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-real-estate-primary/5 p-4 rounded-lg border border-real-estate-primary/20">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-real-estate-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-real-estate-primary mb-2">Portfolio Insights</h4>
              <div className="space-y-1 text-xs text-real-estate-primary/80">
                <p>
                  • Average CoC return of {(statistics.averageMetrics.cocReturn * 100).toFixed(1)}% across all deals
                </p>
                {statistics.averageMetrics.capRate > 0.08 && (
                  <p>• Above-average cap rates indicate good value opportunities</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
