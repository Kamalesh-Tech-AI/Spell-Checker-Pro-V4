import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  wordsCount?: number;
  error?: string;
}

const AdminUploader = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => 
      file.type === 'application/json' || 
      file.name.endsWith('.csv') || 
      file.name.endsWith('.json')
    );

    if (validFiles.length !== fileList.length) {
      alert('Please upload only CSV or JSON files');
    }

    for (const file of validFiles) {
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading'
      };

      setFiles(prev => [...prev, newFile]);

      try {
        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Parse file content
        const content = await file.text();
        let wordsCount = 0;

        if (file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          wordsCount = Array.isArray(data) ? data.length : Object.keys(data).length;
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter(line => line.trim());
          wordsCount = lines.length - 1; // Exclude header
        }

        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'success', wordsCount }
            : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', error: 'Failed to process file' }
            : f
        ));
      }
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dictionary Upload
        </h2>
        <p className="text-gray-600">
          Upload CSV or JSON files to expand the autocomplete dictionary
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <div className="space-y-4">
          <div className={`
            mx-auto w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-gray-500 mb-4">
              Supports CSV and JSON files up to 10MB
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
              <FileText className="h-5 w-5 mr-2" />
              Choose Files
              <input
                type="file"
                multiple
                accept=".csv,.json"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Upload Queue ({files.length})
          </h3>
          
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${file.status === 'success' ? 'bg-green-100' :
                      file.status === 'error' ? 'bg-red-100' : 'bg-blue-100'}
                  `}>
                    {file.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : file.status === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      {file.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.wordsCount && (
                        <span>{file.wordsCount.toLocaleString()} words</span>
                      )}
                      {file.error && (
                        <span className="text-red-600">{file.error}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">File Format Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>CSV:</strong> First column should contain words, with optional frequency in second column</li>
          <li>• <strong>JSON:</strong> Array of strings or objects with 'word' and 'frequency' properties</li>
          <li>• Files are processed asynchronously and added to the main dictionary</li>
          <li>• Duplicate words will be merged with updated frequencies</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminUploader;