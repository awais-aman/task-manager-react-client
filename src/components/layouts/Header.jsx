import { Box, Button, Container, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";

import Wordmark from "components/shared/Wordmark";
import { colors } from "assets/theme";
import { logout } from "store/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <Box component="header" sx={{ bgcolor: "ink.main", color: "ink.contrastText" }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          py: 2,
        }}
      >
        <Wordmark />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Typography variant="body2" sx={{ color: "rgba(245, 241, 232, 0.8)" }}>
            Signed in as{" "}
            <Box component="strong" sx={{ color: colors.brassLight }}>
              {user?.email}
            </Box>
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={() => dispatch(logout())}
          >
            Log out
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
