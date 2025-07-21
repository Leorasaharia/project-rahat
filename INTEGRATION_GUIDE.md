# Project Rahat - Frontend-Backend Integration Guide

## 🔗 Complete Integration Overview

This guide shows how the Next.js frontend integrates with the Node.js backend to create a seamless government portal experience.

## 🏗️ Architecture Integration

### Frontend → Backend Communication Flow

\`\`\`
Next.js Frontend (Port 3000) ←→ Express Backend (Port 3001)
\`\`\`

### Key Integration Points

1. **Authentication Flow**
2. **File Upload Process**
3. **Data Synchronization**
4. **Session Management**
5. **Error Handling**

## 🔐 Authentication Integration

### Frontend Login Component
\`\`\`typescript
// app/login/page.tsx - Login form submission
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important for session cookies
      body: JSON.stringify({ username, password, role: selectedRole })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      // Store user data locally
      localStorage.setItem('userProfile', JSON.stringify(data.user))
      localStorage.setItem('userRole', selectedRole)
      
      // Redirect to dashboard
      router.push(`/dashboard/${selectedRole}`)
    } else {
      setError(data.error)
    }
  } catch (error) {
    setError('Login failed')
  }
}
\`\`\`

### Backend Authentication Handler
\`\`\`javascript
// server.js - Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body
  
  // Validate credentials
  const user = users.find(u => u.username === username)
  const isValid = await bcrypt.compare(password, user.password)
  
  if (isValid) {
    // Create session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    }
    
    res.json({ message: 'Login successful', user: req.session.user })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})
\`\`\`

## 📁 File Upload Integration

### Frontend Upload Component
\`\`\`typescript
// components/FileUpload.tsx
const handleFileUpload = async (files: FileList) => {
  const formData = new FormData()
  
  Array.from(files).forEach(file => {
    formData.append('files', file)
  })
  
  try {
    const response = await fetch('http://localhost:3001/api/files/upload', {
      method: 'POST',
      credentials: 'include', // Include session cookie
      body: formData // Don't set Content-Type, let browser set it
    })
    
    const result = await response.json()
    
    if (response.ok) {
      setUploadedFiles(prev => [...prev, ...result.files])
      setAlertMessage('Files uploaded successfully!')
    } else {
      setError(result.error)
    }
  } catch (error) {
    setError('Upload failed')
  }
}
\`\`\`

### Backend Upload Handler
\`\`\`javascript
// server.js - File upload endpoint
app.post('/api/files/upload', requireAuth, upload.array('files', 5), (req, res) => {
  const files = getFiles()
  const uploadedFiles = []
  
  req.files.forEach(file => {
    const fileRecord = {
      id: Date.now() + Math.random(),
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploadedBy: req.session.user.id,
      uploadedAt: new Date().toISOString(),
      path: file.path
    }
    
    files.push(fileRecord)
    uploadedFiles.push(fileRecord)
  })
  
  saveFiles(files)
  res.json({ message: 'Files uploaded successfully', files: uploadedFiles })
})
\`\`\`

## 🔄 Data Synchronization

### Frontend Data Fetching
\`\`\`typescript
// hooks/useFiles.ts - Custom hook for file management
export const useFiles = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  
  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/files', {
        credentials: 'include'
      })
      
      const data = await response.json()
      setFiles(data.files)
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        setFiles(prev => prev.filter(file => file.id !== fileId))
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }
  
  return { files, loading, fetchFiles, deleteFile }
}
\`\`\`

### Backend Data Management
\`\`\`javascript
// server.js - File management endpoints
app.get('/api/files', requireAuth, (req, res) => {
  const files = getFiles()
  const userFiles = files.filter(file => file.uploadedBy === req.session.user.id)
  
  // Remove sensitive information
  const safeFiles = userFiles.map(file => ({
    id: file.id,
    originalName: file.originalName,
    mimetype: file.mimetype,
    size: file.size,
    uploadedAt: file.uploadedAt
  }))
  
  res.json({ files: safeFiles })
})

app.delete('/api/files/:fileId', requireAuth, (req, res) => {
  const fileId = parseFloat(req.params.fileId)
  const files = getFiles()
  const fileIndex = files.findIndex(f => f.id === fileId && f.uploadedBy === req.session.user.id)
  
  if (fileIndex !== -1) {
    const file = files[fileIndex]
    
    // Delete from filesystem
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path)
    }
    
    // Remove from database
    files.splice(fileIndex, 1)
    saveFiles(files)
    
    res.json({ message: 'File deleted successfully' })
  } else {
    res.status(404).json({ error: 'File not found' })
  }
})
\`\`\`

## 🛡️ Session Management Integration

### Frontend Session Handling
\`\`\`typescript
// lib/auth.ts - Authentication utilities
export const checkAuthStatus = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/me', {
      credentials: 'include'
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.user
    } else {
      // Session expired, redirect to login
      localStorage.removeItem('userProfile')
      localStorage.removeItem('userRole')
      window.location.href = '/login'
      return null
    }
  } catch (error) {
    console.error('Auth check failed:', error)
    return null
  }
}

export const logout = async () => {
  try {
    await fetch('http://localhost:3001/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    localStorage.removeItem('userProfile')
    localStorage.removeItem('userRole')
    window.location.href = '/login'
  }
}
\`\`\`

### Backend Session Validation
\`\`\`javascript
// server.js - Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}

// Session info endpoint
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user })
})

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' })
    }
    res.json({ message: 'Logout successful' })
  })
})
\`\`\`

## 🚨 Error Handling Integration

### Frontend Error Handling
\`\`\`typescript
// utils/api.ts - API utility with error handling
export const apiCall = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`http://localhost:3001${url}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('userProfile')
        window.location.href = '/login'
        throw new Error('Session expired')
      }
      throw new Error(data.error || 'Request failed')
    }
    
    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}
\`\`\`

### Backend Error Handling
\`\`\`javascript
// server.js - Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error)
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' })
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message })
  }
  
  res.status(500).json({ error: 'Internal server error' })
})
\`\`\`

## 🔧 Development Setup

### Environment Configuration
\`\`\`bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=Project Rahat

# Backend (.env)
PORT=3001
SESSION_SECRET=project-rahat-secret-key
UPLOAD_DIR=./uploads
NODE_ENV=development
\`\`\`

### CORS Configuration
\`\`\`javascript
// server.js - CORS setup for development
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
\`\`\`

## 🚀 Production Deployment

### Frontend Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Backend Production
\`\`\`bash
NODE_ENV=production npm start
\`\`\`

### Environment Variables (Production)
\`\`\`bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.projectrahat.gov.in

# Backend
PORT=3001
SESSION_SECRET=your-secure-secret-key
NODE_ENV=production
UPLOAD_DIR=/var/uploads
\`\`\`

## 📊 Integration Testing

### Test Authentication Flow
\`\`\`javascript
// test/integration.test.js
const request = require('supertest')
const app = require('../server')

describe('Authentication Integration', () => {
  test('Login and access protected route', async () => {
    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ username: 'tehsildar1', password: 'password123' })
      .expect(200)
    
    const cookies = loginResponse.headers['set-cookie']
    
    // Access protected route
    const filesResponse = await request(app)
      .get('/api/files')
      .set('Cookie', cookies)
      .expect(200)
    
    expect(filesResponse.body).toHaveProperty('files')
  })
})
\`\`\`

This integration guide demonstrates how the frontend and backend work together to provide a seamless, secure government portal experience with proper authentication, file management, and error handling.
