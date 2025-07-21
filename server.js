const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration
app.use(
  session({
    store: new FileStore({
      path: "./sessions",
      ttl: 86400, // 24 hours
      reapInterval: 3600, // 1 hour
    }),
    secret: "project-rahat-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Create necessary directories
const createDirectories = () => {
  const dirs = ["./uploads", "./uploads/documents", "./uploads/images", "./data", "./sessions"]

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

createDirectories()

// Simple user data store (file-based)
const USERS_FILE = "./data/users.json"
const FILES_DB = "./data/files.json"

// Initialize user data file
const initializeUserData = () => {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = [
      {
        id: 1,
        username: "tehsildar1",
        email: "tehsildar1@gov.cg.in",
        password: bcrypt.hashSync("password123", 10),
        role: "tehsildar",
        name: "Tehsildar Officer 1",
      },
      {
        id: 2,
        username: "collector1",
        email: "collector1@gov.cg.in",
        password: bcrypt.hashSync("password123", 10),
        role: "collector",
        name: "District Collector 1",
      },
      {
        id: 3,
        username: "sdm1",
        email: "sdm1@gov.cg.in",
        password: bcrypt.hashSync("password123", 10),
        role: "sdm",
        name: "Sub Divisional Magistrate 1",
      },
    ]
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2))
  }
}

// Initialize files database
const initializeFilesDB = () => {
  if (!fs.existsSync(FILES_DB)) {
    fs.writeFileSync(FILES_DB, JSON.stringify([], null, 2))
  }
}

initializeUserData()
initializeFilesDB()

// Helper functions
const getUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading users file:", error)
    return []
  }
}

const getFiles = () => {
  try {
    const data = fs.readFileSync(FILES_DB, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading files database:", error)
    return []
  }
}

const saveFiles = (files) => {
  try {
    fs.writeFileSync(FILES_DB, JSON.stringify(files, null, 2))
  } catch (error) {
    console.error("Error saving files database:", error)
  }
}

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" })
  }
  next()
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isDocument = file.mimetype === "application/pdf"
    const uploadPath = isDocument ? "./uploads/documents" : "./uploads/images"
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const userId = req.session.user.id
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${userId}_${timestamp}_${originalName}`
    cb(null, filename)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed."), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
})

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Project Rahat Backend is running" })
})

// User login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" })
    }

    const users = getUsers()
    const user = users.find((u) => u.username === username || u.email === username)

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Store user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
    }

    res.json({
      message: "Login successful",
      user: req.session.user,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// User logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" })
    }
    res.json({ message: "Logout successful" })
  })
})

// Get current user
app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.session.user })
})

// Upload files
app.post("/api/files/upload", requireAuth, upload.array("files", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" })
    }

    const files = getFiles()
    const uploadedFiles = []

    req.files.forEach((file) => {
      const fileRecord = {
        id: Date.now() + Math.random(),
        originalName: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        uploadedBy: req.session.user.id,
        uploadedByName: req.session.user.name,
        uploadedAt: new Date().toISOString(),
        path: file.path,
        type: file.mimetype === "application/pdf" ? "document" : "image",
      }

      files.push(fileRecord)
      uploadedFiles.push(fileRecord)
    })

    saveFiles(files)

    res.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ error: "File upload failed" })
  }
})

// Get list of uploaded files
app.get("/api/files", requireAuth, (req, res) => {
  try {
    const files = getFiles()
    const userFiles = files.filter((file) => file.uploadedBy === req.session.user.id)

    // Remove sensitive path information
    const safeFiles = userFiles.map((file) => ({
      id: file.id,
      originalName: file.originalName,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: file.uploadedAt,
      type: file.type,
    }))

    res.json({ files: safeFiles })
  } catch (error) {
    console.error("Get files error:", error)
    res.status(500).json({ error: "Could not retrieve files" })
  }
})

// Download/view file
app.get("/api/files/:fileId", requireAuth, (req, res) => {
  try {
    const fileId = Number.parseFloat(req.params.fileId)
    const files = getFiles()
    const file = files.find((f) => f.id === fileId && f.uploadedBy === req.session.user.id)

    if (!file) {
      return res.status(404).json({ error: "File not found" })
    }

    const filePath = path.resolve(file.path)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on disk" })
    }

    res.setHeader("Content-Type", file.mimetype)
    res.setHeader("Content-Disposition", `inline; filename="${file.originalName}"`)

    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
  } catch (error) {
    console.error("Download error:", error)
    res.status(500).json({ error: "Could not download file" })
  }
})

// Delete file
app.delete("/api/files/:fileId", requireAuth, (req, res) => {
  try {
    const fileId = Number.parseFloat(req.params.fileId)
    const files = getFiles()
    const fileIndex = files.findIndex((f) => f.id === fileId && f.uploadedBy === req.session.user.id)

    if (fileIndex === -1) {
      return res.status(404).json({ error: "File not found" })
    }

    const file = files[fileIndex]

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }

    // Remove from database
    files.splice(fileIndex, 1)
    saveFiles(files)

    res.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    res.status(500).json({ error: "Could not delete file" })
  }
})

// Get all files (for admin roles)
app.get("/api/admin/files", requireAuth, (req, res) => {
  try {
    const userRole = req.session.user.role
    const adminRoles = ["collector", "sdm", "adg", "oic"]

    if (!adminRoles.includes(userRole)) {
      return res.status(403).json({ error: "Access denied" })
    }

    const files = getFiles()

    // Remove sensitive path information
    const safeFiles = files.map((file) => ({
      id: file.id,
      originalName: file.originalName,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: file.uploadedBy,
      uploadedByName: file.uploadedByName,
      uploadedAt: file.uploadedAt,
      type: file.type,
    }))

    res.json({ files: safeFiles })
  } catch (error) {
    console.error("Get admin files error:", error)
    res.status(500).json({ error: "Could not retrieve files" })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 10MB." })
    }
  }

  if (error.message === "Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.") {
    return res.status(400).json({ error: error.message })
  }

  console.error("Unhandled error:", error)
  res.status(500).json({ error: "Internal server error" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Project Rahat Backend running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log("\nDefault users:")
  console.log("- Username: tehsildar1, Password: password123")
  console.log("- Username: collector1, Password: password123")
  console.log("- Username: sdm1, Password: password123")
})
