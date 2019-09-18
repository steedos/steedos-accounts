import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CssBaseline, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ThemeProvider } from '@material-ui/styles';
import { connect } from 'react-redux';
import { getTenant } from './selectors';

import Logo from './components/Logo';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import TwoFactor from './components/TwoFactor';
import UpdatePassword from './components/updatePassword';
import CreateTenant from './components/CreateTenant';

import theme from './theme';


const Router = ({tenant}:any) => {

  let backgroundUrl = require("./assets/background.svg");
  if (tenant.background_url) {
    backgroundUrl = tenant.background_url 
  }

  const useStyles = makeStyles({
    root: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backgroundImage: "url(" + backgroundUrl + ")",
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
      padding: 32,
    },
  });

  const classes = useStyles();

  return (
    <BrowserRouter basename="/accounts/a">
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <Grid container className={classes.rootGrid}>
            <Grid item xs={12}>
              <Paper className={classes.container}>
                <CssBaseline />
                <Logo></Logo>
                <Route exact path="/" component={Home} />
                <Route path="/two-factor" component={TwoFactor} />

                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/create-tenant" component={CreateTenant} />
                <Route exact path="/reset-password" component={ResetPassword} />
                <Route exact path="/update-password" component={UpdatePassword} />
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

function mapStateToProps(state: any) {
  return {
    tenant: getTenant(state),
  };
}

export default connect(mapStateToProps)(Router);