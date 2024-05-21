import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";

import { layoutStyles } from "components/layouts/layoutStyles";
import { logoutAction } from "store/actions/auth";

const Header = () => {
  const classes = layoutStyles();

  const dispath = useDispatch();

  const { user } = useSelector((state) => state.authReducer);

  const handleLogout = () => dispath(logoutAction());

  return (
    <Box className={classes.headerContainer}>
      <div className={classes.headerContent}>
        <h1 className={classes.title}>Task Vault</h1>
        <div>
          <Typography component="span" className={classes.logoutText}>
            <div>
              Logged in as:{" "}
              <Box component="span" className={classes.emailText}>
                {user?.email}
              </Box>
            </div>
          </Typography>
          <div>
            <LogoutIcon />
            <Button onClick={handleLogout} className={classes.logoutButton}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Header;
