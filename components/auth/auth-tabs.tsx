"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoginForm } from "./login-form"
import { RegisterForm } from "./register-form"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Building2,
  Zap,
  Clock,
  TrendingUp,
  FileText,
  BarChart3,
  CheckCircle2,
  Users,
  Target,
  Sparkles,
  Play,
} from "lucide-react"

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login")
  const [oauthError, setOauthError] = useState<string | null>(null)

  useEffect(() => {
    // Check for OAuth error in URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get("error")

    if (error) {
      setOauthError(decodeURIComponent(error))
      // Clear the error from URL without page reload
      const newUrl = window.location.pathname
      window.history.replaceState({}, "", newUrl)
    }
  }, [])

  const features = [
    {
      icon: Clock,
      title: "30-Second Analysis",
      description: "From property address to investment decision in under 30 seconds",
    },
    {
      icon: FileText,
      title: "Smart Document Processing",
      description: "AI extracts key data from T12s, rent rolls, and property documents",
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Cap rates, CoC returns, DSCR, risk metrics, and market comparables",
    },
    {
      icon: Target,
      title: "Custom Buy Box",
      description: "Set your investment criteria and get instant pass/fail recommendations",
    },
  ]

  const stats = [
    { value: "30 sec", label: "Analysis Time" },
    { value: "100+", label: "Deals Analyzed" },
    { value: "95%", label: "Time Saved" },
    { value: "$1M+", label: "Deals Processed" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">RealEstate Analyzer</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Underwriting</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Product Overview */}
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  World's First AI Real Estate Underwriter
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Underwrite Any{" "}
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Commercial Deal
                  </span>{" "}
                  in 30 Seconds
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Replace hours of manual analysis with AI-powered underwriting. From T12s to market comps, get instant
                  investment decisions with institutional-grade accuracy.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Statement */}
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">The Problem</h3>
                    <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                      Real estate analysts spend <strong>30-60 minutes</strong> underwriting each deal. 90% is manual
                      data entry. Most firms analyze <strong>100+ deals</strong> to close just 1 transaction.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">How It Works</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Process Flow */}
            <Card className="bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Simple 4-Step Process</h3>
                <div className="space-y-3">
                  {[
                    "Enter property address",
                    "Upload T12 & rent roll documents",
                    "Set your investment criteria",
                    "Get instant analysis & recommendations",
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Users */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">Built For</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Real Estate Private Equity",
                  "Syndicators",
                  "Family Offices",
                  "Commercial Brokers",
                  "Investment Analysts",
                  "Fund Managers",
                ].map((user, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    <Users className="h-3 w-3 mr-1" />
                    {user}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Value Proposition */}
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">The Impact</h3>
                    <ul className="space-y-1 text-green-800 dark:text-green-200 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Save 95% of analysis time
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Eliminate manual data entry
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Reduce analyst costs by thousands
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Make faster, data-driven decisions
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="space-y-6 lg:-mt-16">
            {oauthError && (
              <Alert variant="destructive">
                <AlertDescription>Authentication failed: {oauthError}</AlertDescription>
              </Alert>
            )}

            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
              <CardHeader className="space-y-4 text-center pb-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Get Started Today</CardTitle>
                  <CardDescription className="text-base">Join the future of real estate underwriting</CardDescription>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Free trial • No credit card required</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Get Started
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="space-y-4 mt-6">
                    <LoginForm />
                  </TabsContent>
                  <TabsContent value="register" className="space-y-4 mt-6">
                    <RegisterForm />
                  </TabsContent>
                </Tabs>

                {/* Demo CTA */}
               
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Trusted by real estate professionals</p>
              <div className="flex items-center justify-center space-x-6 opacity-60">
                <div className="text-xs font-semibold">PRIVATE EQUITY</div>
                <div className="text-xs font-semibold">SYNDICATORS</div>
                <div className="text-xs font-semibold">FAMILY OFFICES</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
