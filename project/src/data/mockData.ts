// Mock data for demonstration purposes

export interface QueryLog {
  id: string;
  query: string;
  type: 'autocomplete' | 'spellcheck';
  userId: string;
  timestamp: string;
  responseTime: number;
  suggestions: string[];
}

export interface UploadRecord {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  wordsCount: number;
  status: 'success' | 'failed' | 'processing';
  uploadedBy: string;
  errorMessage?: string;
}

export interface UserActivity {
  userId: string;
  userName: string;
  email: string;
  queriesCount: number;
  lastActive: string;
  avgResponseTime: number;
  favoriteQueries: string[];
}

// Mock query logs
export const mockQueryLogs: QueryLog[] = [
  {
    id: '1',
    query: 'javascript',
    type: 'autocomplete',
    userId: '2',
    timestamp: '2024-01-21T10:30:00Z',
    responseTime: 45,
    suggestions: ['javascript', 'java', 'javadoc']
  },
  {
    id: '2',
    query: 'python',
    type: 'autocomplete',
    userId: '3',
    timestamp: '2024-01-21T10:25:00Z',
    responseTime: 38,
    suggestions: ['python', 'pythonic', 'pytorch']
  },
  {
    id: '3',
    query: 'algoritm',
    type: 'spellcheck',
    userId: '2',
    timestamp: '2024-01-21T10:20:00Z',
    responseTime: 67,
    suggestions: ['algorithm', 'algorithms', 'algorithmic']
  },
  {
    id: '4',
    query: 'developement',
    type: 'spellcheck',
    userId: '4',
    timestamp: '2024-01-21T10:15:00Z',
    responseTime: 52,
    suggestions: ['development', 'developer', 'developing']
  },
  {
    id: '5',
    query: 'react',
    type: 'autocomplete',
    userId: '3',
    timestamp: '2024-01-21T10:10:00Z',
    responseTime: 41,
    suggestions: ['react', 'reactive', 'reactor']
  }
];

// Mock upload records
export const mockUploadRecords: UploadRecord[] = [
  {
    id: '1',
    fileName: 'programming_terms.json',
    uploadDate: '2024-01-21T10:30:00Z',
    fileSize: 245760,
    wordsCount: 1284,
    status: 'success',
    uploadedBy: 'admin@autospell.com'
  },
  {
    id: '2',
    fileName: 'technical_dictionary.csv',
    uploadDate: '2024-01-20T15:45:00Z',
    fileSize: 892340,
    wordsCount: 4567,
    status: 'success',
    uploadedBy: 'admin@autospell.com'
  },
  {
    id: '3',
    fileName: 'common_words.json',
    uploadDate: '2024-01-19T09:15:00Z',
    fileSize: 156789,
    wordsCount: 0,
    status: 'failed',
    uploadedBy: 'admin@autospell.com',
    errorMessage: 'Invalid JSON format'
  },
  {
    id: '4',
    fileName: 'medical_terms.csv',
    uploadDate: '2024-01-18T14:20:00Z',
    fileSize: 534210,
    wordsCount: 2891,
    status: 'success',
    uploadedBy: 'admin@autospell.com'
  },
  {
    id: '5',
    fileName: 'legal_glossary.json',
    uploadDate: '2024-01-17T11:00:00Z',
    fileSize: 678934,
    wordsCount: 3456,
    status: 'success',
    uploadedBy: 'admin@autospell.com'
  }
];

// Mock user activity data
export const mockUserActivity: UserActivity[] = [
  {
    userId: '2',
    userName: 'John Doe',
    email: 'user@example.com',
    queriesCount: 156,
    lastActive: '2024-01-21T10:30:00Z',
    avgResponseTime: 45,
    favoriteQueries: ['javascript', 'react', 'typescript']
  },
  {
    userId: '3',
    userName: 'Sarah Wilson',
    email: 'sarah@example.com',
    queriesCount: 89,
    lastActive: '2024-01-20T16:45:00Z',
    avgResponseTime: 52,
    favoriteQueries: ['python', 'django', 'flask']
  },
  {
    userId: '4',
    userName: 'Mike Johnson',
    email: 'mike@example.com',
    queriesCount: 234,
    lastActive: '2024-01-19T14:20:00Z',
    avgResponseTime: 38,
    favoriteQueries: ['algorithm', 'development', 'programming']
  }
];

// Mock analytics data
export const mockAnalytics = {
  totalQueries: 15432,
  totalUsers: 1284,
  avgResponseTime: 45,
  successRate: 94.7,
  topQueries: [
    { query: 'javascript', count: 890, type: 'autocomplete' },
    { query: 'python', count: 756, type: 'autocomplete' },
    { query: 'algoritm', count: 234, type: 'spellcheck' },
    { query: 'developement', count: 189, type: 'spellcheck' },
    { query: 'framwork', count: 156, type: 'spellcheck' }
  ],
  commonTypos: [
    { original: 'algoritm', correction: 'algorithm', count: 234 },
    { original: 'developement', correction: 'development', count: 189 },
    { original: 'framwork', correction: 'framework', count: 156 },
    { original: 'progaming', correction: 'programming', count: 98 },
    { original: 'databse', correction: 'database', count: 87 }
  ],
  dailyUsage: [
    { date: '2024-01-15', queries: 1234 },
    { date: '2024-01-16', queries: 1456 },
    { date: '2024-01-17', queries: 1678 },
    { date: '2024-01-18', queries: 1345 },
    { date: '2024-01-19', queries: 1567 },
    { date: '2024-01-20', queries: 1789 },
    { date: '2024-01-21', queries: 1432 }
  ],
  userGrowth: [
    { month: 'Jul', users: 450 },
    { month: 'Aug', users: 520 },
    { month: 'Sep', users: 680 },
    { month: 'Oct', users: 890 },
    { month: 'Nov', users: 1120 },
    { month: 'Dec', users: 1284 }
  ]
};

// Note: Enhanced dictionary moved to dictionaryLoader.ts for better organization
// and to simulate real Kaggle dataset integration
