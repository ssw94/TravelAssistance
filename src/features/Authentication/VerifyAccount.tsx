import { Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import { Form, Link } from "react-router-dom";

import {
  Box,
  Card,
  Button,
  Input,
  Heading,
  SubHeading,
} from "../../components";

const VerifyAccount = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          width: 460,
          p: 5,
        }}
      >
        <Heading align="center">
          Verify Your Account ✉️
        </Heading>

        <SubHeading
          align="center"
          sx={{ mb: 4 }}
        >
          We've sent a verification code to your email address. Enter it below to verify your account.
        </SubHeading>

        <Formik
          initialValues={{
            verificationCode: "",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Input
                  name="verificationCode"
                  label="Verification Code"
                  placeholder="Enter verification code"
                  inputProps={{
                    maxLength: 6,
                    inputMode: "numeric",
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Verify Account
                </Button>

                <Typography
                  variant="body2"
                  align="center"
                >
                  Didn't receive the code?{" "}
                  <Button
                    type="button"
                    variant="text"
                    sx={{
                      minWidth: "auto",
                      p: 0,
                      textTransform: "none",
                    }}
                    onClick={() => {
                      console.log("Resend verification code");
                    }}
                  >
                    Resend Code
                  </Button>
                </Typography>

                <Typography
                  variant="body2"
                  align="center"
                >
                  <Link to="/auth/login">
                    Back to Login
                  </Link>
                </Typography>
              </Stack>
            </Form>
          )}
        </Formik>
      </Card>
    </Box>
  );
};

export default VerifyAccount;
