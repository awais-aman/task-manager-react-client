import { Box, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { colors, displayFont } from "assets/theme";

const Wordmark = ({ component = "p" }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
    <Box
      aria-hidden
      sx={{
        display: "grid",
        placeItems: "center",
        width: 34,
        height: 34,
        borderRadius: "8px",
        bgcolor: colors.brassLight,
        color: colors.ink,
      }}
    >
      <LockOutlinedIcon fontSize="small" />
    </Box>
    <Typography
      component={component}
      sx={{ fontFamily: displayFont, fontWeight: 700, fontSize: "1.25rem", m: 0 }}
    >
      Task Vault
    </Typography>
  </Box>
);

export default Wordmark;
