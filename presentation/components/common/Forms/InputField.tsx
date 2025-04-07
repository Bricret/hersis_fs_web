"use client";

import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "@/infraestructure/lib/utils";

interface InputFieldProps {
  label: string;
  type?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function InputField({
  label,
  type = "text",
  error,
  registration,
  placeholder,
  className,
  required = false,
}: InputFieldProps) {
  return (
    <div className={cn("*:not-first:mt-2", className)}>
      <Label htmlFor={registration.name}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={registration.name}
        className="peer border border-border-main"
        placeholder={placeholder}
        type={type}
        {...registration}
        aria-invalid={!!error}
        required={required}
      />
      <p
        className="peer-aria-invalid:text-destructive mt-2 text-xs"
        role="alert"
        aria-live="polite"
      >
        {error?.message}
      </p>
    </div>
  );
}
