import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  SelectProps as MuiSelectProps,
} from '@mui/material';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface CustomSelectProps extends Omit<MuiSelectProps, 'error'> {
  label: string;
  options: SelectOption[];
  error?: boolean | string;
  helperText?: React.ReactNode;
}

export const Select: React.FC<CustomSelectProps> = ({
  label,
  options,
  error,
  helperText,
  value,
  onChange,
  fullWidth = true,
  size = 'small',
  ...props
}) => {
  const isError = Boolean(error);
  const text = typeof error === 'string' ? error : helperText;
  const labelId = `select-label-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <FormControl fullWidth={fullWidth} size={size} error={isError}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        labelId={labelId}
        label={label}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {text && <FormHelperText>{text}</FormHelperText>}
    </FormControl>
  );
};
export default Select;
