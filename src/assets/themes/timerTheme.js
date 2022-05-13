import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          zIndex: "1", //drawer z-index default 1300
          minHeight: "64px",
          justifyContent: "center",
          backgroundColor: "#feecc5"
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#feecc5"
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "#8192c8",
          textTransform: "initial",
          color: "#fff",
          ":hover": {
            backgroundColor: "#adb4d1"
          }
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff"
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "10px"
        }
      }
    }
  },
  palette: {
    primary: {
      main: "#8192c8",
      contrastText: "#fff"
    },
    secondary: {
      main: "#feecc5",
      contrastText: "#fff"
    },
    error: {
      main: "#bf565b",
      contrastText: "#fff"
    },
  }
})

export default theme