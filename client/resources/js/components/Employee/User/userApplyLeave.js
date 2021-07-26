import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Typography } from '@material-ui/core';
import toast from "react-hot-toast";
import produce from "immer";
import axios from "../../../../../../axios";
import Spinner from "../../shared/A-UI/Spinner/spinner";
import dateConverter from "../../shared/A-UI/dateConverter";

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

export default function UserApplyLeave({ user }) {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [leave, setLeave] = useState({
        fromDate: new Date(),
        numberOfDays: 0
    });


    const textFieldProps = {
        variant: "outlined",
        margin: "normal",
        fullWidth: true,
        inputProps: {
            style: { fontFamily: "sans-serif" },
        },
    };


    const handleFieldChange = (key, value) => {
        setLeave(
            produce((draftState) => {
                draftState[key] = value;
            })
        );
    };

    const handleDate = (event) => {
        const date = dateConverter(event.target.value);
        setLeave({ fromDate: date, numberOfDays: leave.numberOfDays })
    }

    const onSubmit = async (e) => {
        setIsLoading(true);
        if (e) e.preventDefault();
        if (new Date(leave.fromDate) <= new Date()) {
            toast.error("From Date cant be less than today's Date");
            setIsLoading(false);
            return;
        }
        if (leave.numberOfDays <= 0) {
            toast.error("Number of Days Cant be Less than Zero.");
            setIsLoading(false);
            return;
        }
        const leaveApplicationData = {
            userId: user.id,
            fromDate: leave.fromDate,
            numberOfDays: leave.numberOfDays,
            approved: false
        }
        try {
            await axios.post("/leaveApplications.json", leaveApplicationData)
                .then((response) => {
                    toast.success("Successfully Submitted Leave Application.")
                    setIsLoading(false);
                    setLeave({
                        fromDate: new Date(),
                        numberOfDays: 0
                    });
                })
        }
        catch (err) {
            toast.error(
                "Oops! Something went wrong. Please refresh the page and try again."
            );
            setIsLoading(false);
            setLeave({
                fromDate: new Date(),
                numberOfDays: 0
            });
        }
    }

    return (
        <div style={{ border: "dashed 2px darkblue" }}>
            {!isLoading && <form onSubmit={onSubmit} id="apply-leave-form" style={{
                margin: "10px", display: "block",
                marginLeft: "12rem",
                marginRight: "12rem"
            }} noValidate autoComplete="off">
                <Typography variant="h4" style={{ textAlign: "center" }} >Apply For Leave</Typography>
                <Typography>From Date:</Typography>
                <TextField
                    type="date"
                    variant="outlined"
                    margin="normal"
                    value={leave.fromDate}
                    {...textFieldProps}
                    onChange={(e) => handleDate(e)}>
                </TextField>
                <TextField label="Number Of Days*"
                    type="number"
                    variant="outlined"
                    margin="normal"
                    value={leave.numberOfDays}
                    onChange={(e) => handleFieldChange("numberOfDays", e.target.value)}
                    autoFocus
                    {...textFieldProps} />
                <div className={classes.root}>
                    <Button type="submit"
                        form="apply-leave-form"
                        variant="contained"
                        color="primary">Apply</Button>
                    <Button type="cancel"
                        form="apply-leave-form"
                        variant="contained"
                        onClick={() => { setLeave({ fromDate: new Date(), numberOfDays: 0 }) }}
                        color="secondary">Cancel</Button>
                </div>
            </form>}
            {isLoading && <Spinner loading={isLoading}></Spinner>}
        </div>
    )
}
