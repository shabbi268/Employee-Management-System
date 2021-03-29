import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Typography } from '@material-ui/core';
import toast, { Toaster } from "react-hot-toast";
import produce from "immer";
import axios from "../../../../../../axios";
import Spinner from "../../shared/A-UI/Spinner/spinner";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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

export function AdminEmployeeNew() {
    const classes = useStyles();
    const textFieldProps = {
        variant: "outlined",
        margin: "normal",
        fullWidth: true,
        inputProps: {
            style: { fontFamily: "sans-serif" },
        },
    };
    const [employee, setEmployee] = useState({
        firstname: "",
        lastname: "",
        dob: new Date(),
        employmentType: ""
    });
    const [isLoading, setIsLoading] = useState(false)

    const handleFieldChange = (key, value) => {
        setEmployee(
            produce((draftState) => {
                draftState[key] = value;
            })
        );
    };

    const handleDOB = (event) => {
        const date = dateConverter(event.target.value);
        setEmployee({ firstname: employee.firstname, lastname: employee.lastname, dob: date, employmentType: employee.employmentType })
    }

    const onSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        if (employee.firstname == "" || employee.lastname == "" || employee.dob == "") {
            toast.error("Employee Details can't be Null");
            // setIsLoading(false);
            return;
        }
        try {
            await axios.post('/employees.json', employee)
                .then(response => {
                    setIsLoading(false);
                    setEmployee({ firstname: "", lastname: "", dob: new Date(), employmentType: "" })
                    toast.success(`Employee Added Successfully`);
                })
                .catch(err => {
                    setIsLoading(false);
                    setEmployee({ firstname: "", lastname: "", dob: new Date(), employmentType: "" })
                });
        } catch (err) {
            toast.error(
                "Oops! Something went wrong. Please refresh the page and try again."
            );
        }
    };

    return (
        <>
            <div style={{ border: "dashed 2px darkblue" }}>
                {!isLoading && <form onSubmit={onSubmit} id="add-form" style={{
                    margin: "10px", display: "block",
                    marginLeft: "12rem",
                    marginRight: "12rem"
                }} noValidate autoComplete="off">
                    <Typography variant="h4" style={{ textAlign: "center" }} >Add Employee</Typography>
                    <TextField label="First Name*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={employee.firstname}
                        onChange={(e) => handleFieldChange("firstname", e.target.value)}
                        autoFocus
                        {...textFieldProps} />
                    <TextField
                        label="Last Name*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={employee.lastname}
                        onChange={(e) => handleFieldChange("lastname", e.target.value)}
                        {...textFieldProps} />
                    <TextField
                        type="date"
                        variant="outlined"
                        margin="normal"
                        value={employee.dob}
                        {...textFieldProps}
                        onChange={handleDOB}>
                    </TextField>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Employment Type*:</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={employee.employmentType}
                            onChange={(e) => handleFieldChange("employmentType", e.target.value)}
                        >
                            <MenuItem value={"Full-Time"}>Full-Time</MenuItem>
                            <MenuItem value={"Part-Time"}>Part-Time</MenuItem>
                            <MenuItem value={"Contract"}>Contract</MenuItem>
                        </Select>
                    </FormControl>
                    <div className={classes.root}>
                        <Button type="submit"
                            form="add-form"
                            variant="contained"
                            color="primary">Save</Button>
                        <Button type="cancel"
                            form="add-form"
                            variant="contained"
                            onClick={() => { setEmployee({ firstname: "", lastname: "", dob: new Date(), employmentType: "" }) }}
                            color="secondary">Cancel</Button>
                    </div>
                </form>}
            </div>
            <Toaster />
            {isLoading && <Spinner loading={isLoading}></Spinner>}
        </>
    );
}