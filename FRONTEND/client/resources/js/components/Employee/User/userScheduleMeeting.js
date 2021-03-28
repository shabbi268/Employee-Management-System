import React, { useEffect, useState } from 'react';
import axios from "../../../../../../axios";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Typography } from '@material-ui/core';
import toast from "react-hot-toast";
import produce from "immer";
import Spinner from "../../shared/A-UI/Spinner/spinner";
import dateConverter from "../../shared/A-UI/dateConverter";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { sendEmail } from "../../shared/A-UI/NodeMailer/mailer";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            marginTop: "25px"
        },
    },
    formControl: {
        minWidth: "24rem",
        marginTop: "10px",
    },
}));

export default function UserScheduleMeeting({ user }) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(user);
    const [meeting, setMeeting] = useState({
        date: new Date(),
        time: "",
        recipientEmail: "",
        user: user
    })

    const textFieldProps = {
        variant: "outlined",
        margin: "normal",
        fullWidth: true,
        inputProps: {
            style: { fontFamily: "sans-serif" },
        },
    };

    useEffect(() => {
        setIsLoading(true);
        async function fetchUsersList() {
            let usersList = await axios.get("/users.json")
                .then((res) => {
                    let response1 = [];
                    for (const [key, value] of Object.entries(res.data)) {
                        value[`id`] = key;
                        if (value.email) {
                            response1.push(value);
                        }
                    }
                    return response1;
                })
                .catch((err) => {
                    toast.error(
                        "Oops! Something went wrong. Please refresh the page and try again."
                    );
                    setIsLoading(false);
                });
            setUsers(usersList);
            setIsLoading(false);
        }

        fetchUsersList();

    }, [])

    console.log(`users: `, users);
    const handleFieldChange = (key, value) => {
        setMeeting(
            produce((draftState) => {
                draftState[key] = value;
            })
        );
    };

    const handleDate = (event) => {
        const date = dateConverter(event.target.value);
        setMeeting({ date: date, time: meeting.time, recipientEmail: meeting.recipientEmail, user: meeting.user })
    }

    const onSubmit = (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        try {
            const mailOptions = {
                subject: 'Meeting Scheduled with ' + meeting.user.email,
                employeeName: meeting.recipientEmail,
                message: 'A meeting has been scheduled with ' + meeting.user.email + ' on ' + meeting.date + ', at ' + meeting.time,
                userEmail: meeting.recipientEmail,
            };
            sendEmail(mailOptions);
            setIsLoading(false);
            toast.success("Meeting Scheduled Successfully.")
            setMeeting({ date: new Date(), recipientEmail: "", time: "", user: user })
        }
        catch (err) {
            setIsLoading(false);
            toast.error(
                "Oops! Something went wrong. Please refresh the page and try again."
            );
        }
    }

    return (
        <div>
            This is Schedule meeting page
            <div style={{ border: "dashed 2px darkblue" }}>
                {!isLoading && <form onSubmit={onSubmit} id="schedule-meeting-form" style={{
                    margin: "10px", display: "block",
                    marginLeft: "12rem",
                    marginRight: "12rem"
                }} noValidate autoComplete="off">
                    <Typography variant="h4" style={{ textAlign: "center" }} >Schedule Meeting</Typography>
                    <Typography style={{ textAlign: "left" }}>Meeting Date:</Typography>
                    <TextField
                        type="date"
                        variant="outlined"
                        margin="normal"
                        value={meeting.date}
                        {...textFieldProps}
                        onChange={(e) => handleDate(e)}>
                    </TextField>
                    <TextField label="Time*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={meeting.time}
                        onChange={(e) => handleFieldChange("time", e.target.value)}
                        autoFocus
                        {...textFieldProps} />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Meeting With*:</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={meeting.recipientEmail}
                            onChange={(e) => handleFieldChange("recipientEmail", e.target.value)}
                        >
                            {users.map((user) => {
                                return (
                                    <MenuItem key={user.id} value={user.email}>{user.email}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                    <div className={classes.root}>
                        <Button type="submit"
                            form="schedule-meeting-form"
                            variant="contained"
                            color="primary">Schedule</Button>
                        <Button type="cancel"
                            form="schedule-meeting-form"
                            variant="contained"
                            onClick={() => { setMeeting({ date: new Date(), recipientEmail: "", time: "", user: user }) }}
                            color="secondary">Cancel</Button>
                    </div>
                </form>}
                {isLoading && <Spinner loading={isLoading}></Spinner>}
            </div>
        </div>
    )
}
