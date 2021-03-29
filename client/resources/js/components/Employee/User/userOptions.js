import React, { useState } from 'react';
import { UserEmployeeView } from "./view";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import UserApplyLeave from "./userApplyLeave";
import UserViewLeaves from "./userViewLeaves";
import UserViewSchedule from "./userViewSchedule";
import UserScheduleMeeting from "./userScheduleMeeting";


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);

export function UserOptions({ user }) {
    const classes = useStyles();
    const [viewMyData, setViewMyData] = useState(false);
    const [applyLeave, setApplyLeave] = useState(false);
    const [viewLeaves, setViewLeaves] = useState(false);
    const [viewSchedule, setViewSchedule] = useState(false);
    const [scheduleMeeting, setScheduleMeeting] = useState(false);

    const renderUserEmployeeView = () => {
        return (<div><UserEmployeeView user={user} /></div>)
    }

    const renderApplyLeave = () => {
        return (<UserApplyLeave user={user} />)
    }

    const renderViewMyLeaves = () => {
        return (<UserViewLeaves user={user} />)
    }

    const renderViewSchedule = () => {
        return (<UserViewSchedule user={user} />)
    }

    const renderScheduleMeeting = () => {
        return (<UserScheduleMeeting user={user} />)
    }

    return (
        <div>
            <Typography variant="h3">User Options</Typography>
            <div style={{ marginTop: "10px" }}>
                <div className={classes.root}>
                    <Button color="primary" variant="contained" size="medium" onClick={() => { setViewMyData(true); setApplyLeave(false); setViewLeaves(false); setViewSchedule(false); setScheduleMeeting(false) }}>
                        View My Profile
                    </Button>
                    <Button color="primary" variant="contained" size="medium" onClick={() => { setApplyLeave(true); setViewMyData(false); setViewLeaves(false); setViewSchedule(false); setScheduleMeeting(false) }}>
                        Apply For Leave
                    </Button>
                    <Button color="primary" variant="contained" size="medium" onClick={() => { setApplyLeave(false); setViewMyData(false); setViewLeaves(true); setViewSchedule(false); setScheduleMeeting(false) }}>
                        View My Leave Applications
                    </Button>
                    <Button color="primary" variant="contained" size="medium" onClick={() => { setApplyLeave(false); setViewMyData(false); setViewLeaves(false); setViewSchedule(true); setScheduleMeeting(false) }}>
                        View My Work Schedule
                    </Button>
                    <Button color="primary" variant="contained" size="medium" onClick={() => { setApplyLeave(false); setViewMyData(false); setViewLeaves(false); setViewSchedule(false); setScheduleMeeting(true) }}>
                        Schedule a Meeting
                    </Button>
                </div>
                <div style={{ marginTop: "20px" }}>{viewMyData && renderUserEmployeeView()}</div>
                <div style={{ marginTop: "20px" }}>{applyLeave && renderApplyLeave()}</div>
                <div style={{ marginTop: "20px" }}>{viewLeaves && renderViewMyLeaves()}</div>
                <div style={{ marginTop: "20px" }}>{viewSchedule && renderViewSchedule()}</div>
                <div style={{ marginTop: "20px" }}>{scheduleMeeting && renderScheduleMeeting()}</div>
            </div>
            <Button style={{ marginTop: "10px" }} color="primary" variant="contained" size="medium" onClick={() => { window.location.replace("/login") }}>
                Log Out
            </Button>
        </div>
    )
}
