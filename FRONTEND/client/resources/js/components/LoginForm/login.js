import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Typography } from '@material-ui/core';
import toast from "react-hot-toast";
import { AdminOptions } from "../Employee/Admin/adminOptions";
import { UserOptions } from "../Employee/User/userOptions";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import axios from "../../../../../axios";
import Spinner from "../shared/A-UI/Spinner/spinner";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        formControl: {
            minWidth: "34rem",
            marginTop: "10px",
        },
    }),
);

export function Login() {
    const classes = useStyles();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [userType, setUserType] = useState("USER");
    const [isLoading, setIsLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loginClicked, setLoginClicked] = useState(false);
    const [registerClicked, setRegisterClicked] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState([]);

    const textFieldProps = {
        variant: "outlined",
        margin: "normal",
        fullWidth: true,
        inputProps: {
            style: { fontFamily: "sans-serif" },
        },
    };

    const initializeUser = () => {
        setFirstname("");
        setLastname("");
        setPassword("");
        setConfirmPassword("");
        setUsername("");
    }

    const renderRegisterForm = () => {

        const confirmRegister = async (e) => {
            setIsLoading(false);
            setIsLoggedIn(false);
            if (e) e.preventDefault();
            try {
                if (password != confirmPassword) {
                    toast.error("Password didn't match. please try again.")
                    setUsername("");
                    setPassword("");
                    setConfirmPassword("");
                }
                if (userType == "USER" && !username.toLowerCase().includes("user")) {
                    toast.error("Username must contain the word User")
                }
                if (userType == "ADMIN" && !username.toLowerCase().includes("admin")) {
                    toast.error("Username must contain the word Admin")
                }
                const user = { firstname: firstname, lastname: lastname, username: username, password: password, userType: userType }
                await axios.post('/users.json', user)
                    .then(response => {
                        setIsLoading(true);
                        setIsLoggedIn(true);
                        initializeUser();
                        toast.success(`Employee with role - ` + userType + ` created Successfully`);
                    })
                    .catch(err => {
                        setIsLoading(false);
                        setIsLoggedIn(false);
                        initializeUser();
                    });
            } catch (err) {
                setIsLoading(false);
                setIsLoggedIn(false);
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
            }
        };

        return ((!isLoggedIn && registerClicked) ? <div>
            <div style={{ border: "dashed 2px darkblue", marginTop: "10px" }}>
                <Typography variant="h4">Register</Typography>
                <form id="register-form" style={{ margin: "10px", display: "inline-grid" }} noValidate autoComplete="off">
                    <TextField label="First Name"
                        variant="outlined"
                        margin="normal"
                        value={firstname}
                        onChange={(e) => {
                            setFirstname(e.target.value)
                        }}
                        autoFocus
                        {...textFieldProps} />
                    <TextField label="Last Name"
                        variant="outlined"
                        margin="normal"
                        value={lastname}
                        onChange={(e) => {
                            setLastname(e.target.value)
                        }}
                        autoFocus
                        {...textFieldProps} />
                    <TextField label="UserName"
                        variant="outlined"
                        margin="normal"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        autoFocus
                        {...textFieldProps} />
                    <TextField label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        {...textFieldProps} />
                    <TextField label="Confirm Password"
                        type="text"
                        variant="outlined"
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                        {...textFieldProps} />
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">User Type*:</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                            <MenuItem value={"USER"}>USER</MenuItem>
                        </Select>
                    </FormControl>
                    <div className={classes.root}>
                        <Button type="cancel"
                            form="register-form"
                            variant="contained"
                            color="secondary"
                            onClick={() => { setUsername(""); setPassword(""); setConfirmPassword("") }}>Cancel</Button>
                        <Button type="submit"
                            form="register-form"
                            variant="contained"
                            color="primary"
                            onClick={() => { confirmRegister() }}>Register</Button>
                    </div>
                </form>
            </div>
        </div> : undefined)
    }

    const renderLoginForm = () => {

        const authenticateUser = (username, password, usersList) => {
            const matchedUser = usersList.filter((user) => {
                if (user.username == username && user.password == password) {
                    return user;
                }
            });
            return matchedUser;
        }

        const onSubmit = async (e) => {
            setIsLoading(true);
            setIsLoggedIn(false);
            if (e) e.preventDefault();
            try {
                let response = [];
                const usersList = await axios.get("/users.json")
                    .then((res) => {
                        for (const [key, value] of Object.entries(res.data)) {
                            value[`id`] = key;
                            response.push(value);
                        }
                        return response;
                    })
                const matchedUser = authenticateUser(username, password, usersList);
                if (matchedUser.length == 1) {
                    toast.success("Successfully Authenticated User. Logging In.")
                    if (matchedUser[0].userType == "ADMIN") {
                        setIsAdmin(true);
                        setIsLoading(false);
                        setIsLoggedIn(true);
                        setUsername(username)
                        setLoggedInUser(matchedUser[0]);

                    }
                    else if (matchedUser[0].userType == "USER") {
                        setIsUser(true);
                        setIsLoading(false);
                        setIsLoggedIn(true);
                        setUsername(username)
                        setLoggedInUser(matchedUser[0]);
                    }
                }
                else if (matchedUser.length != 1) {
                    toast.error("Authentication Failed. Please enter correct username and password.")
                    setIsLoading(false);
                    setIsLoggedIn(false);
                }
            } catch (err) {
                toast.error(
                    "Oops! Something went wrong. Please refresh the page and try again."
                );
            }
        };

        return (
            (!isLoggedIn && loginClicked && !isLoading) ?
                (<div>
                    <div style={{ border: "dashed 2px darkblue", marginTop: "10px" }}>
                        <Typography variant="h4" style={{ marginTop: "10px" }}>Login</Typography>
                        <form onSubmit={onSubmit} id="login-form" style={{ margin: "10px", display: "inline-grid" }} noValidate autoComplete="off">
                            <TextField label="UserName"
                                variant="outlined"
                                margin="normal"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                                autoFocus
                                {...textFieldProps} />
                            <TextField label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                                {...textFieldProps} />
                            <div className={classes.root}>
                                <Button
                                    form="login-form"
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { window.location.replace("/login") }}
                                >Cancel</Button>
                                <Button type="submit"
                                    form="login-form"
                                    variant="contained"
                                    color="primary"
                                >Login</Button>
                            </div>
                        </form>
                    </div>
                </div>) : undefined
        )
    }

    return (
        <div style={{ textAlign: "center", marginTop: "10rem", marginLeft: "300px", marginRight: "300px", padding: "20px", border: "solid 2px black" }}>
            <div>
                {!isLoggedIn &&
                    <>
                        <div className={classes.root}>
                            <Button color="primary" variant="contained" size="medium" onClick={() => { setLoginClicked(true); setRegisterClicked(false) }}>
                                Login
                            </Button>
                        </div>
                        <div>
                            <Button color="primary" variant="contained" size="medium" onClick={() => { setRegisterClicked(true); setLoginClicked(false) }}>
                                Register
                            </Button>
                        </div>
                    </>}
            </div>
            {registerClicked && renderRegisterForm()}
            {loginClicked && renderLoginForm()}
            {isLoggedIn && isAdmin && <AdminOptions />}
            {isLoggedIn && isUser && <UserOptions user={loggedInUser} />}
            {isLoading && <Spinner loading={isLoading}></Spinner>}
        </div>
    )
}
