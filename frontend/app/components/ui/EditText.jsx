'use client';

import React, { useState, forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const editTextClasses = cva(
  'w-full transition-all duration-200 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'focus:border-[#957139]',
        error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
        success: 'border-green-500 focus:ring-green-500 focus:border-green-500',
      },
      size: {
        small: 'px-2 py-1 text-sm',
        medium: 'px-3 py-2 text-base',
        large: 'px-4 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'medium',
    },
  }
);

const EditText = forwardRef(({
  placeholder = "Email address",
  text_font_size = "text-xs",
  text_font_family = "Inria Serif",
  text_font_weight = "font-normal",
  text_line_height = "leading-sm",
  text_text_align = "left",
  text_color = "text-edittext-text",
  border_border = "1px solid",
  border_border_radius = "rounded-sm",
  layout_width,
  padding,
  position,
  layout_gap,
  margin,
  variant,
  size,
  type = "text",
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';
  const hasValidMargin = margin && typeof margin === 'string' && margin?.trim() !== '';

  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
    hasValidGap ? `gap-[${layout_gap}]` : '',
    hasValidMargin ? `m-[${margin}]` : '',
  ]?.filter(Boolean)?.join(' ');

  const inputStyles = {
    fontSize: text_font_size === "text-xs" ? '12px' : text_font_size,
    fontFamily: text_font_family,
    fontWeight: text_font_weight === "font-normal" ? '400' : text_font_weight,
    lineHeight: text_line_height === "leading-sm" ? '15px' : text_line_height,
    textAlign: text_text_align,
    color: text_color === "text-edittext-text" ? '#000000' : text_color,
    border: '1px solid #957139',
    borderColor: '#957139',
    borderRadius: border_border_radius === "rounded-sm" ? '5.5px' : border_border_radius,
  };

  const handleFocus = (event) => {
    setIsFocused(true);
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    if (typeof onBlur === 'function') {
      onBlur(event);
    }
  };

  const handleChange = (event) => {
    if (typeof onChange === 'function') {
      onChange(event);
    }
  };

  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      required={required}
      style={inputStyles}
      className={twMerge(
        editTextClasses({ variant, size }),
        'bg-transparent border border-[#957139] hover:border-[#957139] focus:border-[#957139] placeholder:text-gray-400',
        optionalClasses,
        className
      )}
      aria-required={required}
      {...props}
    />
  );
});

EditText.displayName = 'EditText';

export default EditText;