import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Users, Shield, Clock, Scale } from "lucide-react"

export default function RBC4PolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">CG</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">RBC4 Policy Guidelines</h1>
                <p className="text-sm text-gray-600">Government of Chhattisgarh</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <Link href="/" className="text-blue-900 hover:text-orange-500 font-medium">
                Home
              </Link>
              <Link href="/login">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Login</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-8">
          {/* Main RBC4 Section */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-3xl text-blue-900">RBC4 Policy Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-gray-700 leading-relaxed">
                <p className="mb-4">
                  <strong>Relief and Benefit Code 4 (RBC4)</strong> is a comprehensive policy framework established by
                  the Government of Chhattisgarh to streamline the processing and disbursement of death compensation
                  cases across the state.
                </p>
                <p className="mb-4">
                  This policy ensures systematic, transparent, and timely relief distribution to families affected by
                  unfortunate circumstances, maintaining the highest standards of governance and accountability.
                </p>
                <p>
                  The RBC4 framework integrates traditional administrative processes with modern digital solutions,
                  creating an efficient pathway from application submission to final compensation disbursement.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Objectives */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">Timely Processing</h3>
                <p className="text-gray-600 text-sm">
                  Ensure swift processing of compensation cases within stipulated timeframes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">Transparent Governance</h3>
                <p className="text-gray-600 text-sm">
                  Maintain complete transparency in approval processes and fund disbursement
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">Beneficiary Support</h3>
                <p className="text-gray-600 text-sm">
                  Provide comprehensive support to affected families during difficult times
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Policy Guidelines */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Policy Implementation Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Eligibility Criteria</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Death must be reported and verified by competent authorities</li>
                    <li>Proper documentation including post-mortem and finding reports</li>
                    <li>Verification by Patwari and Thana In-charge</li>
                    <li>Compliance with state government compensation guidelines</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Required Documentation</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Death certificate issued by competent medical authority</li>
                    <li>Post-mortem examination report</li>
                    <li>Police finding report and investigation details</li>
                    <li>Identity proof and address verification of beneficiaries</li>
                    <li>Bank account details for direct benefit transfer</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Approval Hierarchy</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Tehsildar</span>
                      <span>→</span>
                      <span className="font-medium">SDM</span>
                      <span>→</span>
                      <span className="font-medium">Rahat Operator</span>
                      <span>→</span>
                      <span className="font-medium">OIC</span>
                      <span>→</span>
                      <span className="font-medium">ADG</span>
                      <span>→</span>
                      <span className="font-medium">Collector</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Each level ensures thorough verification and maintains accountability in the approval process
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Integration */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Digital Integration & Project Rahat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 space-y-4">
                <p>
                  <strong>Project Rahat</strong> serves as the digital backbone for RBC4 policy implementation,
                  providing a comprehensive platform that digitizes the entire compensation workflow.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Online application submission and tracking</li>
                      <li>Digital document management system</li>
                      <li>Multi-level approval workflow automation</li>
                      <li>Real-time status updates for applicants</li>
                      <li>Integrated payment processing system</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Reduced processing time and paperwork</li>
                      <li>Enhanced transparency and accountability</li>
                      <li>Elimination of manual errors and delays</li>
                      <li>Comprehensive audit trail maintenance</li>
                      <li>Direct benefit transfer to beneficiaries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Framework */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Legal Framework & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 space-y-4">
                <p>
                  The RBC4 policy operates within the legal framework established by the Government of Chhattisgarh and
                  adheres to all applicable state and central government regulations.
                </p>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <Scale className="w-5 h-5 mr-2" />
                    Regulatory Compliance
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                    <li>Chhattisgarh State Compensation Rules and Regulations</li>
                    <li>Right to Information Act compliance</li>
                    <li>Digital India initiative alignment</li>
                    <li>Financial transparency and audit requirements</li>
                    <li>Data protection and privacy regulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Implementation Authority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p>
                      <strong>Policy Authority:</strong> Government of Chhattisgarh
                    </p>
                    <p>
                      <strong>Implementation Office:</strong> Collector's Office, Raipur
                    </p>
                    <p>
                      <strong>Technical Support:</strong> State IT Department
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Monitoring Authority:</strong> District Administration
                    </p>
                    <p>
                      <strong>Grievance Redressal:</strong> Collector's Office
                    </p>
                    <p>
                      <strong>Audit & Compliance:</strong> State Finance Department
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg mt-4">
                  <p className="text-orange-800">
                    <strong>For Policy Queries & Support:</strong>
                    <br />
                    Contact the Collector's Office, Raipur through official government channels or visit the Project
                    Rahat portal for technical assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
            © 2024 RBC4 Policy Framework. All rights reserved. | Implemented through Project Rahat
          </p>
        </div>
      </footer>
    </div>
  )
}
