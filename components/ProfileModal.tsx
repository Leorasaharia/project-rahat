"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/hooks/useLanguage"
import { getTranslation } from "@/lib/i18n"
import { updateUserProfile, saveUserProfile, type UserProfile } from "@/lib/auth"
import { User, CheckCircle, AlertCircle, Edit3 } from "lucide-react"

interface ProfileModalProps {
  userProfile: UserProfile
  onProfileUpdate: (profile: UserProfile) => void
  trigger?: React.ReactNode
}

export function ProfileModal({ userProfile, onProfileUpdate, trigger }: ProfileModalProps) {
  const { language } = useLanguage()
  const t = (key: any) => getTranslation(key, language)

  const [isEditing, setIsEditing] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")

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
    const updatedProfile = {
      ...userProfile,
      ...formData,
      profileCompleted: !!formData.fullName,
      lastUpdated: new Date().toISOString(),
    }

    const success = updateUserProfile(userProfile.id, updatedProfile)
    if (success) {
      saveUserProfile(updatedProfile)
      onProfileUpdate(updatedProfile)
      setIsEditing(false)
      setAlertMessage(t("profileUpdated"))
      setAlertType("success")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } else {
      setAlertMessage(t("profileUpdateFailed"))
      setAlertType("error")
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleCancel = () => {
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
    setIsEditing(false)
  }

  if (!userProfile) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            {t("profile")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-orange-500" />
            {t("userProfile")}
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
          {/* Profile Header */}
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg">
            <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900">
              {userProfile.fullName || userProfile.displayName || userProfile.username}
            </h3>
            <p className="text-sm text-gray-600">
              {userProfile.role.toUpperCase()} • {userProfile.username}
            </p>
            {!userProfile.profileCompleted && (
              <div className="mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs inline-block">
                {t("profileIncomplete")}
              </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-blue-900 border-b pb-2 flex-1">{t("personalDetails")}</h3>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="ml-4">
                  <Edit3 className="w-4 h-4 mr-1" />
                  {t("editProfile")}
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">
                  {t("fullName")}
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder={t("enterFullName")}
                  disabled={!isEditing}
                  className="mt-1"
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
                  disabled={!isEditing}
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
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </Label>
                <Input id="email" value={userProfile.email} disabled className="mt-1 bg-gray-50" />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("phone")}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder={t("enterPhone")}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="alternatePhone" className="text-sm font-medium">
                  {t("alternatePhone")}
                </Label>
                <Input
                  id="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, alternatePhone: e.target.value }))}
                  placeholder={t("enterAlternatePhone")}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="joiningDate" className="text-sm font-medium">
                  {t("joiningDate")}
                </Label>
                <Input id="joiningDate" value={userProfile.joiningDate} disabled className="mt-1 bg-gray-50" />
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
                disabled={!isEditing}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex space-x-4 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                {t("saveProfile")}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                {t("cancelEdit")}
              </Button>
            </div>
          )}

          {/* Profile Metadata */}
          <div className="text-xs text-gray-500 space-y-1 pt-4 border-t">
            <p>
              {t("lastLogin")}: {new Date(userProfile.lastLogin).toLocaleString()}
            </p>
            <p>
              {t("lastUpdated")}: {new Date(userProfile.lastUpdated).toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
