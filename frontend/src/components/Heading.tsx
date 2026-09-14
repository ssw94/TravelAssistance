import React from 'react';
import { Typography, TypographyProps, Box } from '@mui/material';

export interface HeadingProps extends TypographyProps {
  badge?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, badge, sx, ...props }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, ...sx }}>
      <Typography variant="h4" fontWeight={800} color="text.primary" {...props}>
        {children}
      </Typography>
      {badge && (
        <Box
          component="span"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            px: 1.2,
            py: 0.4,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.dark',
          }}
        >
          {badge}
        </Box>
      )}
    </Box>
  );
};

export const SubHeading: React.FC<TypographyProps> = ({ children, sx, ...props }) => {
  return (
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ mb: 3, maxWidth: 700, ...sx }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Heading;
