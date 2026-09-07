import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
const AuthLayout = () => {
  return (
    <Box className="size-full flex items-center justify-center">
      <Outlet/>
    </Box>
  );
};

export default AuthLayout;
