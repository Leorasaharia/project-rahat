# Project Rahat Backend

A simple Node.js backend for the Project Rahat application with file-based storage and basic authentication.

## Features

- **Basic Authentication**: Session-based login system with bcrypt password hashing
- **File Upload**: Support for PDF documents and images (JPG, PNG)
- **File Management**: Upload, download, view, and delete files
- **Role-based Access**: Different access levels for different user roles
- **File Storage**: Local filesystem storage with organized folder structure
- **Session Management**: File-based session storage
- **CORS Support**: Cross-origin requests enabled for frontend integration

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the server:
   \`\`\`bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/me` - Get current user info

### File Management
- `POST /api/files/upload` - Upload files (requires authentication)
- `GET /api/files` - Get user's uploaded files
- `GET /api/files/:fileId` - Download/view specific file
- `DELETE /api/files/:fileId` - Delete specific file

### Admin Endpoints
- `GET /api/admin/files` - Get all files (admin roles only)

### Utility
- `GET /api/health` - Health check endpoint

## Default Users

The system comes with pre-configured users:

| Username | Password | Role | Email |
|----------|----------|------|-------|
| tehsildar1 | password123 | tehsildar | tehsildar1@gov.cg.in |
| collector1 | password123 | collector | collector1@gov.cg.in |
| sdm1 | password123 | sdm | sdm1@gov.cg.in |

## File Structure

\`\`\`
project-rahat-backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── data/                 # JSON data files
│   ├── users.json        # User data
│   └── files.json        # File metadata
├── uploads/              # Uploaded files
│   ├── documents/        # PDF files
│   └── images/          # Image files
└── sessions/            # Session data
\`\`\`

## Configuration

### Environment Variables
- `PORT` - Server port (default: 3001)

### File Upload Limits
- Maximum file size: 10MB
- Allowed file types: PDF, JPG, JPEG, PNG
- Maximum files per upload: 5

### Session Configuration
- Session TTL: 24 hours
- Session cleanup interval: 1 hour
- Session storage: File-based

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- File type validation
- File size limits
- Path traversal protection
- CORS configuration

## Usage Examples

### Login
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "tehsildar1", "password": "password123"}'
\`\`\`

### Upload File
\`\`\`bash
curl -X POST http://localhost:3001/api/files/upload \
  -H "Cookie: connect.sid=your-session-id" \
  -F "files=@document.pdf"
\`\`\`

### Get Files
\`\`\`bash
curl -X GET http://localhost:3001/api/files \
  -H "Cookie: connect.sid=your-session-id"
\`\`\`

## Development

For development, use:
\`\`\`bash
npm run dev
\`\`\`

This will start the server with nodemon for automatic restarts on file changes.

## Production Deployment

1. Set environment variables:
   \`\`\`bash
   export PORT=3001
   \`\`\`

2. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

## Extending the Backend

The backend is designed to be simple and extensible. You can:

1. Add more user roles in the `users.json` file
2. Implement additional file types by modifying the `fileFilter` function
3. Add more API endpoints for specific functionality
4. Integrate with external databases by replacing the file-based storage
5. Add email notifications or other integrations

## Error Handling

The backend includes comprehensive error handling for:
- Authentication errors
- File upload errors
- File not found errors
- Permission errors
- Server errors

All errors are returned in JSON format with appropriate HTTP status codes.
