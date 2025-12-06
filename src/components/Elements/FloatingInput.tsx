import React, {
  useState,
  useId,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useRef
} from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';

type InputTypes = 'text' | 'email' | 'password' | 'tel' | 'number' | 'url' | 'search';

interface BaseFloatingInputProps {
  label: string;
  error?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  placeholder?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  autoComplete?: string;
  type?: InputTypes;
}

type FloatingInputProps = BaseFloatingInputProps & (
  | ({
    multiline?: false;
    rows?: never;
  } & InputHTMLAttributes<HTMLInputElement>)
  | ({
    multiline: true;
    rows?: number;
  } & TextareaHTMLAttributes<HTMLTextAreaElement>)
);

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  error,
  variant = 'outlined',
  fullWidth = false,
  placeholder = '',
  helperText,
  startAdornment,
  endAdornment,
  required = false,
  disabled = false,
  readOnly = false,
  className = '',
  containerClassName = '',
  inputClassName = '',
  labelClassName = '',
  autoComplete = 'off',
  multiline = false,
  rows = 3,
  value,
  defaultValue,
  onChange = (e: any) => { },
  onFocus,
  onBlur,
  type = 'text',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isMouseOverEye, setIsMouseOverEye] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const eyeButtonRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const inputId = props.id || `floating-input-${id}`;

  const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
  const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const getInputType = () => {
    if (type === 'password' && isPasswordVisible) {
      return 'text';
    }
    return type;
  };

  const hasValue = Boolean(internalValue && internalValue.toString().trim());
  const shouldFloat = isFocused || hasValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e as any);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e as any);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTimeout(() => {
      if (!isMouseOverEye) {
        setIsFocused(false);
      }
    }, 100);
    onBlur?.(e as any);
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEyeMouseEnter = () => {
    setIsMouseOverEye(true);
  };

  const handleEyeMouseLeave = () => {
    setIsMouseOverEye(false);
  };

  const handleContainerClick = () => {
    if (!disabled && !readOnly) {
      inputRef.current?.focus();
    }
  };

  const themeStyles = {
    light: {
      primary: '#1976d2',
      primaryHover: '#42a5f5',
      error: '#f44336',
      textPrimary: 'rgba(0, 0, 0, 0.87)',
      textSecondary: 'rgba(0, 0, 0, 0.6)',
      textDisabled: 'rgba(0, 0, 0, 0.38)',
      border: 'rgba(0, 0, 0, 0.23)',
      borderHover: 'rgba(0, 0, 0, 0.87)',
      backgroundDefault: 'rgba(255, 255, 255, 0.95)',
      backgroundPaper: '#f5f5f5',
      backgroundFilled: 'rgba(0, 0, 0, 0.06)',
      eyeButtonHover: 'rgba(0, 0, 0, 0.04)',
      eyeButtonActive: 'rgba(0, 0, 0, 0.08)',
    },
    dark: {
      primary: '#90caf9',
      primaryHover: '#42a5f5',
      error: '#d32f2f',
      textPrimary: 'rgba(255, 255, 255, 0.8)',
      textSecondary: 'rgba(255, 255, 255, 0.6)',
      textDisabled: 'rgba(255, 255, 255, 0.38)',
      border: 'rgba(255, 255, 255, 0.23)',
      borderHover: 'rgba(255, 255, 255, 0.87)',
      backgroundDefault: 'rgba(14, 23, 38, 0.95)',
      backgroundPaper: '#f5f5f5',
      backgroundFilled: 'rgba(0, 0, 0, 0.06)',
      eyeButtonHover: 'rgba(255, 255, 255, 0.08)',
      eyeButtonActive: 'rgba(255, 255, 255, 0.16)',
    }
  };

  const styles = isDark ? themeStyles.dark : themeStyles.light;

  const containerClasses = `
    relative
    font-['Inter',_-apple-system,_BlinkMacSystemFont,_'Segoe_UI',_Roboto,_sans-serif]
    ${fullWidth ? 'w-full' : ''}
    ${isRtl ? 'rtl' : 'ltr'}
    ${containerClassName}
  `.trim();

  const wrapperClasses = `
    flex
    items-center
    relative
    ${disabled ? 'cursor-not-allowed' : readOnly ? 'cursor-default' : 'cursor-text'}
    min-h-[56px]
    ${className}
  `.trim();

  const inputWrapperBaseClasses = `
    relative
    flex-1
    flex
    items-center
    h-full
  `;

  const inputWrapperVariantClasses = {
    outlined: `
      border
      rounded-[4px]
      ${isFocused ? 'border-2' : ''}
      ${error ? 'border-[#f44336]' : isFocused ? `border-[${styles.primary}]` : `border-[${styles.border}]`}
      hover:${error ? 'border-[#f44336]' : `border-[${styles.borderHover}]`}
      transition-all
      duration-200
      ease-[cubic-bezier(0.4,0,0.2,1)]
    `,
    filled: `
      bg-[${styles.backgroundFilled}]
      rounded-t-[4px]
      relative
      after:content-['']
      after:absolute
      after:left-0
      after:bottom-0
      after:w-full
      after:h-[1px]
      after:bg-[${styles.border}]
      after:transition-all
      after:duration-200
      after:ease-[cubic-bezier(0.4,0,0.2,1)]
      before:content-['']
      before:absolute
      before:left-0
      before:bottom-0
      before:w-full
      before:h-[2px]
      before:bg-[${error ? styles.error : styles.primary}]
      before:scale-x-0
      before:transition-all
      before:duration-200
      before:ease-[cubic-bezier(0.4,0,0.2,1)]
      hover:after:bg-[${styles.borderHover}]
      hover:after:h-[2px]
      ${isFocused ? 'before:scale-x-100' : ''}
    `,
    standard: `
      after:content-['']
      after:absolute
      after:left-0
      after:bottom-0
      after:w-full
      after:h-[1px]
      after:bg-[${styles.border}]
      after:transition-all
      after:duration-200
      after:ease-[cubic-bezier(0.4,0,0.2,1)]
      before:content-['']
      before:absolute
      before:left-0
      before:bottom-0
      before:w-full
      before:h-[2px]
      before:bg-[${error ? styles.error : styles.primary}]
      before:scale-x-0
      before:transition-all
      before:duration-200
      before:ease-[cubic-bezier(0.4,0,0.2,1)]
      hover:after:bg-[${styles.borderHover}]
      hover:after:h-[2px]
      ${isFocused ? 'before:scale-x-100' : ''}
    `
  };

  const inputWrapperClasses = `
    ${inputWrapperBaseClasses}
    ${variant === 'outlined' ? inputWrapperVariantClasses.outlined :
      variant === 'filled' ? inputWrapperVariantClasses.filled :
        inputWrapperVariantClasses.standard}
    ${type === 'password' ? 'relative' : ''}
  `.trim();

  const labelBaseClasses = `
    absolute
    transform
    -translate-y-1/2
    ${isRtl ? 'right-3' : 'left-3'}
    ${shouldFloat ? (variant === 'outlined' ? '-top-1.5' : '-top-2') : 'top-1/2'}
    ${shouldFloat ? 'scale-90' : 'scale-100'}
    transition-all
    duration-200
    ease-[cubic-bezier(0.4,0,0.2,1)]
    pointer-events-none
    ${shouldFloat ? 'z-10' : 'z-0'}
    ${shouldFloat ? (isRtl ? 'origin-right-top' : 'origin-left-top') : ''}
    whitespace-nowrap
    overflow-hidden
    text-ellipsis
    max-w-[calc(100%-48px)]
    ${shouldFloat ? 'px-1' : 'px-0'}
  `;

  const labelColorClasses = `
    ${shouldFloat ? 
      (error ? 'text-red-500' : (isDark ? 'text-blue-400' : 'text-blue-600')) : 
      (isDark ? 'text-gray-400' : 'text-gray-500')
    }
    ${disabled ? 'text-gray-400' : ''}
  `;

  const labelBackgroundClasses = `
    ${shouldFloat ? 
      (variant === 'outlined' ? (isDark ? 'bg-gray-900' : 'bg-white') :
       variant === 'filled' ? (isDark ? 'bg-gray-800' : 'bg-gray-50') :
       (isDark ? 'bg-gray-900' : 'bg-white')) : 
      'bg-transparent'
    }
  `;

  const labelClasses = `
    ${labelBaseClasses}
    ${labelColorClasses}
    ${labelBackgroundClasses}
    ${labelClassName}
  `.trim();

  const inputBaseClasses = `
    w-full
    h-full
    border-none
    outline-none
    bg-transparent
    font-inherit
    text-base
    font-normal
    leading-[1.5]
    ${isDark ? 'text-white' : 'text-gray-900'}
    ${variant === 'outlined' ? 'px-3 py-4' : 'px-3 pt-6 pb-2'}
    box-border
    transition-all
    duration-200
    ease-[cubic-bezier(0.4,0,0.2,1)]
    ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}
    ${readOnly ? 'cursor-default' : ''}
    ${type === 'password' ? (isRtl ? 'pl-12' : 'pr-12') : ''}
    placeholder:text-transparent
    focus:placeholder:text-gray-400
  `;

  const inputClasses = `
    ${inputBaseClasses}
    ${multiline ? 'min-h-[80px] resize-y' : ''}
    ${inputClassName}
  `.trim();

  const adornmentClasses = `
    flex
    items-center
    justify-center
    ${isDark ? 'text-gray-400' : 'text-gray-500'}
    px-2
    flex-shrink-0
    ${disabled ? 'text-gray-400' : ''}
  `;

  const passwordEyeClasses = `
    absolute
    ${isRtl ? 'left-2' : 'right-2'}
    top-1/2
    -translate-y-1/2
    bg-none
    border-none
    p-1
    cursor-pointer
    ${isDark ? 'text-gray-400' : 'text-gray-500'}
    flex
    items-center
    justify-center
    transition-all
    duration-200
    ease-[cubic-bezier(0.4,0,0.2,1)]
    rounded-[4px]
    w-8
    h-8
    z-30
    ${disabled || readOnly ? 'cursor-not-allowed opacity-50' : ''}
    ${!disabled && !readOnly ? `
      hover:bg-gray-200
      hover:text-gray-700
      active:bg-gray-300
      focus:outline-2
      focus:outline-blue-500
      focus:outline-offset-2
    ` : ''}
  `;

  const helperContainerClasses = `
    mt-1
    px-2
    min-h-[20px]
  `;

  const errorTextClasses = `
    text-red-500
    text-xs
    font-normal
    leading-[1.66]
  `;

  const helperTextClasses = `
    ${isDark ? 'text-gray-400' : 'text-gray-500'}
    text-xs
    font-normal
    leading-[1.66]
    ${disabled ? 'text-gray-400' : ''}
  `;

  const requiredClasses = `
    text-red-500
    ml-0.5
  `;

  const renderInput = () => {
    const commonProps = {
      id: inputId,
      ref: inputRef as any,
      className: inputClasses,
      value: value,
      defaultValue: defaultValue,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      placeholder: placeholder,
      required,
      disabled,
      readOnly,
      'aria-describedby': error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined,
      'aria-invalid': !!error,
      'aria-label': label,
      autoComplete,
      dir: isRtl ? 'rtl' : 'ltr',
      ...(multiline ? { rows } : {})
    };

    if (multiline) {
      return (
        <textarea
          {...commonProps}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        type={getInputType()}
        {...commonProps}
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  };

  const renderPasswordEyeIcon = () => {
    if (type !== 'password') return null;

    return (
      <button
        type="button"
        ref={eyeButtonRef}
        className={passwordEyeClasses}
        onClick={togglePasswordVisibility}
        onMouseEnter={handleEyeMouseEnter}
        onMouseLeave={handleEyeMouseLeave}
        disabled={disabled || readOnly}
        aria-label={isPasswordVisible ? 'پنهان کردن رمز' : 'نمایش رمز'}
        aria-pressed={isPasswordVisible}
        tabIndex={-1}
      >
        <svg
          className={`transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${isPasswordVisible ? 'text-blue-500' : 'text-gray-500'}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
        >
          {isPasswordVisible ? (
            <>
              <path
                d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z"
                fill="currentColor"
              />
            </>
          ) : (
            <>
              <path
                d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                fill="currentColor"
              />
            </>
          )}
        </svg>
      </button>
    );
  };

  return (
    <div className={containerClasses}>
      <div className={wrapperClasses} onClick={handleContainerClick}>
        {startAdornment && (
          <div className={adornmentClasses}>
            {startAdornment}
          </div>
        )}

        <div className={inputWrapperClasses}>
          {renderInput()}

          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className={requiredClasses}> *</span>}
          </label>

          {type === 'password' && renderPasswordEyeIcon()}
        </div>

        {endAdornment && type !== 'password' && (
          <div className={adornmentClasses}>
            {endAdornment}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <div className={helperContainerClasses}>
          {error && (
            <div
              id={`${inputId}-error`}
              className={errorTextClasses}
              role="alert"
            >
              {error}
            </div>
          )}
          {helperText && !error && (
            <div
              id={`${inputId}-helper`}
              className={helperTextClasses}
            >
              {helperText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingInput;