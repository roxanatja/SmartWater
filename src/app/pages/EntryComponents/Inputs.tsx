import React, { memo } from "react";
import { motion } from "framer-motion";

interface InputProps {
  label?: string;
  name: string;
  register: any;
  errors?: any;
  textarea?: boolean;
  isVisibleLable?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  numericalOnly?: boolean;
  isText?: boolean;
  button?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?(): void;
  validateAmount?(e: any): string | boolean;
  [key: string]: any;
}

const Input = memo<InputProps>(
  ({
    label,
    name,
    register,
    errors,
    textarea,
    required,
    className,
    onChange,
    numericalOnly,
    icon,
    isVisibleLable,
    isText,
    validateAmount,
    button,
    onClick,
    ...rest
  }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = event.target.value;

      if (numericalOnly) {
        inputValue = inputValue.replace(/[^0-9.]/g, "");
        const dotIndex = inputValue.indexOf(".");
        if (dotIndex !== -1) {
          inputValue =
            inputValue.slice(0, dotIndex + 1) +
            inputValue.slice(dotIndex).replace(/\./g, "");
        }
      }

      if (onChange) {
        onChange({ ...event, target: { ...event.target, value: inputValue } });
      } else {
        event.target.value = inputValue;
      }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-2 w-full"
      >
        {label && !isVisibleLable && (
          <label
            className="font-normal text-md text-md font-openSans"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        {textarea ? (
          <textarea
            {...register(
              name,
              required && {
                required: `el ${label} es requerido`,
                onChange: handleChange,
              }
            )}
            {...rest}
            className={`${errors && "outline outline-red-500"
              } p-2 text-md rounded-lg focus:outline-4 font-pricedown bg-transparent outline outline-2 outline-black ${className}`}
          />
        ) : (
          <div className="relative w-full flex items-center">
            {icon && (
              <div className="absolute ps-4 py-1.5 text-xl border-r h-full border-black pr-4">
                {icon}
              </div>
            )}
            <input
              {...register(
                name,
                required
                  ? {
                    required: `${label} es requerido`,
                    validate: validateAmount,
                    onChange:
                      rest.type === "file" ? handleFileChange : handleChange,
                  }
                  : {
                    required: false,
                    validate: validateAmount,
                    onChange:
                      rest.type === "file" ? handleFileChange : handleChange,
                  }
              )}
              {...rest}
              className={`${errors && "outline outline-red-500"
                } ${className} ${icon ? "pl-16" : ""} ${!isText && "text-sm"
                }  p-2 py-2.5 rounded-md focus:outline-4 bg-transparent outline outline-2 outline-black w-full`}
            />
            {button && (
              <button
                className="absolute ps-4 py-1.5 rounded-r-md end-0 text-sm border-l h-full border-black pr-4"
                type="button"
                onClick={onClick}
              >
                {button}
              </button>
            )}
          </div>
        )}
        {errors && (
          <span className="text-red-500 font-normal text-sm">
            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
            {errors.message}
          </span>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export default Input;
