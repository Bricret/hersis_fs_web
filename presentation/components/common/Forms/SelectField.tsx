import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
import {
  FieldError,
  UseFormRegisterReturn,
  useFormContext,
} from "react-hook-form";

interface SelectFieldProps {
  label: string;
  type?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  placeholder?: string;
  className?: string;
  required?: boolean;
  options: string[];
}

export default function SelectField({
  label,
  error,
  registration,
  placeholder,
  className,
  required = false,
  options,
}: SelectFieldProps) {
  const id = useId();
  const { getValues } = useFormContext();
  const currentValue = getValues(registration.name);

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        onValueChange={(value) => {
          // Actualizar el valor en react-hook-form
          const event = {
            target: { value, name: registration.name },
          } as React.ChangeEvent<HTMLSelectElement>;
          registration.onChange(event);
        }}
        defaultValue={currentValue}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <SelectTrigger
          id={id}
          className={`border w-full ${
            error
              ? "border-destructive focus:ring-destructive"
              : "border-border-main"
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p
          id={`${id}-error`}
          className="text-destructive text-xs mt-1"
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
