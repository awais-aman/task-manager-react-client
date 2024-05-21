import React from "react";
import { Typography } from "@mui/material";

import { styles } from "assets/styles";

const Heading = ({ text }) => {
  const classes = styles();

  return <Typography className={classes.typographyText}>{text}</Typography>;
};

export default Heading;
