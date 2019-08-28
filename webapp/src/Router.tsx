import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CssBaseline, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider } from '@material-ui/styles';

import Logo from './components/Logo';
import Signup from './components/Signup';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import TwoFactor from './components/TwoFactor';

import SteedosHome from './components/SteedosHome'
import SteedosLogout from './components/SteedosLogout'

import theme from './theme';

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backgroundImage: "url(" + require("./assets/background.jpg") + ")",
    backgroundSize: "cover",
    height: "100%",
  },
  rootBackgroundFade: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  rootGrid: {
    margin: 'auto',
    maxWidth: 380,
    minWidth: 320,
  },
  container: {
    padding: 16,
  },
});

const Router = () => {
  const classes = useStyles();

  return (
    <BrowserRouter basename="/accounts">
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <Grid container className={classes.rootGrid}>
            <Grid item xs={12}>
              <Logo></Logo>
              <Paper>
                <CssBaseline />
                <Route exact path="/" component={SteedosHome} />
                <Route path="/two-factor" component={TwoFactor} />

                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={SteedosLogout} />
                <Route exact path="/reset-password" component={ResetPassword} />
                <Route path="/reset-password/:token" component={ResetPassword} />
                <Route path="/verify-email/:token" component={VerifyEmail} />
              </Paper>
            </Grid>
          </Grid>
          <div className={classes.rootBackgroundFade}></div>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default Router;
