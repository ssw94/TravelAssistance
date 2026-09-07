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

const Register = () => {
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
          Create Account 🚀
        </Heading>

        <SubHeading
          align="center"
          sx={{ mb: 4 }}
        >
          Join us and start your journey
        </SubHeading>

        <Formik
          initialValues={{
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Input
                  name="fullName"
                  label="Full Name"
                  autoComplete="name"
                />

                <Input
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                />

                <Input
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                />

                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Create Account
                </Button>

                <Typography
                  variant="body2"
                  align="center"
                >
                  Already have an account?{" "}
                  <Link to="/auth/login">
                    Login
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

export default Register;
