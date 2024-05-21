import * as Yup from "yup";

const schema = Yup.object().shape({
  title: Yup.string().required("* Title Required"),
  description: Yup.string().required("* Description Required"),
});

export default schema;
