import React from "react";
import { Puff } from "react-loader-spinner";
import { Box } from "@mui/material";
import { useTheme } from "@mui/styles";

import { styles } from "assets/styles";

const Loader = ({ bgWhite }) => {
  const classes = styles();
  const theme = useTheme();

  return (
    <Box className={classes.loaderContainer}>
      <Box className={bgWhite ? classes.loaderWhiteBg : classes.loaderBlurBg}></Box>
      <Box className={classes.loader}>
        <Puff color={theme.palette.layoutTextColor} height={80} width={80} />
      </Box>
    </Box>
  );
};

export default Loader;
