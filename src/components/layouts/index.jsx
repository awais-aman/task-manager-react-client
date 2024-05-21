import { Box, Container, Typography } from "@mui/material";

import Header from "components/layouts/Header";
import Footer from "components/layouts/Footer";
import DashboardPage from "modules/Tasks";

const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

const Layout = () => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    <a className="skip-link" href="#main">
      Skip to tasks
    </a>
    <Header />
    <Container component="main" id="main" maxWidth="lg" sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
      <Typography component="h1" sx={visuallyHidden}>
        Task workspace
      </Typography>
      <DashboardPage />
    </Container>
    <Footer />
  </Box>
);

export default Layout;
