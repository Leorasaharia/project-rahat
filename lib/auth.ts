import bcrypt from "bcryptjs"

export interface UserProfile {
  id: string
  username: string
  role: string
  fullName: string
  displayName: string
  email: string
  phone: string
  alternatePhone: string
  department: string
  designation: string
  officeAddress: string
  employeeId: string
  joiningDate: string
  createdAt: string
  lastLogin: string
  profileCompleted: boolean
  lastUpdated: string
}

// Simulated secure user storage (in production, this would be in a database)
const users = new Map<
  string,
  {
    id: string
    username: string
    passwordHash: string
    role: string
    profile: UserProfile
  }
>()

// Initialize with some demo users (passwords are hashed)
const initializeUsers = async () => {
  const roles = ["tehsildar", "sdm", "rahat-operator", "oic", "adg", "collector"]

  for (const role of roles) {
    const hashedPassword = await bcrypt.hash("secure123", 10)
    const userId = `${role}-001`

    users.set(`${role}@gov.cg`, {
      id: userId,
      username: `${role}@gov.cg`,
      passwordHash: hashedPassword,
      role,
      profile: {
        id: userId,
        username: `${role}@gov.cg`,
        role,
        fullName: "",
        displayName: "",
        email: `${role}@gov.cg`,
        phone: "",
        alternatePhone: "",
        department: "",
        designation: "",
        officeAddress: "",
        employeeId: "",
        joiningDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profileCompleted: false,
        lastUpdated: new Date().toISOString(),
      },
    })
  }
}

// Initialize users on module load
initializeUsers()

export const authenticateUser = async (username: string, password: string): Promise<UserProfile | null> => {
  const user = users.get(username)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) return null

  // Update last login
  user.profile.lastLogin = new Date().toISOString()

  return user.profile
}

export const createUserProfile = (username: string, role: string): UserProfile => {
  const userId = `${role}-${Date.now()}`

  const profile: UserProfile = {
    id: userId,
    username: username,
    role,
    fullName: "",
    displayName: "",
    email: username,
    phone: "",
    alternatePhone: "",
    department: "",
    designation: "",
    officeAddress: "",
    employeeId: "",
    joiningDate: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    profileCompleted: false,
    lastUpdated: new Date().toISOString(),
  }

  return profile
}

export const getUserProfile = (userId: string): UserProfile | null => {
  for (const user of users.values()) {
    if (user.id === userId) {
      return user.profile
    }
  }
  return null
}

export const updateUserProfile = (userId: string, updates: Partial<UserProfile>): boolean => {
  for (const user of users.values()) {
    if (user.id === userId) {
      user.profile = {
        ...user.profile,
        ...updates,
        lastUpdated: new Date().toISOString(),
        profileCompleted: !!(updates.fullName || user.profile.fullName),
      }
      return true
    }
  }
  return false
}

export const saveUserProfile = (profile: UserProfile): void => {
  // In a real app, this would save to localStorage or send to server
  localStorage.setItem("userProfile", JSON.stringify(profile))
}

export const loadUserProfile = (): UserProfile | null => {
  const stored = localStorage.getItem("userProfile")
  return stored ? JSON.parse(stored) : null
}
