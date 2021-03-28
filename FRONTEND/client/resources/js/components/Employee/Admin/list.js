import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from "../../../../../../axios";
import TextField from '@material-ui/core/TextField';
import produce from "immer";
import Spinner from "../../shared/A-UI/Spinner/spinner";
import { Button, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import toast from 'react-hot-toast';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { DialogTitle } from "@material-ui/core";
import dateConverter from "../../shared/A-UI/dateConverter";

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

export function AdminEmployeeView() {
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [employee, setEmployee] = useState(null);
    const [noData, setNoData] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

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
        axios.get('/employees.json')
            .then((res) => {
                if (!res.data) {
                    setNoData(true);
                    setIsLoading(false);
                    toast.error("No Employees Found.")
                    return;
                }
                let response = [];
                for (const [key, value] of Object.entries(res.data)) {
                    value.id = key;
                    let date = dateConverter(value.dob);
                    value.dob = date;
                    response.push(value);
                }
                setData(response);
                setIsLoading(false);
                toast.success(
                    "Successfully Fetched Employees List."
                );
            })
            .catch((err) => {
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
                setIsLoading(false);
            })
    }, [])



    const renderDeleteDialog = (showDeleteDialog, employee) => {

        const confirmDelete = async (id) => {
            setIsLoading(true);
            try {
                await axios.delete('/employees/' + id + '.json')
                    .then((response) => {
                        if (response.status == 200) {
                            let newCache = data.filter(item => {
                                if (item.id != id) {
                                    return item;
                                }
                            })
                            setData(newCache);
                            if (data.length == 0) {
                                setNoData(true);
                            }
                        }
                        else {
                            throw new Error("Delete Failed.");
                        }
                        toast.success("Successfully Deleted.")
                        setIsLoading(false);
                        setShowDeleteDialog(false);
                    })
            }
            catch (err) {
                setIsLoading(false);
                setShowDeleteDialog(false);
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
            }
        }

        return (<Dialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
        >
            <DialogContent>
                <p style={{ fontSize: 18, fontFamily: "sans-serif" }}>
                    Are you sure you want to delete Employee {employee.firstname} {employee.lastname}?
      </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => confirmDelete(employee.id)}
                >
                    Delete
      </Button>
            </DialogActions>
            <Spinner loading={isLoading}></Spinner>
        </Dialog>)
    }

    const renderEditDialog = (showEditDialog, editEmployee) => {

        const materialDateInput = dateConverter(editEmployee.dob);

        const handleDOB = (event) => {
            const editedDate = dateConverter(event.target.value);
            setEmployee({ id: editEmployee.id, firstname: editEmployee.firstname, lastname: editEmployee.lastname, dob: editedDate, employmentType: editEmployee.employmentType })
        }

        const handleFieldChange = (key, value) => {
            setEmployee(
                produce((draftState) => {
                    draftState[key] = value;
                })
            );
        };

        const confirmEdit = async (employee) => {
            let addEmployee = employee;
            setIsLoading(true);
            try {
                let newCache = [];
                await axios.delete('/employees/' + employee.id + '.json')
                    .then(() => {
                        newCache = data.filter(item => {
                            if (item.id != employee.id) {
                                return item;
                            }
                        })
                        if (data.length == 0) {
                            setNoData(true);
                        }
                    })
                await axios.post('/employees.json', addEmployee)
                    .then(response => {
                        newCache.push({
                            id: response.name,
                            firstname: addEmployee.firstname,
                            lastname: addEmployee.lastname,
                            dob: addEmployee.dob,
                            employmentType: addEmployee.employmentType
                        })
                        setData(newCache);
                        setIsLoading(false);
                        setShowEditDialog(false);
                        toast.success(`Employee Updated Successfully`);
                    })
                    .catch(err => {
                        setIsLoading(false);
                        setShowEditDialog(false);
                    });
            }
            catch (err) {
                setIsLoading(false);
                setShowEditDialog(false);
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
            }

        }
        return (<Dialog
            open={showEditDialog}
            onClose={() => setShowEditDialog(false)}
        >
            <DialogTitle style={{ textAlign: "center" }}>Edit Employee</DialogTitle>
            <DialogContent>
                <form id="edit-form" style={{
                    display: "block",
                }} noValidate autoComplete="off">
                    <TextField label="First Name*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={editEmployee.firstname}
                        onChange={(e) => handleFieldChange("firstname", e.target.value)}
                        autoFocus
                        {...textFieldProps} />
                    <TextField
                        label="Last Name*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={editEmployee.lastname}
                        onChange={(e) => handleFieldChange("lastname", e.target.value)}
                        {...textFieldProps} />
                    <TextField
                        type="date"
                        variant="outlined"
                        margin="normal"
                        value={materialDateInput}
                        {...textFieldProps}
                        onChange={handleDOB}>
                    </TextField>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Employment Type*:</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={editEmployee.employmentType}
                            onChange={(e) => handleFieldChange("employmentType", e.target.value)}
                        >
                            <MenuItem value={"Full-Time"}>Full-Time</MenuItem>
                            <MenuItem value={"Part-Time"}>Part-Time</MenuItem>
                            <MenuItem value={"Contract"}>Contract</MenuItem>
                        </Select>
                    </FormControl>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => confirmEdit(employee)}>
                    Save
                </Button>
            </DialogActions>
            <Spinner loading={isLoading}></Spinner>
        </Dialog>)
    }

    return (
        <div>
            <div>
                This is Admin Employee View
            </div>
            {!isLoading && !noData && <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">First Name</TableCell>
                                <TableCell align="center">Last Name</TableCell>
                                <TableCell align="center">Date Of Birth</TableCell>
                                <TableCell align="center">Employment Type</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center">
                                        {row.firstname}
                                    </TableCell>
                                    <TableCell align="center">{row.lastname}</TableCell>
                                    <TableCell align="center">{row.dob}</TableCell>
                                    <TableCell align="center">{row.employmentType}</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => { setShowEditDialog(true); setEmployee(row) }} aria-label="edit">
                                            <EditIcon color="secondary" />
                                        </IconButton>
                                        <IconButton onClick={() => { setShowDeleteDialog(true); setEmployee(row) }} aria-label="delete">
                                            <DeleteIcon color="secondary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}
            {noData && <Typography variant="h4">No Employees Found.</Typography>}
            {isLoading && <Spinner loading={isLoading}></Spinner>}
            {showDeleteDialog && renderDeleteDialog(showDeleteDialog, employee)}
            {showEditDialog && renderEditDialog(showEditDialog, employee)}
        </div>
    );
}