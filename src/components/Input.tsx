import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export const Input = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    transition: ".2s",

    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },

    "&.Mui-focused": {
      transform: "scale(1.01)",
    },
  },
}));
