"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageToggle } from "@/components/LanguageToggle"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/i18n"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Lock, AlertCircle } from "lucide-react"
import { createUserProfile } from "@/lib/auth"

const roles = [
  { value: "tehsildar", label: "Tehsildar" },
  { value: "sdm", label: "SDM (Sub Divisional Magistrate)" },
  { value: "rahat-operator", label: "Rahat Operator" },
  { value: "oic", label: "OIC (Officer In-Charge)" },
  { value: "adg", label: "ADG (Additional District Magistrate)" },
  { value: "collector", label: "Collector" },
]

export default function LoginPage() {
  const { language } = useLanguage()
  const t = (key: any) => getTranslation(key, language)
  const router = useRouter()

  const [selectedRole, setSelectedRole] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simple validation - just check if fields are filled
      if (!username.trim() || !password.trim()) {
        setError(t("pleaseEnterBoth"))
        setIsLoading(false)
        return
      }

      if (!selectedRole) {
        setError(t("pleaseSelectRole"))
        setIsLoading(false)
        return
      }

      // Create a user profile using the new function
      const userProfile = createUserProfile(username, selectedRole)

      // Store user session
      localStorage.setItem("userProfile", JSON.stringify(userProfile))
      localStorage.setItem("userRole", selectedRole)
      localStorage.setItem("userId", userProfile.id)
      localStorage.setItem("username", username)

      // Redirect to appropriate dashboard
      router.push(`/dashboard/${selectedRole}`)
    } catch (error) {
      setError(t("loginFailed"))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-500">
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
                <h1 className="text-2xl font-bold">{t("districtPortal")}</h1>
                <p className="text-sm opacity-90">{t("governmentOf")}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Link href="/" className="text-white hover:text-orange-200">
                {t("home")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-16">
        <Card className="shadow-xl">
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-6 rounded-t-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">{t("secureLoginPortal")}</h2>
              <p className="text-sm opacity-80 mt-1">{t("governmentOfficials")}</p>
            </div>
          </div>

          <CardContent className="p-6">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">{t("selectRole")}</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("chooseDesignation")} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">{t("username")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("enterUsername")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("enterPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3"
                disabled={!selectedRole || !username || !password || isLoading}
              >
                {isLoading ? t("authenticating") : t("secureLogin")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                {t("forgotPassword")}
              </Link>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">{t("technicalSupport")} 0771-2234567</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
