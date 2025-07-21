# Moses AutoMall Intranet Portal v0.1

An internal company intranet portal with Azure Active Directory SSO authentication, designed specifically for Moses AutoMall employees.

## 🚀 Features

### 🔐 Authentication
- **Azure AD SSO Integration** - Automatic login via workstation credentials
- **Role-based Access Control** - Admin, Manager, Employee roles
- **Session Management** - Secure session handling

### 📚 Training Center
- Assign training modules to users
- Track completion progress
- Required vs. optional training distinction
- Due date management

### 📅 Event Management
- Company events calendar
- RSVP functionality
- Department-specific filtering

### 📁 Document Portal
- Google Drive integration for company documents
- Folder browsing and file access
- Process manual repository integration

### ⚙️ Admin Panel
- User management and role assignment
- Training assignment system
- System statistics and activity monitoring
- Announcement creation

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Azure MSAL** for authentication

### Backend
- **Node.js Express** with TypeScript
- **Azure MSAL Node** for server-side auth
- **Google APIs** for Drive integration
- **PostgreSQL** (ready for database implementation)
- **Express Session** for session management

## 📋 Prerequisites

- Node.js 16+ and npm
- Azure Active Directory app registration
- Google Cloud service account (for Drive integration)
- PostgreSQL database (optional, for persistent data)

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Configuration

#### Backend Configuration
Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Server Configuration
PORT=3301
NODE_ENV=development
FRONTEND_URL=http://localhost:3302

# Session Security
SESSION_SECRET=your-strong-secret-key

# Azure Active Directory
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id
AZURE_REDIRECT_URI=http://localhost:3301/api/auth/callback

# Google Drive Integration
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./config/google-service-account.json
GOOGLE_DRIVE_FOLDER_ID=1akqWgdC9xM04iEkp2WW970_ZmEAmRVdX
```

#### Frontend Configuration
Copy `frontend/.env.example` to `frontend/.env` and configure:

```env
REACT_APP_API_URL=http://localhost:3301/api
REACT_APP_AZURE_CLIENT_ID=your-azure-client-id
REACT_APP_AZURE_TENANT_ID=your-azure-tenant-id
```

### 3. Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Configure:
   - **Name**: Moses AutoMall Intranet Portal
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: `http://localhost:3301/api/auth/callback`
5. After creation, note the **Application (client) ID** and **Directory (tenant) ID**
6. Go to **Certificates & secrets** and create a new client secret
7. In **API permissions**, add **Microsoft Graph** permissions:
   - `User.Read`
   - `profile`
   - `openid`
   - `email`

### 4. Google Drive Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Google Drive API**
4. Create a **Service Account** and download the JSON key file
5. Place the key file in `backend/config/google-service-account.json`
6. Share your Google Drive folder with the service account email

### 5. Running the Application

#### Development Mode

Start both frontend and backend in development mode:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3302
- Backend API: http://localhost:3301
- Health Check: http://localhost:3301/health

#### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
moses-portal-v0.1/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services and config
│   │   └── ...
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Express backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic services
│   │   ├── config/          # Configuration files
│   │   └── index.ts         # Main server file
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── copilot-instructions.md
└── README.md
```

## 🔒 Security Notes

- This application is designed for **internal use only**
- Deploy behind corporate firewall or VPN
- Regularly update Azure AD app credentials
- Monitor session security in production
- Implement proper HTTPS in production environment

## 🤝 Contributing

1. Follow the coding standards outlined in `.github/copilot-instructions.md`
2. Use TypeScript for all new code
3. Ensure mobile responsiveness
4. Test authentication flows thoroughly
5. Document any new features or configuration changes

## 📞 Support

For technical support or questions:
- **IT Support**: it@mosesautonet.com
- **Internal Documentation**: Available in the Documents section after login

## 📝 License

This project is proprietary software for Moses AutoMall internal use only.

---

**Moses AutoMall Intranet Portal** - Streamlining internal communications and processes.
