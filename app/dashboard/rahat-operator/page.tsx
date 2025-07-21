"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LogOut, FileText, CheckCircle, XCircle, Eye, Send, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

// Add these imports at the top
import { ProfileModal } from "@/components/ProfileModal"
import { LanguageToggle } from "@/components/LanguageToggle"
import { useLanguage } from "@/hooks/useLanguage"
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
  status: string
  documents: {
    findingReport?: File
    postMortemReport?: File
  }
  verifications: {
    patwari: boolean
    thanaIncharge: boolean
  }
  createdAt: string
  sdmStatus?: "pending" | "approved" | "rejected"
  sdmComments?: string
  rahatStatus?: "pending" | "approved" | "rejected"
  rahatComments?: string
}

export default function RahatOperatorDashboard() {
  const [username, setUsername] = useState("")
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [comments, setComments] = useState("")
  const router = useRouter()
  const { language } = useLanguage()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false)

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    const storedRole = localStorage.getItem("userRole")

    if (!storedUsername || storedRole !== "rahat-operator") {
      router.push("/login")
      return
    }

    setUsername(storedUsername)

    // Load applicants from localStorage
    const storedApplicants = localStorage.getItem("applicants")
    if (storedApplicants) {
      const allApplicants = JSON.parse(storedApplicants)
      // Filter applications forwarded to Rahat Operator
      const rahatApplicants = allApplicants.filter(
        (app: Applicant) => app.status === "forwarded-to-rahat" || app.rahatStatus,
      )
      setApplicants(rahatApplicants)
    }
  }, [router])

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await loadUserProfile()
      setUserProfile(profile)
      if (!profile?.fullName) {
        setIsProfileSetupOpen(true)
      }
    }
    fetchProfile()
  }, [])

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile)
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handleApprove = (applicantId: string) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId ? { ...app, rahatStatus: "approved" as const, rahatComments: comments } : app,
    )
    setApplicants(updatedApplicants)

    // Update in localStorage
    const allApplicants = JSON.parse(localStorage.getItem("applicants") || "[]")
    const updatedAllApplicants = allApplicants.map((app: Applicant) =>
      app.id === applicantId ? { ...app, rahatStatus: "approved" as const, rahatComments: comments } : app,
    )
    localStorage.setItem("applicants", JSON.stringify(updatedAllApplicants))

    setAlertMessage("Application approved by Rahat Operator!")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
    setComments("")
    setSelectedApplicant(null)
  }

  const handleReject = (applicantId: string) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId ? { ...app, rahatStatus: "rejected" as const, rahatComments: comments } : app,
    )
    setApplicants(updatedApplicants)

    // Update in localStorage
    const allApplicants = JSON.parse(localStorage.getItem("applicants") || "[]")
    const updatedAllApplicants = allApplicants.map((app: Applicant) =>
      app.id === applicantId ? { ...app, rahatStatus: "rejected" as const, rahatComments: comments } : app,
    )
    localStorage.setItem("applicants", JSON.stringify(updatedAllApplicants))

    setAlertMessage("Application rejected with comments.")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
    setComments("")
    setSelectedApplicant(null)
  }

  const handleForwardToNext = (applicantId: string) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId ? { ...app, status: "forwarded-to-oic" } : app,
    )
    setApplicants(updatedApplicants)

    // Update in localStorage
    const allApplicants = JSON.parse(localStorage.getItem("applicants") || "[]")
    const updatedAllApplicants = allApplicants.map((app: Applicant) =>
      app.id === applicantId ? { ...app, status: "forwarded-to-oic" } : app,
    )
    localStorage.setItem("applicants", JSON.stringify(updatedAllApplicants))

    setAlertMessage("Application forwarded to OIC!")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const getStatusBadge = (applicant: Applicant) => {
    if (applicant.rahatStatus === "approved") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    } else if (applicant.rahatStatus === "rejected") {
      return (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Review
        </Badge>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-green-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_of_India_logo.svg/1200px-Government_of_India_logo.svg.png"
                alt="Government of India"
                className="w-12 h-12 bg-white rounded p-1"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/87/Coat_of_arms_of_Chhattisgarh.svg"
                alt="Government of Chhattisgarh"
                className="w-12 h-12 bg-white rounded p-1"
              />
              <div className="text-white">
                <h1 className="text-xl font-bold">RAHAT OPERATOR DASHBOARD</h1>
                <p className="text-sm opacity-90">राहत ऑपरेटर डैशबोर्ड | GOVERNMENT OF CHHATTISGARH</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <div className="text-white text-right">
                <p className="text-sm font-medium">{userProfile?.fullName || userProfile?.displayName || username}</p>
                <p className="text-xs opacity-80">Rahat Operator</p>
              </div>
              {userProfile && <ProfileModal userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />}
              <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <FileText className="w-5 h-5 mr-2" />
              Applications for Review ({applicants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No applications pending for Rahat Operator review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((applicant) => (
                  <Card key={applicant.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-blue-900">{applicant.name}</h3>
                          <p className="text-gray-600">
                            Age: {applicant.age} | Sex: {applicant.sex}
                          </p>
                          <p className="text-sm text-gray-500">
                            Submitted: {new Date(applicant.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(applicant)}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p>
                            <strong>Date of Death:</strong> {applicant.dateOfDeath}
                          </p>
                          <p>
                            <strong>Location:</strong> {applicant.location}
                          </p>
                          <p>
                            <strong>Address:</strong> {applicant.address}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Previous Approvals:</strong>
                          </p>
                          <ul className="text-sm text-gray-600">
                            <li>SDM Status: {applicant.sdmStatus === "approved" ? "✓ Approved" : "Pending"}</li>
                          </ul>
                          <p className="mt-2">
                            <strong>Documents:</strong>
                          </p>
                          <ul className="text-sm text-gray-600">
                            <li>Finding Report: {applicant.documents.findingReport ? "✓ Available" : "✗ Missing"}</li>
                            <li>
                              Post-Mortem Report: {applicant.documents.postMortemReport ? "✓ Available" : "✗ Missing"}
                            </li>
                          </ul>
                        </div>
                      </div>

                      {applicant.sdmComments && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm">
                            <strong>SDM Comments:</strong> {applicant.sdmComments}
                          </p>
                        </div>
                      )}

                      {applicant.rahatComments && (
                        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm">
                            <strong>Rahat Operator Comments:</strong> {applicant.rahatComments}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setSelectedApplicant(applicant)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Application Details - {applicant.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p>
                                    <strong>Full Name:</strong> {applicant.name}
                                  </p>
                                  <p>
                                    <strong>Age:</strong> {applicant.age}
                                  </p>
                                  <p>
                                    <strong>Sex:</strong> {applicant.sex}
                                  </p>
                                  <p>
                                    <strong>Date of Birth:</strong> {applicant.dateOfBirth}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Date of Death:</strong> {applicant.dateOfDeath}
                                  </p>
                                  <p>
                                    <strong>Location:</strong> {applicant.location}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p>
                                  <strong>Address:</strong> {applicant.address}
                                </p>
                              </div>
                              {applicant.familyDetails && (
                                <div>
                                  <p>
                                    <strong>Family Details:</strong> {applicant.familyDetails}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {!applicant.rahatStatus && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => setSelectedApplicant(applicant)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Approve Application</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>
                                    Are you sure you want to approve the application for{" "}
                                    <strong>{applicant.name}</strong>?
                                  </p>
                                  <div>
                                    <Label htmlFor="approve-comments">Comments (Optional)</Label>
                                    <Textarea
                                      id="approve-comments"
                                      value={comments}
                                      onChange={(e) => setComments(e.target.value)}
                                      placeholder="Add any comments or notes..."
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => handleApprove(applicant.id)}
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                      Confirm Approval
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" onClick={() => setSelectedApplicant(applicant)}>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Application</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>
                                    Are you sure you want to reject the application for{" "}
                                    <strong>{applicant.name}</strong>?
                                  </p>
                                  <div>
                                    <Label htmlFor="reject-comments">Reason for Rejection *</Label>
                                    <Textarea
                                      id="reject-comments"
                                      value={comments}
                                      onChange={(e) => setComments(e.target.value)}
                                      placeholder="Please provide reason for rejection..."
                                      required
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => handleReject(applicant.id)}
                                      variant="destructive"
                                      disabled={!comments.trim()}
                                    >
                                      Confirm Rejection
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}

                        {applicant.rahatStatus === "approved" && applicant.status !== "forwarded-to-oic" && (
                          <Button
                            onClick={() => handleForwardToNext(applicant.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Forward to OIC
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ProfileSetupModal
        isOpen={isProfileSetupOpen}
        onClose={() => setIsProfileSetupOpen(false)}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  )
}
