import React, { useState, useEffect } from 'react';
import InputBox from '../components/InputBox';
import SuggestionDropdown from '../components/SuggestionDropdown';
import { Search, Clock, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { enhancedDictionary } from '../data/mockData';

interface Suggestion {
  word: string;
  score: number;
  type: 'autocomplete' | 'spellcheck';
}

const UserDashboard = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { user } = useAuth();

  // Trie implementation for autocomplete
  class TrieNode {
    children: Map<string, TrieNode> = new Map();
    isEndOfWord: boolean = false;
    frequency: number = 0;
  }

  class Trie {
    root: TrieNode = new TrieNode();

    insert(word: string, frequency: number = 1) {
      let current = this.root;
      for (const char of word.toLowerCase()) {
        if (!current.children.has(char)) {
          current.children.set(char, new TrieNode());
        }
        current = current.children.get(char)!;
      }
      current.isEndOfWord = true;
      current.frequency = frequency;
    }

    search(prefix: string): string[] {
      let current = this.root;
      for (const char of prefix.toLowerCase()) {
        if (!current.children.has(char)) {
          return [];
        }
        current = current.children.get(char)!;
      }
      
      const results: Array<{word: string, frequency: number}> = [];
      this.dfs(current, prefix.toLowerCase(), results);
      
      return results
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10)
        .map(item => item.word);
    }

    private dfs(node: TrieNode, prefix: string, results: Array<{word: string, frequency: number}>) {
      if (node.isEndOfWord) {
        results.push({ word: prefix, frequency: node.frequency });
      }
      
      for (const [char, childNode] of node.children) {
        this.dfs(childNode, prefix + char, results);
      }
    }
  }

  // Edit distance algorithm for spell checking
  const calculateEditDistance = (word1: string, word2: string): number => {
    const dp = Array(word1.length + 1).fill(null).map(() => 
      Array(word2.length + 1).fill(0)
    );

    for (let i = 0; i <= word1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= word2.length; j++) dp[0][j] = j;

    for (let i = 1; i <= word1.length; i++) {
      for (let j = 1; j <= word2.length; j++) {
        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],
            dp[i][j - 1], 
            dp[i - 1][j - 1]
          );
        }
      }
    }

    return dp[word1.length][word2.length];
  };

  // Sample dictionary - in production this would come from Supabase
  const dictionary = [
    'javascript', 'python', 'typescript', 'react', 'angular', 'vue', 'node', 
    'express', 'database', 'algorithm', 'function', 'component', 'interface',
    'programming', 'development', 'application', 'framework', 'library',
    'autocomplete', 'spellcheck', 'suggestion', 'search', 'filter', 'sort'
  ];

  const trie = new Trie();

  useEffect(() => {
    // Initialize trie with dictionary
    enhancedDictionary.forEach((word, index) => {
      trie.insert(word, enhancedDictionary.length - index);
    });
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Try autocomplete first
      const autocompleteResults = trie.search(searchQuery);
      
      if (autocompleteResults.length > 0) {
        const suggestions = autocompleteResults.map(word => ({
          word,
          score: 1.0,
          type: 'autocomplete' as const
        }));
        setSuggestions(suggestions);
      } else {
        // Fallback to spell checking
        const spellCheckResults = enhancedDictionary
          .map(word => ({
            word,
            distance: calculateEditDistance(searchQuery.toLowerCase(), word.toLowerCase())
          }))
          .filter(item => item.distance <= 2)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5)
          .map(item => ({
            word: item.word,
            score: 1 - (item.distance / searchQuery.length),
            type: 'spellcheck' as const
          }));
          
        setSuggestions(spellCheckResults);
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

        <div className="grid md:grid-cols-2 gap-8">
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
              <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <strong>Trie-based Autocomplete:</strong> Ultra-fast prefix matching for instant suggestions
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                <div>
                  <strong>Edit Distance Fallback:</strong> Smart spell checking when no matches found
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
    </div>
  );
};

export default UserDashboard;