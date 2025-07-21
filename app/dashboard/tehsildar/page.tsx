"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, UserPlus, Send, FileText, CheckCircle, Clock, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProfileModal } from "@/components/ProfileModal"
import { LanguageToggle } from "@/components/LanguageToggle"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/i18n"
import { ProfileSetupModal } from "@/components/ProfileSetupModal"
import { loadUserProfile, type UserProfile } from "@/lib/auth"

interface Applicant {
  id: string
  name: string
  age: number
  sex: string
  dateOfBirth: string
  dateOfDeath: string
  location: string
  address: string
  familyDetails: string
  status: "pending" | "completed" | "sent-to-sdm" | "payment-ready"
  documents: {
    findingReport?: File
    postMortemReport?: File
  }
  verifications: {
    patwari: boolean
    thanaIncharge: boolean
  }
  createdAt: string
  paymentStatus?: "pending" | "approved" | "completed"
}

export default function TehsildarDashboard() {
  const [username, setUsername] = useState("")
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const router = useRouter()
  const [userId, setUserId] = useState("")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  const { language } = useLanguage()
  const t = (key: any) => getTranslation(key, language)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    dateOfBirth: "",
    dateOfDeath: "",
    location: "",
    address: "",
    familyDetails: "",
  })

  const [verifications, setVerifications] = useState({
    patwari: false,
    thanaIncharge: false,
  })

  const [documents, setDocuments] = useState({
    findingReport: null as File | null,
    postMortemReport: null as File | null,
  })

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    const storedRole = localStorage.getItem("userRole")
    const storedUserId = localStorage.getItem("userId")

    if (!storedUsername || storedRole !== "tehsildar") {
      router.push("/login")
      return
    }

    setUsername(storedUsername)
    setUserId(storedUserId || "")

    // Load user profile
    const profile = loadUserProfile()
    if (profile) {
      setUserProfile(profile)
      // Show profile setup if profile is not completed
      if (!profile.profileCompleted) {
        setShowProfileSetup(true)
      }
    }

    // Load existing applicants from localStorage
    const storedApplicants = localStorage.getItem("applicants")
    if (storedApplicants) {
      setApplicants(JSON.parse(storedApplicants))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handleFileUpload = (type: "findingReport" | "postMortemReport", file: File | null) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: file,
    }))
  }

  const handleAddApplicant = (e: React.FormEvent) => {
    e.preventDefault()

    const newApplicant: Applicant = {
      id: Date.now().toString(),
      ...formData,
      age: Number.parseInt(formData.age),
      status: "pending",
      documents,
      verifications,
      createdAt: new Date().toISOString(),
      paymentStatus: "pending",
    }

    const updatedApplicants = [...applicants, newApplicant]
    setApplicants(updatedApplicants)
    localStorage.setItem("applicants", JSON.stringify(updatedApplicants))

    // Reset form
    setFormData({
      name: "",
      age: "",
      sex: "",
      dateOfBirth: "",
      dateOfDeath: "",
      location: "",
      address: "",
      familyDetails: "",
    })
    setVerifications({ patwari: false, thanaIncharge: false })
    setDocuments({ findingReport: null, postMortemReport: null })

    setAlertMessage("Applicant successfully added to the system!")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const handleProceedFurther = (applicantId: string) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId ? { ...app, status: "completed" as const } : app,
    )
    setApplicants(updatedApplicants)
    localStorage.setItem("applicants", JSON.stringify(updatedApplicants))

    setAlertMessage("Application marked as completed and ready for SDM review!")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const handleSendToSDM = (applicantId: string) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId ? { ...app, status: "sent-to-sdm" as const } : app,
    )
    setApplicants(updatedApplicants)
    localStorage.setItem("applicants", JSON.stringify(updatedApplicants))

    setAlertMessage("Application successfully sent to SDM for review!")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const handleCompletePayment = (applicantId: string) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId ? { ...app, paymentStatus: "completed" as const } : app,
    )
    setApplicants(updatedApplicants)
    localStorage.setItem("applicants", JSON.stringify(updatedApplicants))

    setAlertMessage("Payment completed successfully!")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "sent-to-sdm":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Send className="w-3 h-3 mr-1" />
            Sent to SDM
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile)
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-orange-400 to-green-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full p-2">
                <img src="/placeholder.svg?height=48&width=48&text=CG" alt="Emblem" className="w-full h-full" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">Tehsildar Dashboard</h1>
                <p className="text-sm opacity-90">
                  {t("welcome")}, {userProfile?.fullName || userProfile?.displayName || username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              {userProfile && <ProfileModal userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showAlert && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{alertMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="add-applicant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-applicant">Add New Applicant</TabsTrigger>
            <TabsTrigger value="manage-cases">Manage Cases</TabsTrigger>
          </TabsList>

          <TabsContent value="add-applicant">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add New Applicant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddApplicant} className="space-y-6">
                  {/* Verification Checkboxes */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Required Verifications</Label>
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="patwari"
                          checked={verifications.patwari}
                          onCheckedChange={(checked) =>
                            setVerifications((prev) => ({ ...prev, patwari: checked as boolean }))
                          }
                        />
                        <Label htmlFor="patwari">Patwari Verification</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="thana"
                          checked={verifications.thanaIncharge}
                          onCheckedChange={(checked) =>
                            setVerifications((prev) => ({ ...prev, thanaIncharge: checked as boolean }))
                          }
                        />
                        <Label htmlFor="thana">Thana In-charge Verification</Label>
                      </div>
                    </div>
                  </div>

                  {/* Document Upload */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Document Upload</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="finding-report">Finding Report (PDF/JPG/PNG)</Label>
                        <Input
                          id="finding-report"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("findingReport", e.target.files?.[0] || null)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postmortem-report">Post-Mortem Report (PDF/JPG/PNG)</Label>
                        <Input
                          id="postmortem-report"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload("postMortemReport", e.target.files?.[0] || null)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Applicant Details Form */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Applicant Details</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="sex">Sex *</Label>
                        <Select
                          value={formData.sex}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dob">Date of Birth *</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dod">Date of Death *</Label>
                        <Input
                          id="dod"
                          type="date"
                          value={formData.dateOfDeath}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dateOfDeath: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Residential Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="family">Family Details</Label>
                      <Textarea
                        id="family"
                        value={formData.familyDetails}
                        onChange={(e) => setFormData((prev) => ({ ...prev, familyDetails: e.target.value }))}
                        placeholder="Enter family member details, relationships, etc."
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={!verifications.patwari || !verifications.thanaIncharge}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Applicant
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-cases">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <FileText className="w-5 h-5 mr-2" />
                  Manage Applications ({applicants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applicants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No applications found. Add your first applicant to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((applicant) => (
                      <Card key={applicant.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-blue-900">{applicant.name}</h3>
                              <p className="text-gray-600">
                                Age: {applicant.age} | Sex: {applicant.sex}
                              </p>
                              <p className="text-sm text-gray-500">
                                Added: {new Date(applicant.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {getStatusBadge(applicant.status)}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p>
                                <strong>Date of Death:</strong> {applicant.dateOfDeath}
                              </p>
                              <p>
                                <strong>Location:</strong> {applicant.location}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Documents:</strong>
                              </p>
                              <ul className="text-sm text-gray-600">
                                <li>
                                  Finding Report: {applicant.documents.findingReport ? "✓ Uploaded" : "✗ Missing"}
                                </li>
                                <li>
                                  Post-Mortem Report:{" "}
                                  {applicant.documents.postMortemReport ? "✓ Uploaded" : "✗ Missing"}
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            {applicant.status === "pending" && (
                              <Button
                                onClick={() => handleProceedFurther(applicant.id)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Proceed Further
                              </Button>
                            )}
                            {applicant.status === "completed" && (
                              <Button
                                onClick={() => handleSendToSDM(applicant.id)}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send to SDM
                              </Button>
                            )}
                            {applicant.status === "payment-ready" && applicant.paymentStatus !== "completed" && (
                              <Button
                                onClick={() => handleCompletePayment(applicant.id)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <DollarSign className="w-4 h-4 mr-2" />
                                {t("completePayment")}
                              </Button>
                            )}

                            {applicant.paymentStatus === "completed" && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {t("paymentCompleted")}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {userProfile && (
        <ProfileSetupModal
          isOpen={showProfileSetup}
          onClose={() => setShowProfileSetup(false)}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}
