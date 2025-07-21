import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Users, FileText, CheckCircle, Clock } from "lucide-react"

export default function AboutPage() {
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
                <h1 className="text-2xl font-bold text-blue-900">Project Rahat</h1>
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
          {/* Main About Section */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-3xl text-blue-900">About Project Rahat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-gray-700 leading-relaxed">
                <p className="mb-4">
                  <strong>Project Rahat</strong> is a pioneering digital initiative launched by the Collector's Office,
                  Raipur, Chhattisgarh, designed to revolutionize the processing of death compensation cases under the
                  RBC4 policy guidelines.
                </p>
                <p className="mb-4">
                  This comprehensive citizen-relief portal empowers local government officials to efficiently process
                  cases, verify essential documents, and approve relief payments through a transparent,
                  technology-driven approach.
                </p>
                <p>
                  The platform ensures that affected families receive timely compensation while maintaining the highest
                  standards of accountability and transparency in governance.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">Multi-Role Access</h3>
                <p className="text-gray-600 text-sm">Tehsildar, SDM, OIC, ADG, and Collector dashboards</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">Document Management</h3>
                <p className="text-gray-600 text-sm">Secure upload and verification of reports and documents</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">Approval Workflow</h3>
                <p className="text-gray-600 text-sm">Hierarchical approval system with transparent tracking</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="font-bold text-blue-900 mb-2">Real-time Status</h3>
                <p className="text-gray-600 text-sm">Live tracking from application to payment approval</p>
              </CardContent>
            </Card>
          </div>

          {/* RBC4 Policy Information */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">RBC4 Policy Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 space-y-4">
                <p>
                  The RBC4 (Relief and Benefit Code 4) policy framework provides structured guidelines for processing
                  death-related compensation cases in Chhattisgarh.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Objectives:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Ensure timely relief distribution to affected families</li>
                    <li>Maintain transparency in the approval process</li>
                    <li>Reduce bureaucratic delays through digital workflows</li>
                    <li>Provide comprehensive documentation and audit trails</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Team */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Development & Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 space-y-4">
                <p>
                  <strong>Developed by:</strong> Collector's Office, Raipur, Chhattisgarh
                </p>
                <p>
                  <strong>Implementation Authority:</strong> District Administration, Raipur
                </p>
                <p>
                  <strong>Technical Support:</strong> Government IT Department, Chhattisgarh
                </p>
                <div className="bg-orange-50 p-4 rounded-lg mt-4">
                  <p className="text-orange-800">
                    <strong>Contact Information:</strong>
                    <br />
                    For technical support or queries, please contact the Collector's Office, Raipur through official
                    government channels.
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
            © 2024 Project Rahat. All rights reserved. | Developed under RBC4 Policy Guidelines
          </p>
        </div>
      </footer>
    </div>
  )
}
