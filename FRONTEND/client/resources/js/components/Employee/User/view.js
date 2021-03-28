import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import Spinner from "../../shared/A-UI/Spinner/spinner";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import toast from 'react-hot-toast';
import { DialogTitle } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import produce from "immer";
import { Button } from '@material-ui/core';
import axios from '../../../../../../axios';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));


export function UserEmployeeView({ user }) {
    const classes = useStyles();
    const [showRequestChangeDialog, setShowRequestChangeDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editableUser, setEditableUser] = useState(user);

    const textFieldProps = {
        variant: "outlined",
        margin: "normal",
        fullWidth: true,
        inputProps: {
            style: { fontFamily: "sans-serif" },
        },
    };

    const renderRequestChangeDialog = () => {

        const handleFieldChange = (key, value) => {
            setEditableUser(
                produce((draftState) => {
                    draftState[key] = value;
                })
            );
        };

        const confirmEditRequest = async () => {
            setIsLoading(true);
            try {
                await axios.delete('/users/' + editableUser.id + '.json')
                await axios.post('/users.json', editableUser)
                    .then((res) => {
                        toast.success("User Updated Successfully.");
                        setIsLoading(false);
                        setShowRequestChangeDialog(false);
                        window.location.reload();
                    })
                    .catch(err => {
                        setIsLoading(false);
                        setShowRequestChangeDialog(false);
                    });
                setIsLoading(false);
                setShowRequestChangeDialog(false);
            }
            catch (err) {
                setIsLoading(false);
                setShowRequestChangeDialog(false);
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
            }
        }

        return (<Dialog
            open={showRequestChangeDialog}
            onClose={() => setShowRequestChangeDialog(false)}
        >
            <DialogTitle style={{ textAlign: "center" }}>Edit Employee</DialogTitle>
            <DialogContent>
                <form id="request-change-form" style={{
                    display: "block",
                }} noValidate autoComplete="off">
                    <TextField label="First Name*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={editableUser.firstname}
                        onChange={(e) => handleFieldChange("firstname", e.target.value)}
                        autoFocus
                        {...textFieldProps} />
                    <TextField
                        label="Last Name*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={editableUser.lastname}
                        onChange={(e) => handleFieldChange("lastname", e.target.value)}
                        {...textFieldProps} />
                    <TextField
                        label="Username*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={editableUser.username}
                        onChange={(e) => handleFieldChange("username", e.target.value)}
                        {...textFieldProps} />
                    <TextField
                        label="Password*"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={editableUser.password}
                        onChange={(e) => handleFieldChange("password", e.target.value)}
                        {...textFieldProps} />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowRequestChangeDialog(false)}>Cancel</Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => confirmEditRequest(editableUser)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>)
    }

    return (
        <div>
            This is User Employee View
            {!isLoading && <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">First Name</TableCell>
                                <TableCell align="center">Last Name</TableCell>
                                <TableCell align="center">User Type</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={editableUser.id}>
                                <TableCell component="th" scope="row">
                                    {editableUser.firstname}
                                </TableCell>
                                <TableCell align="center">{editableUser.lastname}</TableCell>
                                <TableCell align="center">{editableUser.userType}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => { setShowRequestChangeDialog(true); }} aria-label="edit">
                                        <EditIcon color="secondary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>}
            {showRequestChangeDialog && renderRequestChangeDialog()}
            {isLoading && <Spinner loading={isLoading}></Spinner>}
        </div>
    );
}