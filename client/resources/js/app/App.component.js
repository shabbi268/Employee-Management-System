import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { BrowserRouter, Route } from 'react-router-dom';
import { DashboardBulletin } from '../components/Dashboard/bulletin';
import { Login } from "../components/LoginForm/login";
import { Toaster } from "react-hot-toast";

export class App extends React.Component {
  render() {
    return <>
      <BrowserRouter>
        <div>
          <AppBar position="static">
            <Toolbar>
              <div style={{ display: "flex" }}>
                <a href="/home" style={{ textDecoration: "none" }}>
                  <Typography variant="h6" >
                    <Button style={{ color: "#fff" }}>Employee Management System</Button>
                  </Typography>
                </a>
              </div>
            </Toolbar>
          </AppBar>
          <Route path="/home" component={DashboardBulletin} />
          <Route path="/login" exact component={Login} />
          <Toaster />
        </div>

      </BrowserRouter>
    </>;
  }
}