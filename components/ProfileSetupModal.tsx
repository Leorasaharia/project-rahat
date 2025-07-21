"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/i18n"
import { updateUserProfile, saveUserProfile, type UserProfile } from "@/lib/auth"
import { User, CheckCircle, AlertCircle } from "lucide-react"

interface ProfileSetupModalProps {
  isOpen: boolean
  onClose: () => void
  userProfile: UserProfile
  onProfileUpdate: (profile: UserProfile) => void
}

export function ProfileSetupModal({ isOpen, onClose, userProfile, onProfileUpdate }: ProfileSetupModalProps) {
  const { language } = useLanguage()
  const t = (key: any) => getTranslation(key, language)

  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    phone: "",
    alternatePhone: "",
    department: "",
    designation: "",
    officeAddress: "",
    employeeId: "",
  })

  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || "",
        displayName: userProfile.displayName || "",
        phone: userProfile.phone || "",
        alternatePhone: userProfile.alternatePhone || "",
        department: userProfile.department || "",
        designation: userProfile.designation || "",
        officeAddress: userProfile.officeAddress || "",
        employeeId: userProfile.employeeId || "",
      })
    }
  }, [userProfile])

  const handleSave = () => {
    if (!formData.fullName.trim()) {
      setAlertMessage("Please enter your full name")
      setAlertType("error")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    const updatedProfile = {
      ...userProfile,
      ...formData,
      profileCompleted: true,
      lastUpdated: new Date().toISOString(),
    }

    const success = updateUserProfile(userProfile.id, updatedProfile)
    if (success) {
      saveUserProfile(updatedProfile)
      onProfileUpdate(updatedProfile)
      setAlertMessage(t("profileUpdated"))
      setAlertType("success")
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
        onClose()
      }, 2000)
    } else {
      setAlertMessage(t("profileUpdateFailed"))
      setAlertType("error")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleSkip = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <User className="w-6 h-6 mr-2 text-orange-500" />
            {t("completeProfile")}
          </DialogTitle>
        </DialogHeader>

        {showAlert && (
          <Alert
            className={`border-${alertType === "success" ? "green" : "red"}-200 bg-${alertType === "success" ? "green" : "red"}-50`}
          >
            {alertType === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={`text-${alertType === "success" ? "green" : "red"}-800`}>
              {alertMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">{t("profileSetupMessage")}</p>
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">{t("personalDetails")}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">
                  {t("fullName")} *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder={t("enterFullName")}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayName" className="text-sm font-medium">
                  {t("displayName")}
                </Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
                  placeholder={t("enterDisplayName")}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">{t("contactInformation")}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("phone")}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder={t("enterPhone")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="alternatePhone" className="text-sm font-medium">
                  {t("alternatePhone")}
                </Label>
                <Input
                  id="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alternatePhone: e.target.value }))}
                  placeholder={t("enterAlternatePhone")}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Official Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 border-b pb-2">{t("officialDetails")}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department" className="text-sm font-medium">
                  {t("department")}
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  placeholder={t("enterDepartment")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="designation" className="text-sm font-medium">
                  {t("designation")}
                </Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, designation: e.target.value }))}
                  placeholder={t("enterDesignation")}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="employeeId" className="text-sm font-medium">
                  {t("employeeId")}
                </Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                  placeholder={t("enterEmployeeId")}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="officeAddress" className="text-sm font-medium">
                {t("officeAddress")}
              </Label>
              <Textarea
                id="officeAddress"
                value={formData.officeAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, officeAddress: e.target.value }))}
                placeholder={t("enterOfficeAddress")}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button onClick={handleSave} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              {t("setupProfile")}
            </Button>
            <Button onClick={handleSkip} variant="outline" className="flex-1 bg-transparent">
              {t("skipForNow")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
