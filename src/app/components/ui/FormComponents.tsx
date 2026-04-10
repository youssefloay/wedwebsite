import { ReactNode } from 'react';
import { DesignSystem, getButtonStyles, getSelectionStyles } from '../utils/designSystem';
import { Check } from 'lucide-react';

// ============ BUTTON COMPONENT ============

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false
}: ButtonProps) {
  const baseStyles = getButtonStyles(variant, 'default', disabled);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-10 py-4 border transition-all duration-300 ${fullWidth ? 'w-full' : ''}`}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (!disabled) {
          const hoverStyles = getButtonStyles(variant, 'hover', disabled);
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, baseStyles);
        }
      }}
    >
      {children}
    </button>
  );
}

// ============ SELECTION CARD COMPONENT ============

interface SelectionCardProps {
  children: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
  showCheckmark?: boolean;
}

export function SelectionCard({
  children,
  selected,
  disabled = false,
  onClick,
  showCheckmark = true
}: SelectionCardProps) {
  const styles = getSelectionStyles(selected, false, disabled);

  return (
    <label
      className="flex items-center justify-center p-6 border cursor-pointer transition-all duration-300"
      style={{
        ...styles,
        borderRadius: '2px',
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={(e) => {
        if (!disabled && !selected) {
          const hoverStyles = getSelectionStyles(false, true, false);
          e.currentTarget.style.borderColor = hoverStyles.borderColor;
          e.currentTarget.style.backgroundColor = hoverStyles.backgroundColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.borderColor = styles.borderColor;
          e.currentTarget.style.backgroundColor = styles.backgroundColor;
        }
      }}
    >
      <span
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '1rem',
          color: selected ? DesignSystem.colors.state.selected : DesignSystem.colors.text.secondary,
          letterSpacing: '0.05em',
          fontWeight: selected ? 500 : 400,
          transition: 'color 300ms ease-in-out'
        }}
      >
        {children}
      </span>
      {selected && showCheckmark && (
        <Check
          size={18}
          style={{ color: DesignSystem.colors.state.selected, marginLeft: '0.5rem' }}
        />
      )}
    </label>
  );
}

// ============ INPUT COMPONENT ============

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number';
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function Input({
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  error
}: InputProps) {
  const inputStyles = {
    ...DesignSystem.input[error ? 'error' : disabled ? 'disabled' : 'default'],
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '1rem',
    transition: DesignSystem.transition.fast,
    textAlign: 'center' as const
  };

  return (
    <div>
      {label && (
        <label
          className="block mb-3 text-center"
          style={{
            ...DesignSystem.typography.label.default,
            fontWeight: required ? 500 : 400,
            color: required ? DesignSystem.colors.text.secondary : DesignSystem.colors.text.tertiary
          }}
        >
          {label}
          {required && <span style={{ color: DesignSystem.colors.signature.terracotta }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-6 py-4 border text-center transition-all duration-300 focus:outline-none"
        style={inputStyles}
        onFocus={(e) => {
          if (!disabled) {
            const focusStyles = DesignSystem.input.focus;
            e.currentTarget.style.borderColor = focusStyles.borderColor;
            e.currentTarget.style.boxShadow = focusStyles.boxShadow || '';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = inputStyles.borderColor;
          e.currentTarget.style.boxShadow = '';
        }}
      />
      {error && (
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            color: DesignSystem.colors.signature.terracotta,
            marginTop: '0.5rem',
            textAlign: 'center'
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ============ TEXTAREA COMPONENT ============

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
}

export function Textarea({
  value,
  onChange,
  label,
  placeholder,
  rows = 3,
  required = false,
  disabled = false
}: TextareaProps) {
  const textareaStyles = {
    ...DesignSystem.input[disabled ? 'disabled' : 'default'],
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '1rem',
    transition: DesignSystem.transition.fast,
    textAlign: 'center' as const,
    resize: 'none' as const
  };

  return (
    <div>
      {label && (
        <label
          className="block mb-3 text-center"
          style={{
            ...DesignSystem.typography.label.default,
            fontWeight: required ? 500 : 400,
            color: required ? DesignSystem.colors.text.secondary : DesignSystem.colors.text.tertiary
          }}
        >
          {label}
          {required && <span style={{ color: DesignSystem.colors.signature.terracotta }}> *</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className="w-full px-6 py-4 border text-center transition-all duration-300 focus:outline-none"
        style={textareaStyles}
        onFocus={(e) => {
          if (!disabled) {
            const focusStyles = DesignSystem.input.focus;
            e.currentTarget.style.borderColor = focusStyles.borderColor;
            e.currentTarget.style.boxShadow = focusStyles.boxShadow || '';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = textareaStyles.borderColor;
          e.currentTarget.style.boxShadow = '';
        }}
      />
    </div>
  );
}

// ============ SELECT COMPONENT ============

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder,
  required = false,
  disabled = false
}: SelectProps) {
  const selectStyles = {
    ...DesignSystem.input[disabled ? 'disabled' : 'default'],
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '1rem',
    transition: DesignSystem.transition.fast,
    textAlign: 'center' as const
  };

  return (
    <div>
      {label && (
        <label
          className="block mb-3 text-center"
          style={{
            ...DesignSystem.typography.label.default,
            fontWeight: required ? 500 : 400,
            color: required ? DesignSystem.colors.text.secondary : DesignSystem.colors.text.tertiary
          }}
        >
          {label}
          {required && <span style={{ color: DesignSystem.colors.signature.terracotta }}> *</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full px-6 py-4 border text-center transition-all duration-300 focus:outline-none"
        style={selectStyles}
        onFocus={(e) => {
          if (!disabled) {
            const focusStyles = DesignSystem.input.focus;
            e.currentTarget.style.borderColor = focusStyles.borderColor;
            e.currentTarget.style.boxShadow = focusStyles.boxShadow || '';
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = selectStyles.borderColor;
          e.currentTarget.style.boxShadow = '';
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
