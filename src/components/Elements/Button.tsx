import React, { ButtonHTMLAttributes } from 'react';

interface Button extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: any;
  button_type: ButtonTypes;
}

type ButtonTypes = 'primary' | 'danger';

const Button: React.FC<Button> = ({ children, button_type, ...props }) => {
  const buttonStyles = (type: ButtonTypes) => {
    switch (type) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 ';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 active:bg-red-800 ';
      default:
        break;
    }
  };

  return (
    <button
      {...props}
      className={`flex items-center rounded-md p-2 px-3 text-white disabled:bg-gray-500 ${buttonStyles(
        button_type
      )} ${props.className}`}
    >
      {children}
    </button>
  );
};

export default Button;
