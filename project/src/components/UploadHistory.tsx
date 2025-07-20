import React, { useState } from 'react';
import { Calendar, FileText, CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react';
import { mockUploadRecords } from '../data/mockData';


const UploadHistory = () => {
  const [uploads] = useState(mockUploadRecords);

  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUploads = uploads
    .filter(upload => filterStatus === 'all' || upload.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'size':
          return b.fileSize - a.fileSize;
        case 'date':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalWords = uploads
    .filter(upload => upload.status === 'success')
    .reduce((sum, upload) => sum + upload.wordsCount, 0);

  const successfulUploads = uploads.filter(upload => upload.status === 'success').length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload History
        </h2>
        <p className="text-gray-600">
          Track and manage all dictionary file uploads
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{uploads.length}</div>
              <div className="text-sm text-blue-700">Total Uploads</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{successfulUploads}</div>
              <div className="text-sm text-green-700">Successful</div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{totalWords.toLocaleString()}</div>
              <div className="text-sm text-purple-700">Total Words</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Upload Date</option>
              <option value="name">File Name</option>
              <option value="size">File Size</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Words
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUploads.map((upload) => (
                <tr key={upload.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(upload.status)}
                      <div>
                        <div className="font-medium text-gray-900">{upload.fileName}</div>
                        <div className="text-sm text-gray-500">{upload.uploadedBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(upload.uploadDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(upload.fileSize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {upload.status === 'success' ? upload.wordsCount.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(upload.status)}
                    {upload.errorMessage && (
                      <div className="text-xs text-red-600 mt-1">{upload.errorMessage}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadHistory;