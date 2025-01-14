import { FormControl, FormHelperText, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label?: string;
  type?: string;
  rules?: Partial<Record<string, unknown>>;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string | null;
  size?: 'small' | 'medium' | 'large';
  autoComplete?: string;
  isHidden?: boolean;
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  minRows?: number;
  InputProps?: { endAdornment: React.ReactNode };
}

const InputField = ({
  name,
  label = '',
  type = '',
  rules = {},
  defaultValue = '',
  disabled = false,
  placeholder = '',
  fullWidth = false,
  className = null,
  size = 'small',
  autoComplete,
  isHidden = false,
  required = false,
  multiline = false,
  minRows,
  helperText,
  InputProps,
  ...props
}: InputFieldProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      render={({ field, fieldState }) => (
        <FormControl
          error={Boolean(fieldState.error)}
          className={className || undefined}
          fullWidth={fullWidth}
          disabled={disabled}
          required={required}
        >
          <TextField
            {...field}
            {...props}
            type={type}
            size={size === 'small' ? 'small' : size === 'medium' ? 'medium' : undefined}
            id={name}
            label={label}
            disabled={disabled}
            helperText={helperText}
            placeholder={placeholder}
            multiline={multiline}
            minRows={minRows}
            InputProps={InputProps}
            onChange={(e) => {
              const value = e.target.value.trimStart();
              field.onChange(value);
            }}
          />
          <FormHelperText variant="filled">{fieldState.error && fieldState.error.message}</FormHelperText>
        </FormControl>
      )}
      name={name}
      control={control}
      rules={rules}
    />
  );
};

export default InputField;
