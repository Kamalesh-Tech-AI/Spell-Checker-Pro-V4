import React, { useState, useEffect } from 'react';
import InputBox from '../components/InputBox';
import SuggestionDropdown from '../components/SuggestionDropdown';
import { Search, Clock, TrendingUp, User, Activity, Timer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dictionaryTrie, getSpellingSuggestions, DictionaryWord } from '../data/dictionaryLoader';

interface Suggestion {
  word: string;
  score: number;
  type: 'autocomplete' | 'spellcheck';
  frequency?: number;
  commonality?: string;
}

interface QueryPerformance {
  query: string;
  responseTime: number;
  timestamp: string;
  type: 'autocomplete' | 'spellcheck';
  suggestionsCount: number;
}
const UserDashboard = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [queryPerformance, setQueryPerformance] = useState<QueryPerformance[]>([]);

  const { user } = useAuth();

  // Get dictionary statistics for display
  const [dictionaryStats, setDictionaryStats] = useState(() => dictionaryTrie.getStats());

  // Update stats when dictionary changes
  useEffect(() => {
    const updateStats = () => {
      setDictionaryStats(dictionaryTrie.getStats());
    };
    
    // Update stats every 5 seconds to reflect any new uploads
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    const startTime = performance.now();
    
    try {
      // Try autocomplete first
      const autocompleteResults = dictionaryTrie.search(searchQuery, 8);
      
      if (autocompleteResults.length > 0) {
        const suggestions = autocompleteResults.map(wordData => ({
          word: wordData.word,
          score: wordData.frequency / 100000, // Normalize score
          type: 'autocomplete' as const,
          frequency: wordData.frequency,
          commonality: wordData.commonality
        }));
        setSuggestions(suggestions);
        
        const endTime = performance.now();
        const responseTime = Math.max(1, endTime - startTime); // Minimum 1ms for display
        
        // Add performance data
        setQueryPerformance(prev => [{
          query: searchQuery,
          responseTime,
          timestamp: new Date().toISOString(),
          type: 'autocomplete',
          suggestionsCount: suggestions.length
        }, ...prev.slice(0, 19)]); // Keep last 20 queries
      } else {
        // Fallback to spell checking
        const spellCheckResults = getSpellingSuggestions(searchQuery, 2, 5);
        
        const suggestions = spellCheckResults.map(wordData => ({
          word: wordData.word,
          score: wordData.frequency / 100000, // Normalize score
          type: 'spellcheck' as const,
          frequency: wordData.frequency,
          commonality: wordData.commonality
          }));
          
        setSuggestions(suggestions);
        
        const endTime = performance.now();
        const responseTime = Math.max(1, endTime - startTime); // Minimum 1ms for display
        
        // Add performance data
        setQueryPerformance(prev => [{
          query: searchQuery,
          responseTime,
          timestamp: new Date().toISOString(),
          type: 'spellcheck',
          suggestionsCount: suggestions.length
        }, ...prev.slice(0, 19)]); // Keep last 20 queries
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions(query);
    setSelectedIndex(-1);
  }, [query]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    setSelectedIndex(-1);
    
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [suggestion, ...prev.filter(s => s !== suggestion)].slice(0, 5);
      return updated;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionSelect(suggestions[selectedIndex].word);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-lg text-gray-600">Ready to enhance your writing with intelligent suggestions?</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="relative">
            <InputBox
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              placeholder="Start typing to see intelligent suggestions..."
              isLoading={isLoading}
            />
            
            <SuggestionDropdown
              suggestions={suggestions}
              selectedIndex={selectedIndex}
              onSuggestionSelect={handleSuggestionSelect}
              query={query}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-5 w-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
            </div>
            {recentSearches.length > 0 ? (
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(search)}
                    className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-gray-700"
                  >
                    {search}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent searches yet</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Dictionary Stats</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong className="text-gray-900">Total Words:</strong> 
                  <span className="text-gray-600"> {dictionaryStats.totalWords.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <div>
                  <strong className="text-gray-900">Common Words:</strong> 
                  <span className="text-gray-600"> {dictionaryStats.commonWords}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <strong className="text-gray-900">Avg Frequency:</strong> 
                  <span className="text-gray-600"> {dictionaryStats.avgFrequency.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <strong className="text-gray-900">Avg Length:</strong> 
                  <span className="text-gray-600"> {dictionaryStats.avgLength} chars</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Query Performance Table */}
        {queryPerformance.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Timer className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Query Performance</h3>
              </div>
              <div className="text-sm text-gray-500">
                Avg: {(queryPerformance.reduce((sum, q) => sum + q.responseTime, 0) / queryPerformance.length).toFixed(2)}ms
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Query
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suggestions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {queryPerformance.slice(0, 10).map((performance, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{performance.query}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <span className={`font-semibold ${
                            performance.responseTime < 50 ? 'text-green-600' :
                            performance.responseTime < 100 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {performance.responseTime.toFixed(2)}ms
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          performance.type === 'autocomplete' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {performance.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {performance.suggestionsCount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(performance.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {queryPerformance.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Showing latest 10 of {queryPerformance.length} queries
                </p>
              </div>
            )}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <strong>Trie-based Autocomplete:</strong> Ultra-fast prefix matching using real English dictionary data
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
              <div>
                <strong>Edit Distance Fallback:</strong> Smart spell checking with frequency-based ranking
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <strong>Keyboard Navigation:</strong> Use ↑↓ arrows and Enter to navigate suggestions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
