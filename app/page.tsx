"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LanguageToggle } from "@/components/LanguageToggle"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function HomePage() {
  const { language } = useLanguage()
  const t = (key: any) => getTranslation(key, language)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Gradient */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-500 relative">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full p-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_of_India_logo.svg/1200px-Government_of_India_logo.svg.png"
                  alt="Government of India"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-16 h-16 bg-white rounded-full p-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/87/Coat_of_arms_of_Chhattisgarh.svg"
                  alt="Government of Chhattisgarh"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">PROJECT RAHAT</h1>
                <p className="text-sm opacity-90">{t("governmentOf")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Link href="/about" className="text-white hover:text-orange-200 font-medium">
                {t("about")}
              </Link>
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scrolling Banner */}
        <div className="bg-orange-600 text-white py-2 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-8">RBC4 Policy Implementation - Relief Management for Death Compensation Cases</span>
            <span className="mx-8">Digital Processing System for Transparent Governance</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Quick Links */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <div className="bg-green-600 text-white p-4 rounded-t-lg">
                <h3 className="font-bold">{t("quickLinks")}</h3>
              </div>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <Link href="/about" className="block p-4 hover:bg-gray-50 border-l-4 border-l-blue-500">
                    <span className="text-blue-600">Project Rahat Portal</span>
                  </Link>
                  <Link href="/rbc4-policy" className="block p-4 hover:bg-gray-50 border-l-4 border-l-blue-500">
                    <span className="text-blue-600">About RBC4 Policy</span>
                  </Link>
                  <Link href="/login" className="block p-4 hover:bg-gray-50 border-l-4 border-l-orange-500">
                    <span className="text-orange-600">Officer Login</span>
                  </Link>
                  <div className="block p-4 hover:bg-gray-50">
                    <span className="text-gray-700 font-medium">Help & Support</span>
                    <p className="text-xs text-gray-500 mt-1">
                      RBC4 portal assists in digital processing of death compensation cases with transparent workflow
                      management and real-time tracking.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Raipur Card */}
            <Card className="border-2 border-orange-400">
              <CardContent className="p-6 text-center">
                <h3 className="text-orange-600 font-bold text-xl">{t("rajdhani")}</h3>
                <h2 className="text-2xl font-bold text-gray-800">{t("raipur")}</h2>
                <p className="text-orange-600">{t("capitalCity")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-600 to-blue-600 text-white p-8 rounded-lg mb-6">
              <h2 className="text-3xl font-bold mb-2">Project Rahat</h2>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Relief Management</h3>
              <p className="mb-2">RBC4 Policy Implementation</p>
              <p className="text-sm opacity-90">Digital platform for death compensation processing</p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Multi-Level Approval</h4>
                  <p className="text-sm text-gray-600">Hierarchical review system from Tehsildar to Collector</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Document Management</h4>
                  <p className="text-sm text-gray-600">Secure upload and verification of reports</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Transparent Processing</h4>
                  <p className="text-sm text-gray-600">Real-time tracking and status updates</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Sidebar - Login */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-700 to-gray-900 text-white">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold">{t("secureLoginPortal")}</h3>
                  <p className="text-sm opacity-80">{t("governmentOfficials")}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">{t("username")}</label>
                    <div className="relative">
                      <Input
                        placeholder={t("enterUsername")}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">{t("password")}</label>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder={t("enterPassword")}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3" asChild>
                    <Link href="/login">{t("secureLogin")}</Link>
                  </Button>

                  <div className="text-center">
                    <Link href="#" className="text-sm text-blue-300 hover:text-blue-200">
                      {t("forgotPassword")}
                    </Link>
                  </div>

                  <div className="text-center text-xs opacity-70">{t("technicalSupport")} 0771-2234567</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">CG</span>
            </div>
            <div>
              <p className="font-semibold">Government of Chhattisgarh</p>
              <p className="text-sm text-blue-200">Collector's Office, Raipur</p>
            </div>
          </div>
          <p className="text-blue-200">
            © 2024 Project Rahat. All rights reserved. | Developed under RBC4 Policy Guidelines
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
