// Dictionary loader that simulates loading from Kaggle English Dictionary dataset
// In a real implementation, this would connect to your backend API that uses the Kaggle dataset

export interface DictionaryWord {
  word: string;
  frequency: number;
  length: number;
  commonality: 'common' | 'uncommon' | 'rare';
}

// Simulated comprehensive English dictionary based on common English words
// This represents what would be loaded from the Kaggle dataset
const COMPREHENSIVE_DICTIONARY: DictionaryWord[] = [
  // Common words (high frequency)
  { word: 'the', frequency: 100000, length: 3, commonality: 'common' },
  { word: 'and', frequency: 95000, length: 3, commonality: 'common' },
  { word: 'for', frequency: 90000, length: 3, commonality: 'common' },
  { word: 'are', frequency: 85000, length: 3, commonality: 'common' },
  { word: 'but', frequency: 80000, length: 3, commonality: 'common' },
  { word: 'not', frequency: 75000, length: 3, commonality: 'common' },
  { word: 'you', frequency: 70000, length: 3, commonality: 'common' },
  { word: 'all', frequency: 65000, length: 3, commonality: 'common' },
  { word: 'can', frequency: 60000, length: 3, commonality: 'common' },
  { word: 'had', frequency: 55000, length: 3, commonality: 'common' },
  { word: 'her', frequency: 50000, length: 3, commonality: 'common' },
  { word: 'was', frequency: 48000, length: 3, commonality: 'common' },
  { word: 'one', frequency: 45000, length: 3, commonality: 'common' },
  { word: 'our', frequency: 42000, length: 3, commonality: 'common' },
  { word: 'out', frequency: 40000, length: 3, commonality: 'common' },
  
  // 4-letter common words
  { word: 'that', frequency: 95000, length: 4, commonality: 'common' },
  { word: 'with', frequency: 85000, length: 4, commonality: 'common' },
  { word: 'have', frequency: 80000, length: 4, commonality: 'common' },
  { word: 'this', frequency: 75000, length: 4, commonality: 'common' },
  { word: 'will', frequency: 70000, length: 4, commonality: 'common' },
  { word: 'your', frequency: 65000, length: 4, commonality: 'common' },
  { word: 'from', frequency: 60000, length: 4, commonality: 'common' },
  { word: 'they', frequency: 55000, length: 4, commonality: 'common' },
  { word: 'know', frequency: 50000, length: 4, commonality: 'common' },
  { word: 'want', frequency: 45000, length: 4, commonality: 'common' },
  { word: 'been', frequency: 42000, length: 4, commonality: 'common' },
  { word: 'good', frequency: 40000, length: 4, commonality: 'common' },
  { word: 'much', frequency: 38000, length: 4, commonality: 'common' },
  { word: 'some', frequency: 35000, length: 4, commonality: 'common' },
  { word: 'time', frequency: 33000, length: 4, commonality: 'common' },
  { word: 'very', frequency: 30000, length: 4, commonality: 'common' },
  { word: 'when', frequency: 28000, length: 4, commonality: 'common' },
  { word: 'come', frequency: 25000, length: 4, commonality: 'common' },
  { word: 'here', frequency: 23000, length: 4, commonality: 'common' },
  { word: 'just', frequency: 20000, length: 4, commonality: 'common' },
  
  // 5+ letter common words
  { word: 'which', frequency: 70000, length: 5, commonality: 'common' },
  { word: 'their', frequency: 65000, length: 5, commonality: 'common' },
  { word: 'would', frequency: 60000, length: 5, commonality: 'common' },
  { word: 'there', frequency: 55000, length: 5, commonality: 'common' },
  { word: 'could', frequency: 50000, length: 5, commonality: 'common' },
  { word: 'other', frequency: 45000, length: 5, commonality: 'common' },
  { word: 'after', frequency: 40000, length: 5, commonality: 'common' },
  { word: 'first', frequency: 35000, length: 5, commonality: 'common' },
  { word: 'never', frequency: 30000, length: 5, commonality: 'common' },
  { word: 'these', frequency: 28000, length: 5, commonality: 'common' },
  { word: 'think', frequency: 25000, length: 5, commonality: 'common' },
  { word: 'where', frequency: 23000, length: 5, commonality: 'common' },
  { word: 'being', frequency: 20000, length: 5, commonality: 'common' },
  { word: 'every', frequency: 18000, length: 5, commonality: 'common' },
  { word: 'great', frequency: 15000, length: 5, commonality: 'common' },
  { word: 'might', frequency: 13000, length: 5, commonality: 'common' },
  { word: 'shall', frequency: 10000, length: 5, commonality: 'common' },
  
  // Programming and technical terms
  { word: 'algorithm', frequency: 8000, length: 9, commonality: 'uncommon' },
  { word: 'function', frequency: 12000, length: 8, commonality: 'common' },
  { word: 'variable', frequency: 7000, length: 8, commonality: 'uncommon' },
  { word: 'computer', frequency: 15000, length: 8, commonality: 'common' },
  { word: 'software', frequency: 10000, length: 8, commonality: 'common' },
  { word: 'hardware', frequency: 8000, length: 8, commonality: 'uncommon' },
  { word: 'internet', frequency: 20000, length: 8, commonality: 'common' },
  { word: 'website', frequency: 18000, length: 7, commonality: 'common' },
  { word: 'database', frequency: 9000, length: 8, commonality: 'uncommon' },
  { word: 'programming', frequency: 6000, length: 11, commonality: 'uncommon' },
  { word: 'development', frequency: 12000, length: 11, commonality: 'common' },
  { word: 'application', frequency: 15000, length: 11, commonality: 'common' },
  { word: 'technology', frequency: 18000, length: 10, commonality: 'common' },
  { word: 'javascript', frequency: 5000, length: 10, commonality: 'uncommon' },
  { word: 'python', frequency: 4500, length: 6, commonality: 'uncommon' },
  { word: 'typescript', frequency: 3000, length: 10, commonality: 'uncommon' },
  { word: 'framework', frequency: 6000, length: 9, commonality: 'uncommon' },
  { word: 'library', frequency: 8000, length: 7, commonality: 'uncommon' },
  { word: 'component', frequency: 7000, length: 9, commonality: 'uncommon' },
  { word: 'interface', frequency: 9000, length: 9, commonality: 'uncommon' },
  { word: 'autocomplete', frequency: 2000, length: 12, commonality: 'rare' },
  { word: 'spellcheck', frequency: 1500, length: 10, commonality: 'rare' },
  
  // Academic and professional terms
  { word: 'analysis', frequency: 12000, length: 8, commonality: 'common' },
  { word: 'research', frequency: 15000, length: 8, commonality: 'common' },
  { word: 'education', frequency: 18000, length: 9, commonality: 'common' },
  { word: 'university', frequency: 14000, length: 10, commonality: 'common' },
  { word: 'professor', frequency: 8000, length: 9, commonality: 'uncommon' },
  { word: 'student', frequency: 20000, length: 7, commonality: 'common' },
  { word: 'knowledge', frequency: 12000, length: 9, commonality: 'common' },
  { word: 'information', frequency: 25000, length: 11, commonality: 'common' },
  { word: 'communication', frequency: 10000, length: 13, commonality: 'common' },
  { word: 'organization', frequency: 12000, length: 12, commonality: 'common' },
  { word: 'management', frequency: 15000, length: 10, commonality: 'common' },
  { word: 'business', frequency: 22000, length: 8, commonality: 'common' },
  { word: 'professional', frequency: 11000, length: 12, commonality: 'common' },
  { word: 'experience', frequency: 18000, length: 10, commonality: 'common' },
  { word: 'opportunity', frequency: 13000, length: 11, commonality: 'common' },
  
  // Science and nature terms
  { word: 'science', frequency: 16000, length: 7, commonality: 'common' },
  { word: 'nature', frequency: 14000, length: 6, commonality: 'common' },
  { word: 'environment', frequency: 12000, length: 11, commonality: 'common' },
  { word: 'biology', frequency: 6000, length: 7, commonality: 'uncommon' },
  { word: 'chemistry', frequency: 5000, length: 9, commonality: 'uncommon' },
  { word: 'physics', frequency: 4000, length: 7, commonality: 'uncommon' },
  { word: 'mathematics', frequency: 7000, length: 11, commonality: 'uncommon' },
  { word: 'engineering', frequency: 8000, length: 11, commonality: 'uncommon' },
  { word: 'medicine', frequency: 10000, length: 8, commonality: 'common' },
  { word: 'health', frequency: 20000, length: 6, commonality: 'common' },
  
  // Arts and culture
  { word: 'music', frequency: 18000, length: 5, commonality: 'common' },
  { word: 'art', frequency: 16000, length: 3, commonality: 'common' },
  { word: 'culture', frequency: 12000, length: 7, commonality: 'common' },
  { word: 'history', frequency: 20000, length: 7, commonality: 'common' },
  { word: 'literature', frequency: 8000, length: 10, commonality: 'uncommon' },
  { word: 'philosophy', frequency: 6000, length: 10, commonality: 'uncommon' },
  { word: 'creative', frequency: 10000, length: 8, commonality: 'common' },
  { word: 'design', frequency: 15000, length: 6, commonality: 'common' },
  
  // Common misspellings and their corrections
  { word: 'receive', frequency: 8000, length: 7, commonality: 'common' },
  { word: 'achieve', frequency: 9000, length: 7, commonality: 'common' },
  { word: 'believe', frequency: 12000, length: 7, commonality: 'common' },
  { word: 'necessary', frequency: 10000, length: 9, commonality: 'common' },
  { word: 'separate', frequency: 7000, length: 8, commonality: 'common' },
  { word: 'definitely', frequency: 6000, length: 10, commonality: 'common' },
  { word: 'beginning', frequency: 8000, length: 9, commonality: 'common' },
  { word: 'occurred', frequency: 5000, length: 8, commonality: 'uncommon' },
  { word: 'recommend', frequency: 7000, length: 9, commonality: 'common' },
  { word: 'embarrass', frequency: 3000, length: 9, commonality: 'uncommon' },
];

// Trie implementation for efficient prefix matching
export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
  wordData: DictionaryWord | null = null;
}

export class DictionaryTrie {
  root: TrieNode = new TrieNode();
  private words: DictionaryWord[] = [];
  private wordMap: Map<string, DictionaryWord> = new Map();
  private searchCache: Map<string, DictionaryWord[]> = new Map();
  private maxCacheSize = 1000;

  constructor() {
    this.loadDictionary();
  }

  private loadDictionary() {
    // Simulate loading from Kaggle dataset
    this.words = [...COMPREHENSIVE_DICTIONARY];
    
    // Build trie structure
    this.words.forEach(wordData => {
      this.insert(wordData);
    });
  }

  insert(wordData: DictionaryWord) {
    // Clear cache when dictionary is modified
    this.clearCache();
    
    let current = this.root;
    const word = wordData.word.toLowerCase();
    
    // Check if word already exists and update if new frequency is higher
    const existingWord = this.wordMap.get(word);
    if (existingWord) {
      if (wordData.frequency > existingWord.frequency) {
        existingWord.frequency = wordData.frequency;
        existingWord.commonality = wordData.commonality;
      }
      return; // Don't add duplicate to trie
    }
    
    // Add to word map and words array
    this.wordMap.set(word, wordData);
    this.words.push(wordData);
    
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }
    
    current.isEndOfWord = true;
    current.wordData = wordData;
  }

  search(prefix: string, limit: number = 10): DictionaryWord[] {
    // Check cache first for ultra-fast response
    const cacheKey = `${prefix.toLowerCase()}_${limit}`;
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }

    let current = this.root;
    const lowerPrefix = prefix.toLowerCase();
    
    // Navigate to the prefix
    for (const char of lowerPrefix) {
      if (!current.children.has(char)) {
        const emptyResult: DictionaryWord[] = [];
        this.cacheResult(cacheKey, emptyResult);
        return emptyResult;
      }
      current = current.children.get(char)!;
    }
    
    // Collect all words with this prefix
    const results: DictionaryWord[] = [];
    this.dfs(current, lowerPrefix, results);
    
    // Sort by frequency (descending) and return limited results
    const finalResults = results
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
    
    // Cache the result for future queries
    this.cacheResult(cacheKey, finalResults);
    
    return finalResults;
  }

  private dfs(node: TrieNode, prefix: string, results: DictionaryWord[]) {
    // Early termination if we have enough results for common prefixes
    if (results.length >= 50) return;
    
    if (node.isEndOfWord && node.wordData) {
      results.push(node.wordData);
    }
    
    // Sort children by frequency for better early results
    const sortedChildren = Array.from(node.children.entries())
      .sort(([, a], [, b]) => {
        const aFreq = a.wordData?.frequency || 0;
        const bFreq = b.wordData?.frequency || 0;
        return bFreq - aFreq;
      });
    
    for (const [char, childNode] of sortedChildren) {
      if (results.length >= 50) break; // Early termination
      this.dfs(childNode, prefix + char, results);
    }
  }

  private cacheResult(key: string, result: DictionaryWord[]) {
    // Implement LRU cache with size limit
    if (this.searchCache.size >= this.maxCacheSize) {
      // Remove oldest entries (simple FIFO for performance)
      const firstKey = this.searchCache.keys().next().value;
      this.searchCache.delete(firstKey);
    }
    this.searchCache.set(key, [...result]); // Clone to prevent mutations
  }

  // Clear cache when dictionary is updated
  private clearCache() {
    this.searchCache.clear();
  }

  // Get all words for spell checking
  getAllWords(): DictionaryWord[] {
    return [...this.words];
  }

  // Get words by commonality
  getWordsByCommonality(commonality: 'common' | 'uncommon' | 'rare'): DictionaryWord[] {
    return this.words.filter(word => word.commonality === commonality);
  }

  // Get statistics
  getStats() {
    const totalWords = this.words.length;
    const commonWords = this.words.filter(w => w.commonality === 'common').length;
    const uncommonWords = this.words.filter(w => w.commonality === 'uncommon').length;
    const rareWords = this.words.filter(w => w.commonality === 'rare').length;
    
    const avgFrequency = this.words.reduce((sum, word) => sum + word.frequency, 0) / totalWords;
    const avgLength = this.words.reduce((sum, word) => sum + word.length, 0) / totalWords;
    
    return {
      totalWords,
      commonWords,
      uncommonWords,
      rareWords,
      avgFrequency: Math.round(avgFrequency),
      avgLength: Math.round(avgLength * 10) / 10
    };
  }

  // Check if word exists in dictionary
  hasWord(word: string): boolean {
    return this.wordMap.has(word.toLowerCase());
  }

  // Get word data
  getWord(word: string): DictionaryWord | undefined {
    return this.wordMap.get(word.toLowerCase());
  }

  // Get total unique words count
  getTotalWords(): number {
    return this.words.length;
  }
}

// Singleton instance
export const dictionaryTrie = new DictionaryTrie();

// Edit distance algorithm for spell checking
export const calculateEditDistance = (word1: string, word2: string): number => {
  // Quick early returns for performance
  if (word1 === word2) return 0;
  if (word1.length === 0) return word2.length;
  if (word2.length === 0) return word1.length;
  
  // If length difference is too large, return early
  if (Math.abs(word1.length - word2.length) > 2) return 3;

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

// Spell checking function
const spellCheckCache = new Map<string, DictionaryWord[]>();
const maxSpellCacheSize = 500;

export const getSpellingSuggestions = (word: string, maxDistance: number = 2, limit: number = 5): DictionaryWord[] => {
  // Check cache first
  const cacheKey = `${word.toLowerCase()}_${maxDistance}_${limit}`;
  if (spellCheckCache.has(cacheKey)) {
    return spellCheckCache.get(cacheKey)!;
  }

  const allWords = dictionaryTrie.getAllWords();
  const lowerWord = word.toLowerCase();
  
  // Pre-filter by length for performance (words within reasonable length difference)
  const lengthFilteredWords = allWords.filter(wordData => {
    const lengthDiff = Math.abs(wordData.word.length - word.length);
    return lengthDiff <= maxDistance;
  });
  
  const results = lengthFilteredWords
    .map(wordData => ({
      ...wordData,
      distance: calculateEditDistance(lowerWord, wordData.word)
    }))
    .filter(item => item.distance <= maxDistance && item.distance > 0)
    .sort((a, b) => {
      // Sort by distance first, then by frequency
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
      return b.frequency - a.frequency;
    })
    .slice(0, limit)
    .map(({ distance, ...wordData }) => wordData);
  
  // Cache the result
  if (spellCheckCache.size >= maxSpellCacheSize) {
    const firstKey = spellCheckCache.keys().next().value;
    spellCheckCache.delete(firstKey);
  }
  spellCheckCache.set(cacheKey, results);
  
  return results;
};
