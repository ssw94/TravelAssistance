import { Box } from "@mui/material";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box className="size-full !p-0 !m-0">
      {children}
    </Box>
  );
};

export default AuthProvider;
