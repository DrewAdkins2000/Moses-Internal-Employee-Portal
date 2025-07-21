import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { google } from 'googleapis';

const router = Router();

// Google Drive service setup
const initializeDriveService = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  });
  
  return google.drive({ version: 'v3', auth });
};

// Get documents from Google Drive folder
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const drive = initializeDriveService();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1akqWgdC9xM04iEkp2WW970_ZmEAmRVdX';
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)',
      orderBy: 'name'
    });
    
    const documents = response.data.files?.map(file => ({
      id: file.id,
      name: file.name,
      type: file.mimeType,
      lastModified: file.modifiedTime,
      size: file.size,
      viewLink: file.webViewLink
    })) || [];
    
    res.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    
    // Fallback mock data for development
    const mockDocuments = [
      {
        id: 'mock-1',
        name: 'Employee Handbook.pdf',
        type: 'application/pdf',
        lastModified: '2025-07-01T10:00:00Z',
        size: '2048000',
        viewLink: '#'
      },
      {
        id: 'mock-2',
        name: 'Safety Procedures.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        lastModified: '2025-07-15T14:30:00Z',
        size: '1024000',
        viewLink: '#'
      }
    ];
    
    res.json({ 
      documents: mockDocuments,
      note: 'Using mock data - configure Google Drive API for live data'
    });
  }
});

// Get folders from Google Drive
router.get('/folders', requireAuth, async (req: Request, res: Response) => {
  try {
    const drive = initializeDriveService();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '1akqWgdC9xM04iEkp2WW970_ZmEAmRVdX';
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, modifiedTime)',
      orderBy: 'name'
    });
    
    const folders = response.data.files?.map(folder => ({
      id: folder.id,
      name: folder.name,
      lastModified: folder.modifiedTime
    })) || [];
    
    res.json({ folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    
    // Fallback mock data
    const mockFolders = [
      { id: 'mock-folder-1', name: 'HR Documents', lastModified: '2025-07-01T10:00:00Z' },
      { id: 'mock-folder-2', name: 'Training Materials', lastModified: '2025-07-10T15:00:00Z' },
      { id: 'mock-folder-3', name: 'Policies', lastModified: '2025-07-05T09:30:00Z' }
    ];
    
    res.json({ 
      folders: mockFolders,
      note: 'Using mock data - configure Google Drive API for live data'
    });
  }
});

// Get files from a specific folder
router.get('/folders/:folderId', requireAuth, async (req: Request, res: Response) => {
  try {
    const drive = initializeDriveService();
    const { folderId } = req.params;
    
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink)',
      orderBy: 'name'
    });
    
    const documents = response.data.files?.map(file => ({
      id: file.id,
      name: file.name,
      type: file.mimeType,
      lastModified: file.modifiedTime,
      size: file.size,
      viewLink: file.webViewLink
    })) || [];
    
    res.json({ documents });
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    res.status(500).json({ message: 'Error fetching folder contents' });
  }
});

export { router as documentsRouter };
