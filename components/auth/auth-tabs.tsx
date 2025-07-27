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
                  className="px-3 py-1 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-100 hover:scale-105 transition-transform"
                >
                  <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                  World's First AI Real Estate Underwriter
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-200">
                  Underwrite Any{" "}
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent animate-pulse">
                    Commercial Deal
                  </span>{" "}
                  in 30 Seconds
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-300">
                  Replace hours of manual analysis with AI-powered underwriting. From T12s to market comps, get instant
                  investment decisions with institutional-grade accuracy.
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
              <h3 className="text-2xl font-semibold text-foreground">How It Works</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="p-4 hover:shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out group"
                    style={{ animationDelay: `${index * 100 + 700}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
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
            <Card className="bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-blue-950/20 animate-in fade-in slide-in-from-right-4 duration-700 ease-out delay-700 hover:shadow-lg hover:scale-[1.02] transition-all">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Simple 4-Step Process</h3>
                <div className="space-y-3">
                  {[
                    "Enter property address",
                    "Upload T12 & rent roll documents",
                    "Set your investment criteria",
                    "Get instant analysis & recommendations",
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 animate-in fade-in slide-in-from-left-2 duration-500 ease-out hover:translate-x-2 transition-transform"
                      style={{ animationDelay: `${index * 150 + 800}ms` }}
                    >
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold animate-pulse">
                        {index + 1}
                      </div>
                      <span className="text-foreground">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Users */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out delay-800">
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
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-1 animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out hover:scale-110 hover:bg-primary/10 transition-all cursor-pointer"
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
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">The Impact</h3>
                    <ul className="space-y-1 text-green-800 dark:text-green-200 text-sm">
                      {[
                        "Save 95% of analysis time",
                        "Eliminate manual data entry",
                        "Reduce analyst costs by thousands",
                        "Make faster, data-driven decisions",
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center animate-in fade-in slide-in-from-left-2 duration-400 ease-out"
                          style={{ animationDelay: `${index * 100 + 1000}ms` }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2 animate-pulse" />
                          {item}
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
                    Get Started Today
                  </CardTitle>
                  <CardDescription className="text-base animate-in fade-in slide-in-from-top-2 duration-500 ease-out delay-500">
                    Join the future of real estate underwriting
                  </CardDescription>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 duration-500 ease-out delay-600">
                  <Zap className="h-4 w-4 text-primary animate-pulse" />
                  <span>Free trial • No credit card required</span>
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
              <p className="text-sm text-muted-foreground">Trusted by real estate professionals</p>
              <div className="flex items-center justify-center space-x-6 opacity-60">
                {["PRIVATE EQUITY", "SYNDICATORS", "FAMILY OFFICES"].map((text, index) => (
                  <div
                    key={text}
                    className="text-xs font-semibold animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out hover:opacity-100 transition-opacity"
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
