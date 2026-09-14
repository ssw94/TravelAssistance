import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingProps {
  message?: string;
  minHeight?: number | string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading travel data...',
  minHeight = '40vh',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        gap: 2,
      }}
    >
      <CircularProgress size={40} thickness={4} color="primary" />
      {message && (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {message}
        </Typography>
      )}
    </Box>
  );
};
export default Loading;
