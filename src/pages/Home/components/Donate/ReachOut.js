import { Stack, useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import EmailIcon from "@mui/icons-material/Email";

const ReachOut = () => {
  const theme = useTheme();

  return (
    <Stack>
      <a
        href="https://airtable.com/shreuEqEiILbGu7NN"
        target="_blank"
        rel="noreferrer"
        style={{
          textDecoration: "none",
          width: "100%",
          maxWidth: "250px",
          margin: "0px auto",
        }}
      >
        <Button
          startIcon={<EmailIcon />}
          variant="outlined"
          size="large"
          style={{ width: "100%" }}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            fontWeight: "bold",
            justifyContent: "left",
            textTransform: "none",
            my: 0.5,
            px: 1.5,
          }}
        >
          Contact
        </Button>
      </a>
    </Stack>
  );
};

export default ReachOut;
