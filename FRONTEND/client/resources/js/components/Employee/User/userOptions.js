import React, { useState } from 'react';
import { UserEmployeeView } from "../User/view";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
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

export function UserOptions({ user }) {
    const classes = useStyles();
    const [viewMyData, setViewMyData] = useState(false);

    const renderUserEmployeeView = () => {
        return (<div><UserEmployeeView user={user} /></div>)
    }

    return (
        <div>
            <Typography variant="h3">User Options</Typography>
            <div style={{ marginTop: "10px" }}>
                <div className={classes.root}>
                    <Button color="primary" variant="outlined" size="medium" onClick={() => { setViewMyData(true) }}>
                        View My Profile
                    </Button>
                </div>
                <div style={{ marginTop: "20px" }}>{viewMyData && renderUserEmployeeView()}</div>
            </div>
            <Button style={{ marginTop: "10px" }} color="primary" variant="contained" size="medium" onClick={() => { window.location.reload() }}>
                Log Out
            </Button>
        </div>
    )
}
