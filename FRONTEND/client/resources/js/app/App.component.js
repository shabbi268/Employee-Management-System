import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { BrowserRouter, Route } from 'react-router-dom';
import { DashboardBulletin } from '../components/Dashboard/bulletin';
import { AdminEmployeeNew } from '../components/Employee/Admin/new';
import { AssessmentList } from '../components/Employee/Admin/list';
import { UserEmployeeView } from "../components/Employee/User/view";
import { Toaster } from "react-hot-toast";

export function App() {
  return <>
    <BrowserRouter>
      <div >
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
        <Route path="/admin/employee/new" component={AdminEmployeeNew} />
        <Route path="/user/employee/*" component={UserEmployeeView} />
        {/* <Route path="/assessment/list" component={AssessmentList} /> */}
        <Toaster />
      </div>

    </BrowserRouter>
  </>;
}