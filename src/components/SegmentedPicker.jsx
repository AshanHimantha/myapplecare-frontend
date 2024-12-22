import React, { useState } from 'react';

const SegmentedPicker = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className="flex border border-gray-300 rounded-md overflow-hidden bg-slate-100 w-full">
      {options.map((option, index) => (
        <button
          key={option}
          className={`flex-1 py-1 px-4 lg:text-sm text-xs font-medium focus:outline-none transition-colors duration-200 border-e-2  ${
            selectedOption === option
              ? 'bg-white text-black shadow-md'
              : 'bg-transparent text-gray-700 hover:bg-gray-100'
          } ${index === 0 ? 'rounded-md' : ''} ${
            index === options.length - 1 ? 'rounded-md' : ''
          }`}
          onClick={() => handleOptionChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SegmentedPicker;