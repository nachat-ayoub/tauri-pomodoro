import { twMerge } from 'tailwind-merge';
import React, { ButtonHTMLAttributes } from 'react';

interface BasicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const BasicButton: React.FC<BasicButtonProps> = ({
  children,
  className = '',
  ...otherProps
}) => {
  return (
    <button
      className={twMerge(
        'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5',
        className
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default BasicButton;
