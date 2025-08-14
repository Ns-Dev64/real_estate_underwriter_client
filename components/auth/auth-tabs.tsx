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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 animate-in fade-in slide-in-from-top-4 duration-700 ease-out">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg transition-all duration-300 hover:bg-primary/20 hover:scale-110">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">RealEstate Analyzer</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Underwriting</p>
          </div>
        </div>
        <div className="animate-in fade-in slide-in-from-top-4 duration-700 ease-out delay-100">
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left Side - Product Overview (3/5 width) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-100 hover:scale-105 transition-transform bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800"
                >
                  <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                  🚀 AI-Powered Real Estate Analysis Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-200">
                  Analyze Any{" "}
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-pulse">
                    Commercial Deal
                  </span>{" "}
                  in Under 30 Seconds
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-300 max-w-4xl">
                  Transform hours of manual underwriting into seconds of AI-powered analysis. Upload your T12s, rent rolls, and property data to get institutional-grade investment decisions instantly.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out hover:scale-105 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all cursor-pointer"
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                  >
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem Statement */}
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-500 hover:shadow-lg hover:scale-[1.02] transition-all">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div
                    className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
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
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-600">
              <h3 className="text-2xl lg:text-3xl font-semibold text-foreground">How It Works</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out group border-2 border-transparent hover:border-primary/20"
                    style={{ animationDelay: `${index * 100 + 700}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Process Flow */}
            <Card className="bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20 animate-in fade-in slide-in-from-right-4 duration-700 ease-out delay-700 hover:shadow-lg hover:scale-[1.02] transition-all">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <div className="bg-primary/20 rounded-full p-2 mr-3">
                    <Play className="h-5 w-5 text-primary" />
                  </div>
                  Simple 3-Step Process
                </h3>
                <div className="space-y-3">
                  {[
                    "🏢 Enter property address & get market data",
                    "📊 Upload T12 & rent roll documents",
                    "🎯 Set investment criteria & analyze instantly",
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 animate-in fade-in slide-in-from-left-2 duration-500 ease-out hover:translate-x-2 transition-transform p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50"
                      style={{ animationDelay: `${index * 150 + 800}ms` }}
                    >
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-pulse shadow-lg">
                        {index + 1}
                      </div>
                      <span className="text-foreground font-medium text-lg">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Users */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-800">
              <h3 className="text-2xl lg:text-3xl font-semibold text-foreground">Built For Real Estate Professionals</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "Real Estate Private Equity",
                  "Syndicators",
                  "Family Offices",
                  "Commercial Brokers",
                  "Investment Analysts",
                  "Fund Managers",
                ].map((user, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-4 py-2 animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out hover:scale-110 hover:bg-primary/10 transition-all cursor-pointer text-sm font-medium border-2"
                    style={{ animationDelay: `${index * 100 + 900}ms` }}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {user}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Value Proposition */}
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800 animate-in fade-in slide-in-from-left-4 duration-700 ease-out delay-900 hover:shadow-lg hover:scale-[1.02] transition-all">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div
                    className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg animate-bounce"
                    style={{ animationDelay: "2s" }}
                  >
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3 text-lg">Transform Your Investment Process</h3>
                    <ul className="space-y-1 text-green-800 dark:text-green-200 text-sm">
                      {[
                        "⚡ Save 95% of analysis time - from hours to seconds",
                        "🤖 Eliminate manual data entry with AI extraction",
                        "💰 Reduce analyst costs by thousands per month",
                        "📈 Make faster, data-driven investment decisions",
                        "🎯 Institutional-grade accuracy for every deal",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start animate-in fade-in slide-in-from-left-2 duration-400 ease-out py-1"
                          style={{ animationDelay: `${index * 100 + 1000}ms` }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-3 mt-0.5 animate-pulse flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Auth Forms (2/5 width) */}
          <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-8">
            {oauthError && (
              <Alert variant="destructive" className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
                <AlertDescription>Authentication failed: {oauthError}</AlertDescription>
              </Alert>
            )}

            <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl animate-in fade-in slide-in-from-right-4 duration-700 ease-out delay-300 hover:shadow-3xl transition-all">
              <CardHeader className="space-y-4 text-center pb-6">
                <div className="space-y-2">
                  <CardTitle className="text-2xl animate-in fade-in slide-in-from-top-2 duration-500 ease-out delay-400">
                    Start Your Free Analysis
                  </CardTitle>
                  <CardDescription className="text-base animate-in fade-in slide-in-from-top-2 duration-500 ease-out delay-500">
                    Join thousands of real estate professionals using AI-powered analysis
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-500 ease-out delay-600 bg-blue-50/50 dark:bg-blue-950/20 rounded-full px-4 py-2">
                  <Zap className="h-4 w-4 text-primary animate-pulse" />
                  <span className="font-medium">Free trial • No credit card required • Instant access</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out delay-700">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="login"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105"
                      >
                        Sign In
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 hover:scale-105"
                      >
                        Get Started
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="login"
                      className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out"
                    >
                      <LoginForm />
                    </TabsContent>
                    <TabsContent
                      value="register"
                      className="space-y-4 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out"
                    >
                      <RegisterForm />
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Demo CTA */}
                {/* <div className="pt-4 border-t animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out delay-800">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent hover:bg-primary/5 hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    <Play className="h-4 w-4 mr-2 animate-pulse" />
                    Watch 2-Minute Demo
                  </Button>
                </div> */}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-900">
              <p className="text-sm text-muted-foreground font-medium">Trusted by real estate professionals nationwide</p>
              <div className="flex items-center justify-center space-x-6 opacity-60">
                {["PRIVATE EQUITY", "SYNDICATORS", "FAMILY OFFICES"].map((text, index) => (
                  <div
                    key={text}
                    className="text-xs font-bold tracking-wider animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out hover:opacity-100 transition-opacity"
                    style={{ animationDelay: `${index * 200 + 1000}ms` }}
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}