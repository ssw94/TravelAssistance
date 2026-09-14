import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
} from '@mui/material';

export interface CustomButtonProps extends MuiButtonProps {
  isLoading?: boolean;
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  isLoading = false,
  disabled,
  startIcon,
  ...props
}) => {
  return (
    <MuiButton
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
export default Button;
