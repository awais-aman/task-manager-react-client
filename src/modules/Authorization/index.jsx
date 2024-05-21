import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

import Heading from "components/shared/Heading";
import TextField from "components/shared/TextField";
import Button from "components/shared/Button";
import validationSchema from "modules/Authorization/validationSchema";
import { styles } from "assets/styles";
import { authenticate, selectIsSignedIn } from "store/slices/authSlice";
import { toastErrors } from "helpers/errorMessages";

const LoginSignupPage = ({ isLogin = false }) => {
  const classes = styles();
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

  const switchAuthHandler = () => {
    isLogin ? navigate("/sign-up") : navigate("/login");
  };

  return (
    <Box className={classes.authContainer}>
      <Heading text={isLogin ? "Login" : "Sign Up"} />
      <Formik
        enableReinitialize
        initialValues={formState}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
          <Form className={classes.authForm}>
            {!isLogin && (
              <TextField name="firstName" placeholder="First Name" />
            )}
            {!isLogin && <TextField name="lastName" placeholder="Last Name" />}
            <TextField name="email" placeholder="Email Address" />
            <TextField name="password" type="password" placeholder="Password" />
            {!isLogin && (
              <TextField
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
              />
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </Form>
        )}
      </Formik>
      <Button onClick={switchAuthHandler}>
        {isLogin ? "Go to Sign Up" : "Go to Login"}
      </Button>
    </Box>
  );
};

export default LoginSignupPage;
