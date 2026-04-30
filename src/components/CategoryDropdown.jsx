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
  const ALL_SPECIALIZATIONS = [
    "All",
    "Cardiologist",
    "Dermatologist", 
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "General Physician",
    "Gynecologist",
    "Ophthalmologist",
    "ENT Specialist",
    "Psychiatrist",
    "Oncologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Pulmonologist",
    "Rheumatologist",
    "Nephrologist",
    "Urologist",
    "Anesthesiologist",
    "Radiologist",
    "Pathologist"
  ];

  const dropdownOptions = options.length > 0 ? options : ALL_SPECIALIZATIONS;

  return (
    <Dropdown
      options={dropdownOptions}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-4 py-2 text-sm font-medium outline-none transition-all duration-200 ${className}`}
      {...props}
    />
  );
};

export default CategoryDropdown;
