/**
 * Demo Script: Project Rahat Complete Workflow
 * This script demonstrates the complete workflow of the Project Rahat system
 */

const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")
const path = require("path")

const BASE_URL = "http://localhost:3001"

// Demo workflow function
async function demonstrateWorkflow() {
  console.log("🏛️  Project Rahat - Complete Workflow Demo")
  console.log("=".repeat(50))

  try {
    // Step 1: Health Check
    console.log("\n1️⃣  Checking Backend Health...")
    const healthResponse = await axios.get(`${BASE_URL}/api/health`)
    console.log("✅ Backend Status:", healthResponse.data.message)

    // Step 2: User Authentication
    console.log("\n2️⃣  Authenticating Tehsildar User...")
    const loginResponse = await axios.post(
      `${BASE_URL}/api/auth/login`,
      {
        username: "tehsildar1",
        password: "password123",
      },
      {
        withCredentials: true,
      },
    )

    const sessionCookie = loginResponse.headers["set-cookie"]
    console.log("✅ Login Successful:", loginResponse.data.user.name)
    console.log("   Role:", loginResponse.data.user.role)

    // Step 3: Get Current User
    console.log("\n3️⃣  Verifying Session...")
    const userResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: {
        Cookie: sessionCookie,
      },
    })
    console.log("✅ Session Valid for:", userResponse.data.user.name)

    // Step 4: Create Demo Files for Upload
    console.log("\n4️⃣  Creating Demo Files...")
    const demoDir = "./demo-files"
    if (!fs.existsSync(demoDir)) {
      fs.mkdirSync(demoDir)
    }

    // Create a demo PDF content
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Demo Finding Report) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`

    fs.writeFileSync(path.join(demoDir, "finding-report.pdf"), pdfContent)

    // Create a simple image file (1x1 PNG)
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00, 0x0c, 0x49,
      0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ])

    fs.writeFileSync(path.join(demoDir, "postmortem-report.png"), pngBuffer)
    console.log("✅ Demo files created")

    // Step 5: Upload Files
    console.log("\n5️⃣  Uploading Documents...")
    const formData = new FormData()
    formData.append("files", fs.createReadStream(path.join(demoDir, "finding-report.pdf")))
    formData.append("files", fs.createReadStream(path.join(demoDir, "postmortem-report.png")))

    const uploadResponse = await axios.post(`${BASE_URL}/api/files/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        Cookie: sessionCookie,
      },
    })

    console.log("✅ Files Uploaded Successfully:")
    uploadResponse.data.files.forEach((file) => {
      console.log(`   - ${file.originalName} (${file.type})`)
    })

    // Step 6: List Uploaded Files
    console.log("\n6️⃣  Retrieving File List...")
    const filesResponse = await axios.get(`${BASE_URL}/api/files`, {
      headers: {
        Cookie: sessionCookie,
      },
    })

    console.log("✅ User Files:")
    filesResponse.data.files.forEach((file) => {
      console.log(`   - ${file.originalName}`)
      console.log(`     Size: ${(file.size / 1024).toFixed(2)} KB`)
      console.log(`     Uploaded: ${new Date(file.uploadedAt).toLocaleString()}`)
    })

    // Step 7: Download a File
    if (filesResponse.data.files.length > 0) {
      console.log("\n7️⃣  Testing File Download...")
      const firstFile = filesResponse.data.files[0]

      const downloadResponse = await axios.get(`${BASE_URL}/api/files/${firstFile.id}`, {
        headers: {
          Cookie: sessionCookie,
        },
        responseType: "stream",
      })

      console.log("✅ File Download Successful")
      console.log(`   Content-Type: ${downloadResponse.headers["content-type"]}`)
      console.log(`   Content-Disposition: ${downloadResponse.headers["content-disposition"]}`)
    }

    // Step 8: Test Admin Access (Login as Collector)
    console.log("\n8️⃣  Testing Admin Access (Collector)...")
    const adminLoginResponse = await axios.post(
      `${BASE_URL}/api/auth/login`,
      {
        username: "collector1",
        password: "password123",
      },
      {
        withCredentials: true,
      },
    )

    const adminSessionCookie = adminLoginResponse.headers["set-cookie"]
    console.log("✅ Admin Login Successful:", adminLoginResponse.data.user.name)

    const adminFilesResponse = await axios.get(`${BASE_URL}/api/admin/files`, {
      headers: {
        Cookie: adminSessionCookie,
      },
    })

    console.log("✅ Admin can view all files:")
    adminFilesResponse.data.files.forEach((file) => {
      console.log(`   - ${file.originalName} (uploaded by: ${file.uploadedByName})`)
    })

    // Step 9: Logout
    console.log("\n9️⃣  Logging Out...")
    await axios.post(
      `${BASE_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Cookie: adminSessionCookie,
        },
      },
    )
    console.log("✅ Logout Successful")

    // Cleanup
    console.log("\n🧹 Cleaning up demo files...")
    fs.rmSync(demoDir, { recursive: true, force: true })
    console.log("✅ Cleanup Complete")

    console.log("\n🎉 Demo Workflow Completed Successfully!")
    console.log("\nKey Features Demonstrated:")
    console.log("- ✅ User Authentication & Session Management")
    console.log("- ✅ File Upload with Validation")
    console.log("- ✅ File Storage & Organization")
    console.log("- ✅ File Retrieval & Download")
    console.log("- ✅ Role-based Access Control")
    console.log("- ✅ Admin Permissions")
    console.log("- ✅ Secure Logout")
  } catch (error) {
    console.error("❌ Demo Error:", error.response?.data || error.message)
    console.log("\n💡 Make sure the backend server is running on port 3001")
    console.log("   Run: npm run dev (in backend directory)")
  }
}

// Run the demo if this script is executed directly
if (require.main === module) {
  demonstrateWorkflow()
}

module.exports = { demonstrateWorkflow }
