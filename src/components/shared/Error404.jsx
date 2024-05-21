import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import Wordmark from "components/shared/Wordmark";

const NotFound = () => (
  <Box
    component="main"
    sx={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      p: 3,
    }}
  >
    <Box sx={{ display: "grid", gap: 2, justifyItems: "center" }}>
      <Wordmark />
      <Typography variant="h1">Page not found</Typography>
      <Typography color="text.secondary">
        There is nothing filed under this address.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Back to your tasks
      </Button>
    </Box>
  </Box>
);

export default NotFound;
