import React from 'react';
import { Zap, RefreshCw } from 'lucide-react';

interface Suggestion {
  word: string;
  score: number;
  type: 'autocomplete' | 'spellcheck';
}

interface SuggestionDropdownProps {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSuggestionSelect: (suggestion: string) => void;
  query: string;
}

const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
  suggestions,
  selectedIndex,
  onSuggestionSelect,
  query
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-yellow-200 text-yellow-800 font-semibold">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
      <div className="p-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.word}-${index}`}
            onClick={() => onSuggestionSelect(suggestion.word)}
            className={`
              w-full px-4 py-3 text-left rounded-lg transition-all duration-150
              flex items-center justify-between group
              ${index === selectedIndex 
                ? 'bg-blue-50 border border-blue-200' 
                : 'hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                p-1 rounded-md
                ${suggestion.type === 'autocomplete' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-orange-100 text-orange-600'
                }
              `}>
                {suggestion.type === 'autocomplete' ? (
                  <Zap className="h-3 w-3" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
              </div>
              
              <span className="text-gray-900 font-medium">
                {highlightMatch(suggestion.word, query)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`
                text-xs px-2 py-1 rounded-full font-medium
                ${suggestion.type === 'autocomplete' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-orange-100 text-orange-700'
                }
              `}>
                {suggestion.type === 'autocomplete' ? 'Match' : 'Spell'}
              </span>
              
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400"></div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 rounded-b-xl">
        <p className="text-xs text-gray-500 text-center">
          Use ↑↓ to navigate • Enter to select • Esc to close
        </p>
      </div>
    </div>
  );
};

export default SuggestionDropdown;