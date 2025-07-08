import React from "react";
import "./Form.css";

export interface FormFieldProps {
  label?: string;
  id?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  helpText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  required,
  children,
  className = "",
  helpText,
}) => {
  return (
    <div
      className={`form-field ${error ? "form-field-error" : ""} ${className}`}
    >
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <div className="form-input-wrapper">{children}</div>
      {error && <span className="form-error-message">{error}</span>}
      {helpText && !error && <span className="form-help-text">{helpText}</span>}
    </div>
  );
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "search";
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  variant = "default",
  error,
  className = "",
  ...props
}) => {
  const inputClasses = [
    "form-input",
    `form-input-${variant}`,
    error && "form-input-error",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <input className={inputClasses} {...props} />;
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export const Textarea: React.FC<TextareaProps> = ({
  error,
  resize = "vertical",
  className = "",
  ...props
}) => {
  const textareaClasses = [
    "form-textarea",
    error && "form-textarea-error",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <textarea className={textareaClasses} style={{ resize }} {...props} />;
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  error,
  options,
  placeholder,
  className = "",
  ...props
}) => {
  const selectClasses = ["form-select", error && "form-select-error", className]
    .filter(Boolean)
    .join(" ");

  return (
    <select className={selectClasses} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  description,
  className = "",
  id,
  ...props
}) => {
  const checkboxId =
    id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`form-checkbox ${
        error ? "form-checkbox-error" : ""
      } ${className}`}
    >
      <div className="form-checkbox-wrapper">
        <input
          type="checkbox"
          id={checkboxId}
          className="form-checkbox-input"
          {...props}
        />
        <label htmlFor={checkboxId} className="form-checkbox-label">
          {label}
        </label>
      </div>
      {description && (
        <span className="form-checkbox-description">{description}</span>
      )}
    </div>
  );
};

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  description?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  error,
  description,
  className = "",
  id,
  ...props
}) => {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`form-radio ${error ? "form-radio-error" : ""} ${className}`}
    >
      <div className="form-radio-wrapper">
        <input
          type="radio"
          id={radioId}
          className="form-radio-input"
          {...props}
        />
        <label htmlFor={radioId} className="form-radio-label">
          {label}
        </label>
      </div>
      {description && (
        <span className="form-radio-description">{description}</span>
      )}
    </div>
  );
};

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <form className={`form ${className}`} {...props}>
      {children}
    </form>
  );
};
