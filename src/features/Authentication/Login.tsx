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

const Login = () => {
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
      <Card sx={{ width: 420, p: 5 }}>
        <Heading align="center">
          Welcome Back 👋
        </Heading>

        <SubHeading align="center" sx={{ mb: 4 }}>
          Sign in to your account
        </SubHeading>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={(values) => console.log(values)}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Input
                  name="email"
                  label="Email"
                />

                <Input
                  name="password"
                  label="Password"
                  type="password"
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                >
                  Login
                </Button>

                <Typography
                  variant="body2"
                  align="center"
                >
                  Don't have an account?{" "}
                  <Link to="/auth/register">
                    Register
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

export default Login;
