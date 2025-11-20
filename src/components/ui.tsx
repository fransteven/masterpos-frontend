
import React from 'react';
import type { ReactNode, ComponentPropsWithoutRef } from 'react';

// FormGroup Component for consistent layout of labels and inputs
interface FormGroupProps {
    label: string;
    htmlFor: string;
    children: ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
        </label>
        {children}
    </div>
);

// Reusable Input Component
type InputProps = ComponentPropsWithoutRef<'input'>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={`
        block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
        focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
        disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
        ${className}
    `}
        {...props}
    />
));
Input.displayName = 'Input';


// Reusable Select Component
interface SelectProps extends ComponentPropsWithoutRef<'select'> {
    children: ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => (
    <select
        ref={ref}
        className={`
            block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm
            focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500
            ${className}
        `}
        {...props}
    >
        {children}
    </select>
));
Select.displayName = 'Select';


// Reusable Button Component
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, variant = 'primary', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 gap-2';

    const variantClasses = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
    };

    return (
        <button
            ref={ref}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
});
Button.displayName = 'Button';