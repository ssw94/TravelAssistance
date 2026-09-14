import React from 'react';
import {
  TextField,
  TextFieldProps,
} from '@mui/material';

export interface CustomInputProps extends Omit<TextFieldProps, 'error'> {
  error?: boolean | string;
  helperText?: React.ReactNode;
}

export const Input: React.FC<CustomInputProps> = ({
  error,
  helperText,
  ...props
}) => {
  const isError = Boolean(error);
  const text = typeof error === 'string' ? error : helperText;

  return (
    <TextField
      fullWidth
      error={isError}
      helperText={text}
      {...props}
    />
  );
};
export default Input;
