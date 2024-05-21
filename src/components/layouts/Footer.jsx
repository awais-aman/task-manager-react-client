import { Box, Container, Typography } from "@mui/material";

const Footer = () => (
  <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", mt: 6 }}>
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="body2" color="text.secondary">
        Task Vault keeps your tasks on your own to_do_app_backend server.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
