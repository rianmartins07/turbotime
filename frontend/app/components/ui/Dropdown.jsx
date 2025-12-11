'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

function Dropdown({ value, options, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (option) => {
    if (onChange) {
      onChange(option.name || option.value || option)
    }
    setIsOpen(false)
  }

  const selectedOption = options.find((opt) => (opt.name || opt.value || opt) === value) || options[0]

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#faf1e3] border border-[#957139] rounded-lg px-4 py-3 min-w-[240px] hover:bg-[#ffffff] transition-colors"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: selectedOption?.color || '#ef9c66'
          }}
        />
        <span className="flex-1 text-left text-[#000000] font-medium font-inter">
          {selectedOption?.name || selectedOption?.value || selectedOption}
        </span>
        <ChevronDown className="w-5 h-5 text-[#957139]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-[#faf1e3] rounded-lg overflow-hidden z-50">
          {options.map((option, index) => {
            const optionValue = option.name || option.value || option
            const optionColor = option.color || '#ef9c66'
            const isSelected = optionValue === value

            return (
              <button
                key={optionValue || index}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-[#ffffff] transition-colors ${
                  isSelected ? 'bg-[#ffffff]' : ''
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: optionColor }}
                />
                <span className="text-[#000000] font-medium font-inter">{optionValue}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dropdown
