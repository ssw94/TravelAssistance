import { Box } from "@mui/material";
import AuthProvider from "./AuthProvider";
import ThemeProvider from "./ThemeProvider";

const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="size-full !p-0 !m-0">
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </Box>
  );
};

export default RegisterProvider;
