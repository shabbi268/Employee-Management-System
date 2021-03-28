import { Button, Typography } from '@material-ui/core';
import React from 'react';

export function DashboardBulletin() {
  return (
    <>
      <div style={{ marginTop: "16rem", textAlign: "center", fontFamily: 'sans-serif' }}>
        <Typography variant="h3">Welcome to Employee Management Application</Typography>
        <Button style={{ marginTop: "20px" }} color="primary" variant="contained" size="medium" onClick={() => { window.location.replace("/login") }}>
          Login/Register
        </Button>
      </div>
    </>
  );
}