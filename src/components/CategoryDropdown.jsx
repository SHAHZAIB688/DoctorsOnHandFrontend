import React from 'react';
import Dropdown from './Dropdown';

const CategoryDropdown = ({ 
  value, 
  onChange, 
  options = [],
  placeholder = "All Specialties",
  className = "",
  ...props 
}) => {
  return (
    <Dropdown
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-4 py-2 text-sm font-medium outline-none transition-all duration-200 ${className}`}
      {...props}
    />
  );
};

export default CategoryDropdown;
