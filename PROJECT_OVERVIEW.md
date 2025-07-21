# Project Rahat - Complete System Overview

## 🏛️ System Architecture

Project Rahat is a government portal for managing death compensation cases under the RBC4 Policy. The system consists of:

### Frontend (Next.js)
- **Landing Page**: Public portal with government branding
- **Authentication**: Role-based login system
- **Dashboards**: Specialized interfaces for different government roles
- **File Management**: Document upload and management interface
- **Multilingual Support**: English and Hindi language support

### Backend (Node.js + Express)
- **Authentication API**: Session-based user management
- **File Upload API**: Secure document storage
- **File Management**: Download, view, and delete operations
- **Role-based Access**: Different permissions for different roles

## 🔄 Complete Workflow

### 1. User Authentication Flow
\`\`\`
User Login → Backend Validation → Session Creation → Dashboard Access
\`\`\`

**Frontend Process:**
1. User selects role and enters credentials on `/login`
2. Form submits to backend `/api/auth/login`
3. Backend validates credentials and creates session
4. Frontend redirects to appropriate dashboard

**Backend Process:**
1. Receives login request with username/password
2. Validates against stored user data (`data/users.json`)
3. Creates secure session with user information
4. Returns user data and session cookie

### 2. File Upload Workflow
\`\`\`
Document Selection → Upload to Backend → File Storage → Database Update → UI Refresh
\`\`\`

**Frontend Process:**
1. Tehsildar selects PDF/image files in dashboard
2. Files sent via multipart form to `/api/files/upload`
3. Upload progress shown to user
4. Success/error feedback displayed

**Backend Process:**
1. Receives files via multer middleware
2. Validates file types (PDF, JPG, PNG only)
3. Stores files in organized folder structure
4. Updates file metadata in `data/files.json`
5. Returns upload confirmation

### 3. File Management Workflow
\`\`\`
File List Request → Backend Query → File Metadata → Display in UI
\`\`\`

**Frontend Process:**
1. Dashboard requests file list from `/api/files`
2. Displays files in organized table/grid
3. Provides download/view/delete actions

**Backend Process:**
1. Queries user's files from database
2. Returns sanitized file metadata (no sensitive paths)
3. Handles download requests with proper headers

## 🗂️ File System Structure

\`\`\`
project-rahat/
├── Frontend (Next.js)
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── login/page.tsx           # Authentication
│   │   ├── about/page.tsx           # About page
│   │   ├── rbc4-policy/page.tsx     # Policy information
│   │   └── dashboard/
│   │       ├── tehsildar/page.tsx   # Tehsildar dashboard
│   │       ├── collector/page.tsx   # Collector dashboard
│   │       ├── sdm/page.tsx         # SDM dashboard
│   │       ├── oic/page.tsx         # OIC dashboard
│   │       ├── adg/page.tsx         # ADG dashboard
│   │       └── rahat-operator/page.tsx
│   ├── components/
│   │   ├── ProfileModal.tsx         # User profile management
│   │   ├── ProfileSetupModal.tsx    # First-time setup
│   │   └── LanguageToggle.tsx       # Language switcher
│   ├── lib/
│   │   ├── auth.ts                  # Authentication utilities
│   │   └── i18n.ts                  # Internationalization
│   └── hooks/
│       └── useLanguage.ts           # Language hook
│
├── Backend (Node.js)
│   ├── server.js                    # Main server file
│   ├── data/
│   │   ├── users.json              # User database
│   │   └── files.json              # File metadata
│   ├── uploads/
│   │   ├── documents/              # PDF files
│   │   └── images/                 # Image files
│   └── sessions/                   # Session storage
│
└── Configuration
    ├── package.json                # Dependencies
    ├── next.config.mjs            # Next.js config
    └── tailwind.config.ts         # Styling config
\`\`\`

## 👥 User Roles & Permissions

### Tehsildar
- **Primary Role**: Data entry and initial processing
- **Permissions**: 
  - Upload documents (Finding reports, Post-mortem reports)
  - Add new applicant cases
  - View own uploaded files
  - Manage case status (Pending → Completed → Send to SDM)

### SDM (Sub Divisional Magistrate)
- **Primary Role**: Review and approve cases
- **Permissions**:
  - View all cases from Tehsildars
  - Approve/reject applications
  - Access all uploaded documents
  - Forward cases to higher authorities

### Collector
- **Primary Role**: Final approval and payment processing
- **Permissions**:
  - View all cases in district
  - Final approval authority
  - Payment approval and processing
  - Generate reports

### OIC (Officer In-Charge)
- **Primary Role**: Oversight and monitoring
- **Permissions**:
  - Monitor case progress
  - View all documents
  - Generate status reports

### ADG (Additional District Magistrate)
- **Primary Role**: Administrative oversight
- **Permissions**:
  - Administrative review
  - Policy compliance monitoring
  - High-level reporting

### Rahat Operator
- **Primary Role**: System operation and support
- **Permissions**:
  - Technical support
  - System maintenance
  - User assistance

## 🔐 Security Implementation

### Authentication Security
\`\`\`javascript
// Password hashing
const hashedPassword = bcrypt.hashSync(password, 10)

// Session management
app.use(session({
  store: new FileStore(),
  secret: 'project-rahat-secret-key',
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}))

// Route protection
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}
\`\`\`

### File Upload Security
\`\`\`javascript
// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'), false)
  }
}

// File size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})
\`\`\`

## 📊 Data Flow Diagram

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  File System    │
│   (Next.js)     │    │   (Express)     │    │   (Local)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Login Request      │                       │
         ├──────────────────────►│                       │
         │                       │ 2. Validate User     │
         │                       ├──────────────────────►│
         │                       │                       │
         │ 3. Session Created    │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
         │ 4. File Upload        │                       │
         ├──────────────────────►│                       │
         │                       │ 5. Store File        │
         │                       ├──────────────────────►│
         │                       │                       │
         │ 6. Upload Success     │                       │
         │◄──────────────────────┤                       │
         │                       │                       │
         │ 7. Request File List  │                       │
         ├──────────────────────►│                       │
         │                       │ 8. Query Files       │
         │                       ├──────────────────────►│
         │                       │                       │
         │ 9. File Metadata      │                       │
         │◄──────────────────────┤                       │
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Frontend Setup
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
\`\`\`

### Backend Setup
\`\`\`bash
# Install backend dependencies
npm install

# Start backend server
npm run dev

# Access at http://localhost:3001
\`\`\`

### Default Login Credentials
\`\`\`
Tehsildar: tehsildar1 / password123
Collector: collector1 / password123
SDM: sdm1 / password123
\`\`\`

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### File Management
- `POST /api/files/upload` - Upload files
- `GET /api/files` - Get user's files
- `GET /api/files/:fileId` - Download/view file
- `DELETE /api/files/:fileId` - Delete file

### Admin Operations
- `GET /api/admin/files` - Get all files (admin only)

## 🌐 Frontend Features

### Multilingual Support
- English and Hindi language support
- Dynamic language switching
- Localized content for government terminology

### Responsive Design
- Mobile-friendly interface
- Government-standard color scheme
- Official emblems and branding

### User Experience
- Profile management system
- First-time setup wizard
- Real-time file upload progress
- Status tracking for applications

## 📈 Future Enhancements

### Planned Features
1. **Database Integration**: PostgreSQL/MySQL support
2. **Email Notifications**: Automated status updates
3. **Digital Signatures**: Document authentication
4. **Mobile App**: React Native application
5. **Analytics Dashboard**: Reporting and insights
6. **SMS Notifications**: Real-time updates
7. **Document Scanner**: Mobile document capture
8. **Audit Logging**: Complete action tracking

### Scalability Considerations
- Database migration path planned
- Microservices architecture ready
- Cloud deployment configuration
- Load balancing preparation

## 🛠️ Development Workflow

### Adding New Features
1. Update backend API endpoints
2. Create/modify frontend components
3. Update authentication/authorization
4. Test with different user roles
5. Update documentation

### File Upload Process
1. User selects files in dashboard
2. Frontend validates file types
3. Files sent to backend via FormData
4. Backend processes and stores files
5. Database updated with metadata
6. Success/error response to frontend
7. UI updated with new file list

This comprehensive system provides a secure, scalable foundation for government document management with role-based access control and multilingual support.
