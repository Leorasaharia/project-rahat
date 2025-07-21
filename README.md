# Rahat

**Rahat** is a React-based frontend application built for Project Rahat, an initiative by the Government of Chhattisgarh, Collectorate Raipur. The app facilitates role-based dashboards and workflows for officers like Tehsildar, SDM, Rahat Operator, OIC, ADG, and Collector to manage applicant data and approvals related to relief operations.

---

## Features

- **Role-Based Access**: Separate dashboards for Tehsildar and other approval roles.
- **Protected Routes**: Only authenticated users can access dashboards and profile pages.
- **Applicant Management**: Tehsildar can add applicants, upload verification documents, and submit applications.
- **Multi-Level Approval Workflow**: Applications move through approval stages handled by different officer roles.
- **File Upload Support**: Upload finding reports and post-mortem reports in PDF, JPG, PNG formats.
- **Profile Management**: Users can view and edit their profiles securely.
- **Responsive UI**: Clean and modern interface built with Tailwind CSS and Lucide icons.

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Backend API providing user authentication, role management, and application workflows

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/rahat-project.git
   cd rahat project
   ````

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**

   Visit [http://localhost:3000](http://localhost:3000) to access the app.

---

## Usage

* The app requires a `user` object containing at least the `role` property for access control.
* `ProtectedRoute` component protects private pages by checking if a user is logged in.
* Replace the dummy authentication logic with your own backend or API calls.
* Pass user data as props to dashboards and components.

## Dependencies

* React 18+
* React Router DOM v6+
* Tailwind CSS
* Lucide React Icons

---

## License

This project is licensed under the MIT License.


