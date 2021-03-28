import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import { AdminEmployeeNew } from "../Admin/new";
import { AdminEmployeeView } from "../Admin/list";
import AdminManageLeavesView from "../Admin/manageLeavesView";
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);

export function AdminOptions() {
    const classes = useStyles();
    const [newEmployee, setNewEmployee] = useState(false);
    const [viewEmployee, setViewEmployee] = useState(false);
    const [manageLeaves, setManageLeaves] = useState(false);

    const renderAdminEmployeeNew = () => {
        return <AdminEmployeeNew />
    }

    const renderAdminEmployeeView = () => {
        return <AdminEmployeeView />
    }

    const renderAdminManageLeaves = () => {
        return <AdminManageLeavesView />
    }

    return (
        <div>
            <Typography variant="h3">Admin Options</Typography>
            <div style={{ marginTop: "10px" }}>
                <div className={classes.root}>
                    <Button color="primary" variant="outlined" size="medium" onClick={() => { setNewEmployee(true); setViewEmployee(false); setManageLeaves(false) }}>
                        Add New Employee
                    </Button>
                    <Button color="primary" variant="outlined" size="medium" onClick={() => { setViewEmployee(true); setNewEmployee(false); setManageLeaves(false) }}>
                        View Employee List
                    </Button>
                    <Button color="primary" variant="outlined" size="medium" onClick={() => { setViewEmployee(false); setNewEmployee(false); setManageLeaves(true) }}>
                        View Leave Applications
                    </Button>
                </div>
                <div style={{ marginTop: "20px" }}>{newEmployee && renderAdminEmployeeNew()}</div>
                <div style={{ marginTop: "20px" }}>{viewEmployee && renderAdminEmployeeView()}</div>
                <div style={{ marginTop: "20px" }}>{manageLeaves && renderAdminManageLeaves()}</div>
            </div>
            <Button style={{ marginTop: "10px" }} color="primary" variant="contained" size="medium" onClick={() => { window.location.replace("/login") }}>
                Log Out
            </Button>
        </div>
    )
}
