import { Component } from "react";
import { Box, Button, Typography } from "@mui/material";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Box
          role="alert"
          sx={{ display: "grid", gap: 2, justifyItems: "center", textAlign: "center", mt: 8, px: 3 }}
        >
          <Typography variant="h1">Something went wrong</Typography>
          <Typography color="text.secondary">
            Reload the page to try again. Your tasks are stored on the server.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
