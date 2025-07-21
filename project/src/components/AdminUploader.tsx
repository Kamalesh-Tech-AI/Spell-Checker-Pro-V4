import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Database } from 'lucide-react';
import { dictionaryTrie, DictionaryWord } from '../data/dictionaryLoader';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'success' | 'error';
  wordsCount?: number;
  addedWords?: number;
  skippedWords?: number;
  error?: string;
  progress?: number;
}

interface CSVRow {
  word: string;
  frequency?: number;
  commonality?: 'common' | 'uncommon' | 'rare';
}

const AdminUploader = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [totalWordsAdded, setTotalWordsAdded] = useState(0);

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

  const parseCSVContent = (content: string): CSVRow[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const rows: CSVRow[] = [];
    
    // Skip header if it exists
    const startIndex = lines[0]?.toLowerCase().includes('word') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV parsing with potential commas in quoted fields
      const columns = line.split(',').map(col => col.trim().replace(/^["']|["']$/g, ''));
      
      if (columns.length >= 1 && columns[0]) {
        const word = columns[0].toLowerCase().trim();
        const frequency = columns[1] ? parseInt(columns[1]) || 1000 : 1000;
        
        // Determine commonality based on frequency or explicit column
        let commonality: 'common' | 'uncommon' | 'rare' = 'uncommon';
        if (columns[2]) {
          const explicitCommonality = columns[2].toLowerCase();
          if (['common', 'uncommon', 'rare'].includes(explicitCommonality)) {
            commonality = explicitCommonality as 'common' | 'uncommon' | 'rare';
          }
        } else {
          // Auto-determine based on frequency
          if (frequency > 10000) commonality = 'common';
          else if (frequency < 1000) commonality = 'rare';
        }
        
        rows.push({ word, frequency, commonality });
      }
    }
    
    return rows;
  };

  const parseJSONContent = (content: string): CSVRow[] => {
    try {
      const data = JSON.parse(content);
      const rows: CSVRow[] = [];
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (typeof item === 'string') {
            rows.push({ word: item.toLowerCase().trim(), frequency: 1000, commonality: 'uncommon' });
          } else if (item && typeof item === 'object') {
            const word = (item.word || item.text || item.term)?.toLowerCase().trim();
            if (word) {
              const frequency = parseInt(item.frequency || item.count || item.freq) || 1000;
              let commonality: 'common' | 'uncommon' | 'rare' = 'uncommon';
              
              if (item.commonality && ['common', 'uncommon', 'rare'].includes(item.commonality)) {
                commonality = item.commonality;
              } else {
                if (frequency > 10000) commonality = 'common';
                else if (frequency < 1000) commonality = 'rare';
              }
              
              rows.push({ word, frequency, commonality });
            }
          }
        });
      } else if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          const word = key.toLowerCase().trim();
          const frequency = typeof value === 'number' ? value : 1000;
          let commonality: 'common' | 'uncommon' | 'rare' = 'uncommon';
          
          if (frequency > 10000) commonality = 'common';
          else if (frequency < 1000) commonality = 'rare';
          
          rows.push({ word, frequency, commonality });
        });
      }
      
      return rows;
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const addWordsToDictionary = (words: CSVRow[]): { added: number; skipped: number } => {
    let added = 0;
    let skipped = 0;
    
    words.forEach(({ word, frequency, commonality }) => {
      // Validate word (only letters, basic punctuation)
      if (!/^[a-zA-Z][a-zA-Z\-']*[a-zA-Z]?$/.test(word) || word.length < 2 || word.length > 50) {
        skipped++;
        return;
      }
      
      const wordData: DictionaryWord = {
        word,
        frequency: frequency || 1000,
        length: word.length,
        commonality: commonality || 'uncommon'
      };
      
      // Add to the trie (this will update the live dictionary)
      dictionaryTrie.insert(wordData);
      added++;
    });
    
    return { added, skipped };
  };

  const handleFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      const isValidType = file.type === 'application/json' || 
                         file.name.endsWith('.csv') || 
                         file.name.endsWith('.json') ||
                         file.type === 'text/csv';
      const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB limit
      
      if (!isValidType) {
        alert(`${file.name}: Please upload only CSV or JSON files`);
        return false;
      }
      
      if (!isValidSize) {
        alert(`${file.name}: File size must be under 20MB`);
        return false;
      }
      
      return true;
    });

    for (const file of validFiles) {
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, newFile]);

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        }

        // Change status to processing
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f
        ));

        // Read and parse file content
        const content = await file.text();
        let parsedWords: CSVRow[] = [];

        if (file.name.endsWith('.csv') || file.type === 'text/csv') {
          parsedWords = parseCSVContent(content);
        } else if (file.name.endsWith('.json') || file.type === 'application/json') {
          parsedWords = parseJSONContent(content);
        }

        if (parsedWords.length === 0) {
          throw new Error('No valid words found in file');
        }

        // Add words to dictionary
        const { added, skipped } = addWordsToDictionary(parsedWords);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'success', 
                wordsCount: parsedWords.length,
                addedWords: added,
                skippedWords: skipped
              }
            : f
        ));

        setTotalWordsAdded(prev => prev + added);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', error: errorMessage }
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

  const getStatusIcon = (file: UploadedFile) => {
    switch (file.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <Database className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'uploading':
        return <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const currentStats = dictionaryTrie.getStats();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dictionary Upload
        </h2>
        <p className="text-gray-600">
          Upload CSV or JSON files to expand the autocomplete dictionary (up to 20MB)
        </p>
      </div>

      {/* Current Dictionary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Live Dictionary Status</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">{currentStats.totalWords.toLocaleString()}</div>
            <div className="text-sm text-blue-700">Total Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-900">{currentStats.commonWords.toLocaleString()}</div>
            <div className="text-sm text-green-700">Common</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-900">{currentStats.uncommonWords.toLocaleString()}</div>
            <div className="text-sm text-orange-700">Uncommon</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-900">{totalWordsAdded.toLocaleString()}</div>
            <div className="text-sm text-red-700">Added Today</div>
          </div>
        </div>
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
              Supports CSV and JSON files up to 20MB
            </p>
            
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
              <FileText className="h-5 w-5 mr-2" />
              Choose Files
              <input
                type="file"
                multiple
                accept=".csv,.json,text/csv,application/json"
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
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`
                    p-2 rounded-lg
                    ${file.status === 'success' ? 'bg-green-100' :
                      file.status === 'error' ? 'bg-red-100' : 
                      file.status === 'processing' ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    {getStatusIcon(file)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <span className="text-sm text-blue-600">({file.progress}%)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.wordsCount && (
                        <span>{file.wordsCount.toLocaleString()} words processed</span>
                      )}
                      {file.addedWords !== undefined && (
                        <span className="text-green-600">
                          +{file.addedWords.toLocaleString()} added
                        </span>
                      )}
                      {file.skippedWords !== undefined && file.skippedWords > 0 && (
                        <span className="text-orange-600">
                          {file.skippedWords.toLocaleString()} skipped
                        </span>
                      )}
                      {file.error && (
                        <span className="text-red-600">{file.error}</span>
                      )}
                    </div>
                    
                    {/* Progress bar for uploading files */}
                    {file.status === 'uploading' && file.progress !== undefined && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    )}
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
          <li>• <strong>CSV Format:</strong> word,frequency,commonality (header optional)</li>
          <li>• <strong>JSON Format:</strong> Array of objects with 'word', 'frequency', 'commonality' properties</li>
          <li>• <strong>Frequency:</strong> Higher numbers = more common words (auto-classified if not specified)</li>
          <li>• <strong>Commonality:</strong> 'common', 'uncommon', or 'rare' (auto-determined from frequency)</li>
          <li>• <strong>Live Integration:</strong> Words are immediately available for autocomplete after upload</li>
          <li>• <strong>Validation:</strong> Only valid English words (2-50 chars, letters/hyphens/apostrophes)</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">Example CSV Format</h4>
        <pre className="text-sm text-green-800 bg-white p-3 rounded border">
{`word,frequency,commonality
algorithm,8000,uncommon
javascript,5000,uncommon
programming,6000,uncommon
development,12000,common`}
        </pre>
      </div>
    </div>
  );
};

export default AdminUploader;
