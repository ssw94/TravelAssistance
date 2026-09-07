import { Box } from "@mui/material";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="size-full !p-0 !m-0">
      {children}
    </Box>
  );
};

export default ThemeProvider;
