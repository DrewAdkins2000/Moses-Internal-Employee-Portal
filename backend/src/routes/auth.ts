import { Router, Request, Response } from 'express';
import { ConfidentialClientApplication } from '@azure/msal-node';
import os from 'os';
import '../types/session'; // Import session type declarations

const router = Router();

// Azure AD MSAL Configuration
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    clientSecret: process.env.AZURE_CLIENT_SECRET || '',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}`
  }
};

// Only create MSAL instance if credentials are properly configured
let pca: ConfidentialClientApplication | null = null;
const isAzureConfigured = process.env.AZURE_CLIENT_ID && 
                         process.env.AZURE_CLIENT_SECRET && 
                         process.env.AZURE_TENANT_ID &&
                         process.env.AZURE_CLIENT_ID !== 'not-configured';

if (isAzureConfigured) {
  pca = new ConfidentialClientApplication(msalConfig);
} else {
  console.warn('⚠️  Azure AD not configured. Using development mode with mock authentication.');
}

// Login endpoint - initiates Azure AD authentication
router.get('/login', async (req: Request, res: Response) => {
  try {
    if (!pca) {
      // Development mode - create mock user session
      if (req.session) {
        (req.session as any).user = {
          id: 'dev-user-1',
          email: 'drewadkins@mosesautonet.com',
          name: 'Drew Adkins (Dev Mode)',
          roles: ['Admin', 'Manager']
        };
      }
      return res.redirect(process.env.FRONTEND_URL || 'http://localhost:3302');
    }

    const authCodeUrlParameters = {
      scopes: ['user.read', 'profile', 'openid', 'email'],
      redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3301/api/auth/callback',
    };

    const authUrl = await pca.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Authentication initiation failed' });
  }
});

// Callback endpoint - handles Azure AD response
router.get('/callback', async (req: Request, res: Response) => {
  try {
    if (!pca) {
      return res.status(500).json({ message: 'Azure AD not configured' });
    }

    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ message: 'Authorization code not provided' });
    }

    const tokenRequest = {
      code: code as string,
      scopes: ['user.read', 'profile', 'openid', 'email'],
      redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3301/api/auth/callback',
    };

    const response = await pca.acquireTokenByCode(tokenRequest);
    
    // Store user info in session
    if (req.session) {
      (req.session as any).user = {
        id: response.account?.localAccountId,
        email: response.account?.username,
        name: response.account?.name,
        roles: ['Employee'] // Default role, can be enhanced with Azure AD groups
      };
    }

    // Redirect to frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:3302');
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ message: 'Authentication callback failed' });
  }
});

// Get current user info
router.get('/me', (req: Request, res: Response) => {
  if (req.session && (req.session as any).user) {
    res.json({ user: (req.session as any).user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Debug endpoint to test session and CORS
router.get('/debug', (req: Request, res: Response) => {
  console.log('🔍 Debug endpoint called');
  console.log('Headers:', req.headers);
  console.log('Session:', req.session);
  console.log('User agent:', req.get('User-Agent'));
  
  res.json({
    message: 'Debug endpoint working',
    hasSession: !!req.session,
    sessionId: req.session?.id,
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

// Auto-login using Windows authentication
router.post('/auto-login', (req: Request, res: Response) => {
  try {
    // Get the current Windows user
    const userInfo = os.userInfo();
    const windowsUsername = userInfo.username;
    const computerName = os.hostname();
    
    console.log(`🔍 Auto-login attempt for Windows user: ${windowsUsername} on ${computerName}`);
    
    // Format name as "Firstname Lastname" from username like "drewadkins" or "firstnamelastname"
    const formatDisplayName = (username: string): string => {
      // Handle known users with proper formatting
      const knownUsers: { [key: string]: string } = {
        'drewadkins': 'Drew Adkins',
        'johnsmith': 'John Smith',
        'maryjohnson': 'Mary Johnson',
        // Add more known users as needed
      };
      
      // Check if it's a known user first
      if (knownUsers[username.toLowerCase()]) {
        return knownUsers[username.toLowerCase()];
      }
      
      // For unknown users, try to split the name intelligently
      // This is a basic implementation - you might want to enhance it
      const lowerUsername = username.toLowerCase();
      
      // If username has a pattern like "firstlast", try to split it
      // This is approximate - you may need to adjust based on your naming patterns
      if (lowerUsername.length > 6) {
        // Try common first name lengths (3-6 characters)
        const commonFirstNames = ['john', 'mary', 'mike', 'lisa', 'dave', 'jane', 'paul', 'anna', 'mark', 'sara'];
        for (const firstName of commonFirstNames) {
          if (lowerUsername.startsWith(firstName)) {
            const lastName = lowerUsername.substring(firstName.length);
            return `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`;
          }
        }
        
        // Fallback: split roughly in the middle
        const midPoint = Math.floor(lowerUsername.length / 2);
        const firstName = lowerUsername.substring(0, midPoint);
        const lastName = lowerUsername.substring(midPoint);
        return `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`;
      }
      
      // Fallback: just capitalize the username
      return username.charAt(0).toUpperCase() + username.slice(1);
    };
    
    // Create user profile based on Windows username
    const user = {
      id: `win-${windowsUsername}`,
      email: `${windowsUsername}@mosesautonet.com`,
      name: formatDisplayName(windowsUsername),
      roles: ['Employee'], // Default role, can be customized based on username
      windowsUser: windowsUsername,
      computerName: computerName,
      loginMethod: 'windows-auto'
    };

    // Assign admin roles to specific users (customize as needed)
    const adminUsers = ['drewadkins', 'administrator', 'admin'];
    if (adminUsers.includes(windowsUsername.toLowerCase())) {
      user.roles = ['Admin', 'Manager', 'Employee'];
    }

    // Create session
    if (req.session) {
      (req.session as any).user = user;
    }

    console.log(`✅ Auto-login successful for ${user.name} (${user.email})`);

    res.json({ 
      success: true, 
      user: user,
      message: `Automatically signed in as ${user.name}`
    });
  } catch (error: any) {
    console.error('❌ Auto-login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to authenticate with Windows credentials',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  } else {
    res.json({ message: 'Not logged in' });
  }
});

export { router as authRouter };
