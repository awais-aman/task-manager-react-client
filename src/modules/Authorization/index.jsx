import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { Box, Button, Link, Paper, Typography } from "@mui/material";
import { toast } from "react-toastify";

import TextField from "components/shared/TextField";
import Wordmark from "components/shared/Wordmark";
import validationSchema from "modules/Authorization/validationSchema";
import { authenticate, selectIsSignedIn } from "store/slices/authSlice";
import { toastErrors } from "helpers/errorMessages";
import { displayFont } from "assets/theme";

const LoginSignupPage = ({ isLogin = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signedIn = useSelector(selectIsSignedIn);

  const formState = useMemo(
    () => ({
      isLogin,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }),
    [isLogin]
  );

  if (signedIn) return <Navigate to="/" replace />;

  const handleSubmit = async (values) => {
    const credentials = {
      user: { email: values.email.trim(), password: values.password },
    };
    if (!isLogin) {
      credentials.user.first_name = values.firstName.trim();
      credentials.user.last_name = values.lastName.trim();
    }
    try {
      const session = await dispatch(
        authenticate({ credentials, isLogin })
      ).unwrap();
      if (session.token) {
        toast.success(isLogin ? "Logged in successfully" : "Registered successfully");
        navigate("/", { replace: true });
      } else {
        toast.success("Account created. Log in to continue.");
        navigate("/login");
      }
    } catch (messages) {
      toastErrors(messages);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" },
      }}
    >
      <Box
        sx={{
          bgcolor: "ink.main",
          color: "ink.contrastText",
          p: { xs: 3, md: 6 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Wordmark />
        <Box sx={{ display: { xs: "none", md: "block" }, maxWidth: 420 }}>
          <Typography
            sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "2.25rem", lineHeight: 1.15 }}
          >
            Keep every deadline on the books.
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(245, 241, 232, 0.8)" }}>
            Log tasks with a priority and a due day, move them from pending to
            done, and see at a glance which ones are overdue.
          </Typography>
        </Box>
      </Box>
      <Box
        component="main"
        sx={{ display: "grid", placeItems: "center", p: { xs: 2, sm: 4 } }}
      >
        <Paper sx={{ p: { xs: 3, sm: 4 }, width: "100%", maxWidth: 440 }}>
          <Typography variant="h1" sx={{ mb: 0.5 }}>
            {isLogin ? "Log in" : "Create an account"}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {isLogin
              ? "Welcome back. Your tasks are waiting."
              : "It takes a minute, and your tasks stay on your server."}
          </Typography>
          <Formik
            enableReinitialize
            initialValues={formState}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnBlur={false}
          >
            {({ isSubmitting }) => (
              <Box component={Form} noValidate sx={{ display: "grid", gap: 2 }}>
                {!isLogin && (
                  <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                    <TextField name="firstName" label="First name" autoComplete="given-name" />
                    <TextField name="lastName" label="Last name" autoComplete="family-name" />
                  </Box>
                )}
                <TextField name="email" type="email" label="Email address" autoComplete="email" />
                <TextField
                  name="password"
                  type="password"
                  label="Password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                {!isLogin && (
                  <TextField
                    name="confirmPassword"
                    type="password"
                    label="Confirm password"
                    autoComplete="new-password"
                  />
                )}
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {isLogin ? "Log in" : "Sign up"}
                </Button>
              </Box>
            )}
          </Formik>
          <Typography variant="body2" sx={{ mt: 3 }}>
            {isLogin ? "New here? " : "Already have an account? "}
            <Link component={RouterLink} to={isLogin ? "/sign-up" : "/login"} color="primary" fontWeight={600}>
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginSignupPage;
