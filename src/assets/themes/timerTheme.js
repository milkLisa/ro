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