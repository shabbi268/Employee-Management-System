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

export function AdminViewSchedules() {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [noData, setNoData] = useState(false);
    const [schedulesList, setSchedulesList] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        axios.get('/schedules.json')
            .then((res) => {
                console.log(`res: `, res);
                if (!res.data) {
                    setNoData(true);
                    toast.error("No Schedules Found");
                }
                let response = [];
                for (const [key, value] of Object.entries(res.data)) {
                    value.id = key;
                    response.push(value);
                }
                if (response.length == 0) {
                    setNoData(true);
                }
                setSchedulesList(response);
                setIsLoading(false);
                setNoData(false);
                toast.success("Successfully fetched employee schedules")

            })
            .catch((err) => {
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
                setIsLoading(false);
            })
    }, [])

    console.log(`schedulesList: `, schedulesList);

    return (
        <div>
            {!isLoading && schedulesList.length > 0 && <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">First Name</TableCell>
                                <TableCell align="center">Last Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Monday</TableCell>
                                <TableCell align="center">Tuesday</TableCell>
                                <TableCell align="center">Wednesday</TableCell>
                                <TableCell align="center">Thursday</TableCell>
                                <TableCell align="center">Friday</TableCell>
                            </TableRow>
                        </TableHead>
                        {schedulesList.map((schedule, index) => {
                            return (
                                <TableBody key={schedule.id}>
                                    <TableRow key={schedule.id}>
                                        <TableCell align="center">{schedule.user?.firstname}</TableCell>
                                        <TableCell align="center">{schedule.user?.lastname}</TableCell>
                                        <TableCell align="center">{schedule.user?.email}</TableCell>
                                        <TableCell align="center">
                                            {schedule.Monday}Hrs
                                        </TableCell>
                                        <TableCell align="center">{schedule.Tuesday}Hrs</TableCell>
                                        <TableCell align="center">{schedule.Wednesday}Hrs</TableCell>
                                        <TableCell align="center">{schedule.Thursday}Hrs</TableCell>
                                        <TableCell align="center">{schedule.Friday}Hrs</TableCell>
                                    </TableRow>
                                </TableBody>
                            )
                        })
                        }
                    </Table>
                </TableContainer>
            </div>}
            {isLoading && <Spinner loading={isLoading}></Spinner>}
        </div>
    )
}
