import React from 'react';
import { Search, Loader } from 'lucide-react';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  isLoading: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  isLoading
}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {isLoading ? (
          <Loader className="h-5 w-5 text-blue-500 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-gray-400" />
        )}
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-4 py-4 text-lg
          bg-white border-2 border-gray-200 rounded-xl
          focus:border-blue-500 focus:ring-4 focus:ring-blue-100
          transition-all duration-200 outline-none
          placeholder-gray-400
        "
        autoComplete="off"
        spellCheck="false"
      />
      
      {value && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          <button
            onClick={() => onChange('')}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default InputBox;