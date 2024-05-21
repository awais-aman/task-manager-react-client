import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { Box } from "@mui/material";

import Heading from "components/shared/Heading";
import TextField from "components/shared/TextField";
import Button from "components/shared/Button";
import validationSchema from "modules/Authorization/validationSchema";
import { styles } from "assets/styles";
import { loginAction } from "store/actions/auth";

const LoginSignupPage = ({ isLogin = false }) => {
  const classes = styles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    isLogin,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmEmail: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    setFormState({
      isLogin,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [isLogin]);

  const handleSubmit = (values) => {
    const body = {
      user: {
        email: values?.email,
        password: values?.password,
      },
    };
    if (!isLogin) {
      body.user.first_name = values?.firstName;
      body.user.last_name = values?.lastName;
    }
    dispatch(loginAction(body, isLogin, navigate));
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
        {() => (
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
            <Button type="submit">{isLogin ? "Login" : "Sign Up"}</Button>
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
