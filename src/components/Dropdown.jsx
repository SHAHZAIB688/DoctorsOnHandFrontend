import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "./icons";

const Dropdown = ({ options, value, onChange, placeholder = "Select option", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => (opt.value || opt) === value);
  const displayLabel = selectedOption ? (selectedOption.label || selectedOption) : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full h-full items-center border rounded-xl px-3 py-2.5 text-sm outline-none transition-all shadow-sm ${
          isOpen || selectedOption
            ? "border-brand-600 bg-white ring-1 ring-brand-100"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <span className={`flex-1 text-center font-bold leading-tight ${selectedOption ? "text-brand-700" : "text-slate-500"}`}>
          {displayLabel}
        </span>
        <ChevronDownIcon className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${selectedOption ? "text-brand-700" : "text-slate-400"}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-2.5 shadow-xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1">
            {options.map((option, idx) => {
              const optValue = option.value || option;
              const optLabel = option.label || option;
              const isSelected = optValue === value;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-bold transition-all ${
                    isSelected
                      ? "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {optLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
