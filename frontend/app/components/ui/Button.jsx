'use client';

import React from 'react';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonClasses = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'hover:opacity-90 focus:ring-orange-500',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border-2 bg-transparent hover:bg-opacity-10 focus:ring-orange-500',
      },
      size: {
        small: 'text-sm px-3 py-1.5',
        medium: 'text-base px-4 py-2',
        large: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

const Button = ({
  text = "Sign Up",
  text_font_size = "text-base",
  text_font_family = "Inria Serif",
  text_font_weight = "font-bold",
  text_line_height = "leading-base",
  text_text_align = "left",
  text_color = "text-button-text",
  border_border = "1px solid",
  border_border_radius = "rounded-lg",
  layout_width,
  padding,
  position,
  layout_gap,
  filled = false,
  variant,
  size,
  disabled = false,
  className,
  children,
  onClick,
  type = "button",
  ...props
}) => {
  const hasValidWidth = layout_width && typeof layout_width === 'string' && layout_width?.trim() !== '';
  const hasValidPadding = padding && typeof padding === 'string' && padding?.trim() !== '';
  const hasValidPosition = position && typeof position === 'string' && position?.trim() !== '';
  const hasValidGap = layout_gap && typeof layout_gap === 'string' && layout_gap?.trim() !== '';

  const optionalClasses = [
    hasValidWidth ? `w-[${layout_width}]` : '',
    hasValidPadding ? `p-[${padding}]` : '',
    hasValidPosition ? position : '',
    hasValidGap ? `gap-[${layout_gap}]` : '',
  ]?.filter(Boolean)?.join(' ');

  const defaultBorderColor = '#000000'
  const buttonStyles = {
    fontSize: text_font_size === "text-base" ? '16px' : text_font_size,
    fontFamily: text_font_family,
    fontWeight: text_font_weight === "font-bold" ? '700' : text_font_weight,
    lineHeight: text_line_height === "leading-base" ? '20px' : text_line_height,
    textAlign: text_text_align,
    color: text_color === "text-button-text" ? defaultBorderColor : text_color,
    border: border_border === "1px solid" ? `1px solid ${defaultBorderColor}` : border_border,
    borderRadius: border_border_radius === "rounded-lg" ? '21px' : border_border_radius,
    backgroundColor: filled ? 'rgba(149, 113, 57, 0.2)' : 'transparent',
  };

  const handleClick = (event) => {
    if (disabled) return;
    if (typeof onClick === 'function') {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      style={buttonStyles}
      className={twMerge(
        buttonClasses({ variant, size }),
        'bg-transparent hover:opacity-80 active:scale-95 cursor-pointer',
        optionalClasses,
        className
      )}
      aria-disabled={disabled}
      {...props}
    >
      {children || text}
    </button>
  );
};

export default Button;