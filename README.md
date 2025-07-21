# AutoSpell Pro - Real-time Autocomplete and Spell Checker

A sophisticated web application that provides intelligent text assistance with real-time autocomplete and spell checking capabilities, powered by a comprehensive English dictionary dataset.

## Features

### Core Functionality
- **Real-time Autocomplete**: Ultra-fast prefix matching using Trie data structure
- **Intelligent Spell Checking**: Edit distance algorithm for smart corrections
- **Comprehensive Dictionary**: Based on real English dictionary data with frequency analysis
- **Dual-mode Operation**: Seamless switching between autocomplete and spell check

### User Experience
- **Keyboard Navigation**: Full arrow key and Enter support
- **Visual Feedback**: Color-coded suggestions with frequency indicators
- **Recent Searches**: Track and quick-access to previous queries
- **Responsive Design**: Optimized for all device sizes

### Admin Features
- **Dictionary Management**: Upload and manage word databases
- **Analytics Dashboard**: Comprehensive usage statistics and insights
- **Upload History**: Track all dictionary file uploads
- **User Activity Monitoring**: Real-time user behavior analysis

### Technical Highlights
- **Trie-based Search**: O(m) time complexity for prefix matching
- **Edit Distance Algorithm**: Levenshtein distance for spell correction
- **Frequency-based Ranking**: Results sorted by word usage frequency
- **Word Commonality Classification**: Common, uncommon, and rare word categories

## Dictionary Data

The application uses a comprehensive English dictionary system that includes:

- **Expandable dictionary** starting with 100+ carefully curated words
- **CSV/JSON upload support** for adding custom dictionaries up to 20MB
- **Live integration** - uploaded words immediately available for autocomplete
- **Frequency analysis** based on common usage statistics
- **Word classification** (common, uncommon, rare)
- **Technical and academic terms** for specialized use cases
- **Common misspellings** and their corrections
- **Duplicate handling** - automatically merges words with higher frequency data

### Data Structure
Each dictionary entry contains:
```typescript
interface DictionaryWord {
  word: string;           // The actual word
  frequency: number;      // Usage frequency (higher = more common)
  length: number;         // Character count
  commonality: 'common' | 'uncommon' | 'rare';  // Classification
}
```

### Supported Upload Formats

**CSV Format:**
```csv
word,frequency,commonality
algorithm,8000,uncommon
javascript,5000,uncommon
programming,6000,uncommon
```

**JSON Format:**
```json
[
  {"word": "algorithm", "frequency": 8000, "commonality": "uncommon"},
  {"word": "javascript", "frequency": 5000, "commonality": "uncommon"}
]
```

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Authentication**: Custom context-based auth

## Architecture

### Data Structures
- **Trie (Prefix Tree)**: Efficient autocomplete with O(m) lookup time
- **Edit Distance Matrix**: Dynamic programming for spell correction
- **Frequency Indexing**: Optimized ranking system

### Components
- **InputBox**: Smart input with loading states
- **SuggestionDropdown**: Interactive suggestion display
- **DictionaryTrie**: Core search engine
- **StatsViewer**: Analytics and insights dashboard

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

### For Users
1. **Login** with demo credentials:
   - User: `user@example.com` / `user123`
   - Admin: `admin@autospell.com` / `admin123`

2. **Start Typing** in the search box to see real-time suggestions

3. **Navigate** suggestions using arrow keys and Enter

4. **View Statistics** to see dictionary insights and usage patterns

### For Administrators
1. **Upload Dictionaries**: Add CSV or JSON files with word data
   - Support for files up to 20MB
   - Real-time processing and integration
   - Automatic word validation and deduplication
2. **Monitor Analytics**: Track usage patterns and performance
3. **Manage Users**: View user activity and system statistics
4. **Live Dictionary Updates**: See uploaded words immediately in suggestions

## API Integration Notes

While this demo uses a simulated dataset, the architecture is designed to easily integrate with the Kaggle English Dictionary dataset using the provided API code:

```python
import kagglehub
from kagglehub import KaggleDatasetAdapter

# Load the latest version
df = kagglehub.load_dataset(
  KaggleDatasetAdapter.PANDAS,
  "kaleidawave/english-dictionary",
  file_path,
)
```

The `dictionaryLoader.ts` file can be modified to fetch data from a backend API that uses this Kaggle integration.

## Performance Optimizations

- **Trie Structure**: O(m) autocomplete lookup time
- **Duplicate Prevention**: Efficient word deduplication during upload
- **Real-time Updates**: Live dictionary integration without restart
- **Debounced Search**: Prevents excessive API calls
- **Memoized Results**: Caches frequent queries
- **Lazy Loading**: Components load on demand
- **Optimized Rendering**: Minimal re-renders with React best practices
- **Large File Handling**: Efficient processing of files up to 20MB

## Future Enhancements

- **Real Kaggle Integration**: Direct API connection to live dataset
- **Batch Upload Processing**: Background processing for very large files
- **Dictionary Versioning**: Track and manage dictionary changes over time
- **Machine Learning**: AI-powered suggestion ranking
- **Multi-language Support**: International dictionary support
- **Custom Dictionaries**: User-specific word collections
- **Advanced Analytics**: Deeper usage insights and patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
