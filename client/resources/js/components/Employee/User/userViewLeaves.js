import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import toast from "react-hot-toast";
import axios from "../../../../../../axios";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import Spinner from "../../shared/A-UI/Spinner/spinner";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

export default function UserViewLeaves({ user }) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [matchedLeaves, setMatchedLeaves] = useState([]);
    const [noData, setNoData] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setNoData(true);
        axios.get('/leaveApplications.json')
            .then((res) => {
                if (!res.data) {
                    setIsLoading(false);
                    toast.error("No Leaves Found.")
                    return;
                }
                let response = [];
                for (const [key, value] of Object.entries(res.data)) {
                    value.id = key;
                    response.push(value);
                }
                let mLeaves = response.filter(leave => {
                    if (leave.userId == user.id) {
                        return leave;
                    }
                })
                setMatchedLeaves(mLeaves);
                if (mLeaves.length == 0) {
                    setNoData(true);
                }
                if (mLeaves.length > 0) {
                    setNoData(false);
                }
                setIsLoading(false);
                toast.success(
                    "Successfully Fetched Leaves."
                );
            })
            .catch((err) => {
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
                setIsLoading(false);
            })
    }, [])


    return (
        <div>
            {!isLoading && !noData && <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">From Date</TableCell>
                                <TableCell align="center">Number Of Days</TableCell>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matchedLeaves.map((leave, index) => (
                                <TableRow key={leave.id}>
                                    <TableCell align="center">
                                        {leave.fromDate}
                                    </TableCell>
                                    <TableCell align="center">
                                        {leave.numberOfDays}
                                    </TableCell>
                                    <TableCell align="center">{leave.approved ? "Approved" : "Waiting For Approval"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}
            {noData && <Typography variant="h4">No Leave Applications Found.</Typography>}
            {isLoading && <Spinner loading={isLoading}></Spinner>}
        </div>
    )
}
