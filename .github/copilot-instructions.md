<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Moses AutoMall Intranet Portal - Development Guidelines

## Project Overview
This is an internal company intranet portal for Moses AutoMall with Azure AD SSO authentication, built using React (frontend) and Node.js Express (backend).

## Architecture
- **Frontend**: React 18 with TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js Express with TypeScript, Azure MSAL authentication
- **Authentication**: Azure Active Directory SSO integration
- **Database**: PostgreSQL (configured but not yet implemented)
- **External APIs**: Google Drive API for document management

## Key Features
1. **Azure AD SSO Authentication** - Automatic login via workstation credentials
2. **Training Center** - Assign and track employee training completion
3. **Event Management** - Company events with RSVP functionality
4. **Document Portal** - Google Drive integration for company documents
5. **Admin Panel** - User management and system administration
6. **Role-based Access Control** - Admin, Manager, Employee roles

## Development Standards
- Use TypeScript for all new code
- Follow React hooks pattern for state management
- Use Tailwind CSS for styling with the custom Moses AutoMall color scheme
- Implement proper error handling and loading states
- Ensure mobile-responsive design
- Follow RESTful API conventions for backend endpoints

## Security Considerations
- This is an internal-only application for LAN/VPN users
- Implement proper session management
- Validate user permissions for all admin operations
- Sanitize all user inputs

## Color Scheme
- Primary Blue: `moses-blue` (#1e40af)
- Light Gray: `moses-light` (#f3f4f6)
- Additional colors defined in tailwind.config.js

## API Endpoints Structure
- `/api/auth/*` - Authentication routes
- `/api/users/*` - User management
- `/api/training/*` - Training modules
- `/api/events/*` - Event management
- `/api/documents/*` - Document access
- `/api/admin/*` - Administrative functions

## Environment Setup
- Backend runs on port 3001
- Frontend runs on port 3000
- Uses session-based authentication with Azure AD integration
