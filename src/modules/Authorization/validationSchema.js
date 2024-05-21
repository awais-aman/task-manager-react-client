import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("* Invalid Email Address")
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, '* Invalid Email Address')
    .required("* Email Address Required"),
  password: Yup.string().min(6, "* Minimum 6 characters").required("* Password Required"),
  firstName: Yup.string().when("isLogin", {
    is: (val) => !val,
    then: () => Yup.string().required("* First Name Required"),
  }),
  lastName: Yup.string().when("isLogin", {
    is: (val) => !val,
    then: () => Yup.string().required("* Last Name Required"),
  }),
  confirmPassword: Yup.string().when("isLogin", {
    is: (val) => !val,
    then: () =>
      Yup.string()
        .oneOf([Yup.ref("password"), null], "* Passowrds must match")
        .required("* Confirm Password Required"),
  }),
});

export default schema;
