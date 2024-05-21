import React from "react";
import { Box, Typography } from "@mui/material";

import { layoutStyles } from "components/layouts/layoutStyles";

const Footer = () => {
  const classes = layoutStyles();

  return (
    <Box className={classes.footerContainer}>
      <div className={classes.footerContent}>
        <Box className={classes.missionContainer}>
          <h2 className={classes.footerHeading}>Our Mission</h2>
          <p className={`text-sm text-gray-400 ${classes.footerText}`}>
            At our Task Vault App, we are dedicated to helping you stay
            organized, focused, and achieve your goals. We provide a
            user-friendly platform to manage your tasks effectively, prioritize
            your work, and make progress towards your objectives. Let us be your
            companion on your journey to success.
          </p>
        </Box>
        <Typography className={classes.copyRightText}>
          © 2023 All rights reserved.
        </Typography>
      </div>
    </Box>
  );
};

export default Footer;
