import React from 'react';
import { useTranslation } from 'react-i18next';

const SearchButton = ({ 
  onClick, 
  children = "Search",
  disabled = false,
  className = "",
  loading = false,
  ...props 
}) => {
  const { t } = useTranslation();
  return (
    <button 
      className={`group relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-brand-700 hover:to-brand-600 hover:shadow-lg hover:shadow-brand-200/50 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed sm:block ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('common.searching')}
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {children}
          </>
        )}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
};

export default SearchButton;
