import "./bootstrap";

import React from "react";
import ReactDOM from "react-dom";
// important to be here
import { ThemeProvider, makeStyles } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import "./styles.css";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#900"
    },
    secondary: {
      main: "#00c853"
    }
  },
  overrides: {
    MuiButton: {
      text: {
        color: "red",
        background: "yellow"
      }
    }
  },
  typography: {
    useNextVariants: true
  }
});

const useStyles = makeStyles(theme => {
  console.log(theme);
  return {
    root: {
      background: "blue",
      border: "1px solid red"
    }
  };
});

function Test() {
  const classes = useStyles();
  return <Button className={classes.root}>Testuuuu</Button>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Button>Test</Button>
          <Test />
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
