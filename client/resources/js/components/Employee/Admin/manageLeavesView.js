import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from "../../../../../../axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import toast from 'react-hot-toast';
import TextField from '@material-ui/core/TextField';
import produce from "immer";
import Spinner from "../../shared/A-UI/Spinner/spinner";
import { Button, Typography } from '@material-ui/core';
import { sendEmail } from "../../shared/A-UI/NodeMailer/mailer";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    button: {
        margin: theme.spacing(1),
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    formControl: {
        minWidth: "34rem",
        marginTop: "10px",
    },
}));

export default function AdminManageLeavesView() {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [leavesList, setLeavesList] = useState([]);
    const [noData, setNoData] = useState(false);
    const [userLeaves, setUserLeaves] = useState([]);
    const [users, setUsers] = useState([]);
    const [callEffect, setCallEffect] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        async function fetchUsersList() {
            let usersList = await axios.get("/users.json")
                .then((res) => {
                    let response1 = [];
                    for (const [key, value] of Object.entries(res.data)) {
                        value[`id`] = key;
                        response1.push(value);
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
        async function fetchLeavesList() {
            let ll = await axios.get('/leaveApplications.json')
                .then((res) => {
                    let response2 = [];
                    for (const [key, value] of Object.entries(res.data)) {
                        value[`id`] = key;
                        if (value.approved == false) {
                            response2.push(value);
                        }
                    }
                    return response2;
                })
                .catch((err) => {
                    toast.error(
                        "Oops! Something went wrong. Please refresh the page and try again."
                    );
                    setIsLoading(false);
                })
            setLeavesList(ll);
            setIsLoading(false);
        }

        fetchUsersList();
        fetchLeavesList();

    }, [callEffect])

    const fetchUsers = () => {
        if (leavesList.length == 0) {
            toast.error(
                "No Leave Applications Available"
            );
            setNoData(true);
            setIsLoading(false);
            return;
        }
        if (leavesList.length > 0) {
            setNoData(false);
        }
        toast.success(
            "Successfully Fetched Leave Applications."
        );
        let ul = leavesList.filter(leave => {
            if (leave.approved == false) {
                let matchedUser = users.filter(user => {
                    if (user.id == leave.userId && leave.approved == false) {
                        return user;
                    }
                });
                if (matchedUser) {
                    leave.user = matchedUser;
                }
                return leave;
            }
        })
        if (!ul.length) {
            setNoData(true);
            return;
        }
        setUserLeaves(ul);
        setIsLoading(false);
        setNoData(false);
    }

    const approveLeave = async (leave) => {
        try {
            let newCache = [];
            await axios.delete('/leaveApplications/' + leave.id + '.json')
                .then((res) => {
                    newCache = userLeaves.filter(item => {
                        if (item.id != leave.id) {
                            return item;
                        }
                    })
                })
            let leaveToUpdate = {
                approved: true,
                fromDate: leave.fromDate,
                numberOfDays: leave.numberOfDays,
                userId: leave.userId
            }
            await axios.post('/leaveApplications.json', leaveToUpdate)
                .then(response => {
                    setLeavesList(newCache);
                    setIsLoading(false);
                    toast.success(`Leave Approved Successfully`);
                    const mailOptions = {
                        subject: 'Leave Approved',
                        employeeName: leave.user[0].firstname + ' ' + leave.user[0].lastname,
                        message: 'Your Leave Application for ' + leave.numberOfDays + ' days is Approved by the Admin.',
                        userEmail: leave.user[0].email,
                    };
                    sendEmail(mailOptions);
                })
                .catch(err => {
                    setIsLoading(false);
                });
            setCallEffect(true);
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
            {!isLoading && userLeaves.length && <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Employee First Name</TableCell>
                                <TableCell align="center">Employee Last Name</TableCell>
                                <TableCell align="center">Leave From</TableCell>
                                <TableCell align="center">Number Of Days</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userLeaves.map((leave, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">
                                        {leave.user[0]?.firstname.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="center">
                                        {leave.user[0]?.lastname.toUpperCase()}
                                    </TableCell>
                                    <TableCell align="center">{leave.fromDate}</TableCell>
                                    <TableCell align="center">{leave.numberOfDays}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            disabled={leave.approved}
                                            color="secondary"
                                            variant="contained"
                                            onClick={() => approveLeave(leave)}>
                                            Approve
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}
            {!userLeaves.length &&
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => fetchUsers()}>
                    Fetch Leave Applications
                </Button>}
            {noData && <Typography variant="h4">No Leave Applications Available.</Typography>}
            {isLoading && <Spinner loading={isLoading}></Spinner>}
        </div>
    )
}
