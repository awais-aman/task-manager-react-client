import React from "react";
import { Button } from "@mui/material";

import { styles } from "assets/styles";

const ButtonComponent = (props) => {
  const classes = styles();

  return (
    <Button className={classes.button} {...props}>
      {props.children}
    </Button>
  );
};

export default ButtonComponent;
