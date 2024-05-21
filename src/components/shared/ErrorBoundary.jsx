import React, { Component } from "react";
import { Box, Typography } from "@mui/material";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            rowGap: theme.spacing(2),
            marginTop: theme.spacing(5),
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Typography variant="h2">Something went wrong</Typography>
          <Typography>
            Please try refreshing the page. If still not working, try revisitng
            the URL after 20 minutes.
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
