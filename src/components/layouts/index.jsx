import React from "react";
import { Box } from "@mui/material";

import Header from "components/layouts/Header";
import Footer from "components/layouts/Footer";
import DashboardPage from "modules/Tasks";
import { styles } from "assets/styles";

const Layout = () => {
  const classes = styles();

  return (
    <Box className={classes.container}>
      <Header />
      <DashboardPage />
      <Footer />
    </Box>
  );
};

export default Layout;
