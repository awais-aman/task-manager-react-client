import React from "react";
import { Divider } from "@mui/material";

import { styles } from "assets/styles";

const DividerComponent = () => {
  const classes = styles();

  return <Divider className={classes.divider}></Divider>;
};

export default DividerComponent;
