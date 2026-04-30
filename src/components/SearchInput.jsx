import React from 'react';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search by name, specialty or clinic...",
  className = "",
  ...props 
}) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors z-10">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-12 pr-4 text-sm font-medium outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 shadow-sm hover:shadow-md hover:border-slate-300"
        {...props}
      />
    </div>
  );
};

export default SearchInput;
