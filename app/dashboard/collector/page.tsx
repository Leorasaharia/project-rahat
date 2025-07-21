"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LogOut, FileText, CheckCircle, Eye, DollarSign, Clock, Award } from "lucide-react"
import { useRouter } from "next/navigation"

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
  oicStatus?: "pending" | "approved" | "rejected"
  oicComments?: string
  adgStatus?: "pending" | "approved" | "rejected"
  adgComments?: string
  collectorStatus?: "pending" | "payment-approved"
}

export default function CollectorDashboard() {
  const [username, setUsername] = useState("")
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<{
    fullName?: string
    displayName?: string
    email?: string
    phoneNumber?: string
  } | null>(null)

  useEffect(() => {
    const storedUsername = localStorage.getItem("username")
    const storedRole = localStorage.getItem("userRole")

    if (!storedUsername || storedRole !== "collector") {
      router.push("/login")
      return
    }

    setUsername(storedUsername)

    // Load applicants from localStorage
    const storedApplicants = localStorage.getItem("applicants")
    if (storedApplicants) {
      const allApplicants = JSON.parse(storedApplicants)
      // Filter applications forwarded to Collector
      const collectorApplicants = allApplicants.filter(
        (app: Applicant) => app.status === "forwarded-to-collector" || app.collectorStatus,
      )
      setApplicants(collectorApplicants)
    }

    // Load user profile from localStorage
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    router.push("/login")
  }

  const handleProceedForPayment = (applicantId: string) => {
    const updatedApplicants = applicants.map((app) =>
      app.id === applicantId ? { ...app, collectorStatus: "payment-approved" as const, status: "payment-ready" } : app,
    )
    setApplicants(updatedApplicants)

    // Update in localStorage
    const allApplicants = JSON.parse(localStorage.getItem("applicants") || "[]")
    const updatedAllApplicants = allApplicants.map((app: Applicant) =>
      app.id === applicantId ? { ...app, collectorStatus: "payment-approved" as const, status: "payment-ready" } : app,
    )
    localStorage.setItem("applicants", JSON.stringify(updatedAllApplicants))

    setAlertMessage("Payment approval granted! API call triggered to Tehsildar for payment finalization.")
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 8000)
  }

  const getStatusBadge = (applicant: Applicant) => {
    if (applicant.collectorStatus === "payment-approved") {
      return (
        <Badge className="bg-green-100 text-green-800">
          <DollarSign className="w-3 h-3 mr-1" />
          Payment Approved
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending Final Approval
        </Badge>
      )
    }
  }

  const approvedCount = applicants.filter((app) => app.collectorStatus === "payment-approved").length
  const pendingCount = applicants.filter((app) => !app.collectorStatus).length

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
                <h1 className="text-xl font-bold">COLLECTOR PERFORMANCE DASHBOARD</h1>
                <p className="text-sm opacity-90">कलेक्टर प्रदर्शन डैशबोर्ड | GOVERNMENT OF CHHATTISGARH</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <p className="text-sm font-medium">{userProfile?.fullName || userProfile?.displayName || username}</p>
                <p className="text-xs opacity-80">Collector</p>
              </div>
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

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-900">{applicants.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Payment Approved</p>
                  <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Award className="w-5 h-5 mr-2" />
              Final Approval - Applications Ready for Payment ({applicants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No applications pending for Collector's final approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((applicant) => (
                  <Card key={applicant.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-blue-900">{applicant.name}</h3>
                          <p className="text-gray-600">
                            Age: {applicant.age} | Sex: {applicant.sex}
                          </p>
                          <p className="text-sm text-gray-500">
                            Application Date: {new Date(applicant.createdAt).toLocaleDateString()}
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
                            <strong>Complete Approval Chain:</strong>
                          </p>
                          <ul className="text-sm text-green-600">
                            <li>✓ Tehsildar: Documents Verified</li>
                            <li>✓ SDM: {applicant.sdmStatus === "approved" ? "Approved" : "Pending"}</li>
                            <li>✓ Rahat Operator: {applicant.rahatStatus === "approved" ? "Approved" : "Pending"}</li>
                            <li>✓ OIC: {applicant.oicStatus === "approved" ? "Approved" : "Pending"}</li>
                            <li>✓ ADG: {applicant.adgStatus === "approved" ? "Approved" : "Pending"}</li>
                          </ul>
                          <p className="mt-2">
                            <strong>Documents Status:</strong>
                          </p>
                          <ul className="text-sm text-green-600">
                            <li>✓ Finding Report: Available</li>
                            <li>✓ Post-Mortem Report: Available</li>
                            <li>✓ All Verifications: Complete</li>
                          </ul>
                        </div>
                      </div>

                      {/* Show approval trail */}
                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-gray-700">Approval Trail:</h4>
                        {applicant.sdmComments && (
                          <div className="p-2 bg-blue-50 rounded text-sm">
                            <strong>SDM:</strong> {applicant.sdmComments}
                          </div>
                        )}
                        {applicant.rahatComments && (
                          <div className="p-2 bg-orange-50 rounded text-sm">
                            <strong>Rahat Operator:</strong> {applicant.rahatComments}
                          </div>
                        )}
                        {applicant.oicComments && (
                          <div className="p-2 bg-purple-50 rounded text-sm">
                            <strong>OIC:</strong> {applicant.oicComments}
                          </div>
                        )}
                        {applicant.adgComments && (
                          <div className="p-2 bg-indigo-50 rounded text-sm">
                            <strong>ADG:</strong> {applicant.adgComments}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setSelectedApplicant(applicant)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Complete Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Complete Application Review - {applicant.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Personal Information</h4>
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
                                  <p>
                                    <strong>Date of Death:</strong> {applicant.dateOfDeath}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Location Details</h4>
                                  <p>
                                    <strong>Location:</strong> {applicant.location}
                                  </p>
                                  <p>
                                    <strong>Address:</strong> {applicant.address}
                                  </p>
                                </div>
                              </div>

                              {applicant.familyDetails && (
                                <div>
                                  <h4 className="font-semibold mb-2">Family Details</h4>
                                  <p>{applicant.familyDetails}</p>
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold mb-2">Verification Status</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p>Patwari: {applicant.verifications.patwari ? "✓ Verified" : "✗ Not Verified"}</p>
                                    <p>
                                      Thana In-charge:{" "}
                                      {applicant.verifications.thanaIncharge ? "✓ Verified" : "✗ Not Verified"}
                                    </p>
                                  </div>
                                  <div>
                                    <p>
                                      Finding Report: {applicant.documents.findingReport ? "✓ Available" : "✗ Missing"}
                                    </p>
                                    <p>
                                      Post-Mortem Report:{" "}
                                      {applicant.documents.postMortemReport ? "✓ Available" : "✗ Missing"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Complete Approval History</h4>
                                <div className="space-y-2">
                                  <div className="p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm">
                                      <strong>Tehsildar:</strong> Initial application submitted with all required
                                      documents and verifications
                                    </p>
                                  </div>
                                  {applicant.sdmComments && (
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                      <p className="text-sm">
                                        <strong>SDM:</strong> {applicant.sdmComments}
                                      </p>
                                    </div>
                                  )}
                                  {applicant.rahatComments && (
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                      <p className="text-sm">
                                        <strong>Rahat Operator:</strong> {applicant.rahatComments}
                                      </p>
                                    </div>
                                  )}
                                  {applicant.oicComments && (
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                      <p className="text-sm">
                                        <strong>OIC:</strong> {applicant.oicComments}
                                      </p>
                                    </div>
                                  )}
                                  {applicant.adgComments && (
                                    <div className="p-3 bg-indigo-50 rounded-lg">
                                      <p className="text-sm">
                                        <strong>ADG:</strong> {applicant.adgComments}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {!applicant.collectorStatus && (
                          <>
                            <Button
                              onClick={() => handleProceedForPayment(applicant.id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <DollarSign className="w-4 h-4 mr-2" />
                              Payment Approval
                            </Button>
                          </>
                        )}

                        {applicant.collectorStatus === "payment-approved" && (
                          <Badge className="bg-green-100 text-green-800 px-4 py-2">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Payment Processing Initiated
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
      </div>
    </div>
  )
}
