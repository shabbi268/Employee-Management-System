import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import toast from "react-hot-toast";
import axios from "../../../../../../axios";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { DialogTitle, Typography } from "@material-ui/core";
import Spinner from "../../shared/A-UI/Spinner/spinner";
import TextField from '@material-ui/core/TextField';
import produce from "immer";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        table: {
            minWidth: 650,
        },
    }),
);

export default function UserViewSchedule({ user }) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [noData, setNoData] = useState(false)
    const [addSchedule, setAddSchedule] = useState(false);
    const [updateSchedule, setUpdateSchedule] = useState(false);
    const [scheduleObject, setScheduleObject] = useState({
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        user: user
    });
    const [userSchedule, setUserSchedule] = useState([]);


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
        axios.get('/schedules.json')
            .then((res) => {
                if (!res.data) {
                    setNoData(true);
                    toast.error("No Schedules Found");
                }
                let response = [];
                for (const [key, value] of Object.entries(res.data)) {
                    value.id = key;
                    if (value.user.id == user.id) {
                        response.push(value);
                    }
                }
                if (response.length == 0) {
                    setNoData(true);
                }
                setUserSchedule(response);
                setIsLoading(false);
                setNoData(false);

            })
            .catch((err) => {
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
                setIsLoading(false);
            })
    }, [addSchedule])


    const renderAddSchedule = () => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

        const handleFieldChange = (key, value) => {
            setScheduleObject(
                produce((draftState) => {
                    draftState[key] = value;
                })
            );
        };

        const confirmAddSchedule = async (scheduleObject) => {
            setIsLoading(true);
            try {
                await axios.post('/schedules.json', scheduleObject)
                    .then((res) => {
                        toast.success("Employee Schedule Added Successfully.");
                        setIsLoading(false);
                        setAddSchedule(false);
                    })
                    .catch(err => {
                        setIsLoading(false);
                        setAddSchedule(false);
                    });
                setIsLoading(false);
                setAddSchedule(false);
            }
            catch (err) {
                setIsLoading(false);
                setAddSchedule(false);
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
            }
        }

        return (
            <Dialog
                open={addSchedule}
                onClose={() => setAddSchedule(false)}
            >
                <DialogTitle style={{ textAlign: "center" }}>Add Schedule</DialogTitle>
                <div style={{ padding: "15px" }}>
                    <Typography variant="subtitle2">Please enter number of hours you will be working each day.</Typography>
                </div>
                <DialogContent>
                    <form id="request-change-form" style={{
                        display: "block",
                    }} noValidate autoComplete="off">
                        {days.map((day, index) => {
                            return (<TextField
                                key={index}
                                label={day}
                                type="number"
                                variant="outlined"
                                margin="normal"
                                value={scheduleObject[day]}
                                onChange={(e) => handleFieldChange(day, e.target.value)}
                                autoFocus={index == 0}
                                {...textFieldProps} />)
                        })}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddSchedule(false)}>Cancel</Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => confirmAddSchedule(scheduleObject)}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <div>
            {!isLoading && userSchedule.length > 0 && <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Monday</TableCell>
                                <TableCell align="center">Tuesday</TableCell>
                                <TableCell align="center">Wednesday</TableCell>
                                <TableCell align="center">Thursday</TableCell>
                                <TableCell align="center">Friday</TableCell>
                                {/* <TableCell align="center">Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={userSchedule[0].id}>
                                <TableCell align="center">
                                    {userSchedule[0].Monday}Hrs
                                </TableCell>
                                <TableCell align="center">{userSchedule[0].Tuesday}Hrs</TableCell>
                                <TableCell align="center">{userSchedule[0].Wednesday}Hrs</TableCell>
                                <TableCell align="center">{userSchedule[0].Thursday}Hrs</TableCell>
                                <TableCell align="center">{userSchedule[0].Friday}Hrs</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}
            <div className={classes.root}>
                <Button color="primary" variant="outlined" size="medium" onClick={() => { setAddSchedule(true); setUpdateSchedule(false); }}>
                    Add Schedule
                </Button>
            </div>
            { addSchedule && renderAddSchedule()}
            { isLoading && <Spinner loading={isLoading}></Spinner>}
        </div>
    )
}
