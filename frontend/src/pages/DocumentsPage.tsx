import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Document {
  id: string;
  name: string;
  type: string;
  lastModified: string;
  size: string;
  viewLink: string;
}

interface Folder {
  id: string;
  name: string;
  lastModified: string;
}

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('list');

  useEffect(() => {
    fetchDocuments();
    fetchFolders();
  }, []);

  const fetchDocuments = async (folderId?: string) => {
    try {
      const response = folderId 
        ? await apiService.documents.getFolderContents(folderId)
        : await apiService.documents.getAll();
      setDocuments((response.data as any).documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await apiService.documents.getFolders();
      setFolders((response.data as any).folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleFolderClick = async (folderId: string, folderName: string) => {
    setCurrentFolder(folderName);
    setLoading(true);
    await fetchDocuments(folderId);
  };

  const handleBackClick = () => {
    setCurrentFolder(null);
    setLoading(true);
    fetchDocuments();
  };

  const getFileTypeIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📈';
    if (mimeType.includes('image')) return '🖼️';
    return '📁';
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return <div className="p-6">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Documents</h1>
            <p className="text-gray-600">
              Access company policies, procedures, and process manuals.
            </p>
            {currentFolder && (
              <div className="flex items-center mt-2">
                <button
                  onClick={handleBackClick}
                  className="text-moses-blue hover:text-blue-700 text-sm flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to root
                </button>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm text-gray-600">{currentFolder}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md ${view === 'list' ? 'bg-moses-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-md ${view === 'grid' ? 'bg-moses-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Folders */}
      {!currentFolder && folders.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderClick(folder.id, folder.name)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200 text-left"
                >
                  <span className="text-2xl">📁</span>
                  <div>
                    <p className="font-medium text-gray-900">{folder.name}</p>
                    <p className="text-sm text-gray-500">
                      Modified {new Date(folder.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Documents */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentFolder ? `Documents in ${currentFolder}` : 'Recent Documents'}
          </h2>
        </div>
        
        {documents.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No documents found.</p>
          </div>
        ) : view === 'list' ? (
          <div className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <DocumentListItem key={doc.id} document={doc} getFileTypeIcon={getFileTypeIcon} formatFileSize={formatFileSize} />
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {documents.map((doc) => (
                <DocumentGridItem key={doc.id} document={doc} getFileTypeIcon={getFileTypeIcon} formatFileSize={formatFileSize} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DocumentItemProps {
  document: Document;
  getFileTypeIcon: (mimeType: string) => string;
  formatFileSize: (bytes: string) => string;
}

const DocumentListItem: React.FC<DocumentItemProps> = ({ document, getFileTypeIcon, formatFileSize }) => (
  <div className="p-6 hover:bg-gray-50 transition duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-2xl">{getFileTypeIcon(document.type)}</span>
        <div>
          <h3 className="font-medium text-gray-900">{document.name}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
            <span>Modified {new Date(document.lastModified).toLocaleDateString()}</span>
            {document.size && <span>{formatFileSize(document.size)}</span>}
          </div>
        </div>
      </div>
      
      <a
        href={document.viewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-moses-blue hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
      >
        View
      </a>
    </div>
  </div>
);

const DocumentGridItem: React.FC<DocumentItemProps> = ({ document, getFileTypeIcon, formatFileSize }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
    <div className="text-center mb-3">
      <span className="text-4xl">{getFileTypeIcon(document.type)}</span>
    </div>
    <h3 className="font-medium text-gray-900 text-sm mb-2 truncate" title={document.name}>
      {document.name}
    </h3>
    <div className="text-xs text-gray-500 mb-3">
      <p>Modified {new Date(document.lastModified).toLocaleDateString()}</p>
      {document.size && <p>{formatFileSize(document.size)}</p>}
    </div>
    <a
      href={document.viewLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-moses-blue hover:bg-blue-700 text-white text-center py-2 rounded-md text-sm font-medium transition duration-200"
    >
      View
    </a>
  </div>
);

export default DocumentsPage;
