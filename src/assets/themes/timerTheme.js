import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  components: {
    MuiModal: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          maxWidth: "100%"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "10px"
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          whiteSpace: "pre-line"
        }
      }
    }
  },
  palette: {
    primary: {
      main: "#8192c8",
      contrastText: "#fff"
    }
  }
})

export default theme