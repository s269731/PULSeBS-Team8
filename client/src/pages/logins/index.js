import React, { useEffect, useState } from "react";

import {
  Grid,
  TextField,
  CssBaseline,
  Box,
  Snackbar,
  Typography,
  Container,
  Button,
  Avatar,
  makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    minWidth: 190,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const useStyles1 = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: 0,
    },
  },
}));

function SignUp(props) {
  const classes = useStyles();
  const [email, setUser] = useState("");
  const [password, setPwd] = useState("");
  const [open, setOpen] = useState(false);
  const [Submitted, setSubmitted] = useState(false);
  const [ErrorMock, setErrorMock] = useState(false);
  const [warningMock, setwarningMock] = useState(false);
 
  const utils = { vertical: "top", horizontal: "center" };

  const handleRegistry = async (ev) => {
    
    ev.preventDefault();
    setErrorMock(false);
    setOpen(false);
    setwarningMock(false);
    setSubmitted(false);
    if (email.trim() !== "" && password.trim() !== "") {
      console.log(email);
      console.log(password);
       await props.login({
        email,
        password,
      });
      setSubmitted(true);
    } else {
      setErrorMock(true);
    }
  };
  const classes1 = useStyles1();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMock(false);
    setOpen(false);
    setwarningMock(false);
    setSubmitted(false);
  };
  useEffect(() => {
    //to correctly show the alerts for error/success
    if (Submitted && !props.loading) {
      if (props.error) setwarningMock(true);
      else setOpen(true);
    }
  });
  return (
    <Container>
      <Container component="main" maxWidth="xs" data-testid="login-page">
        <Box mt={5}>
          {/* {弹框提示} */}
          <div className={classes1.root}>
            {/* {成功} */}
            <Snackbar
              open={open}
              autoHideDuration={2000}
              onClose={handleClose}
              anchorOrigin={utils}
            >
              <Alert onClose={handleClose} severity="success">
                Login successful
              </Alert>
            </Snackbar>
            {/* {失败} */}
            <Snackbar
              open={ErrorMock}
              autoHideDuration={2000}
              onClose={handleClose}
              anchorOrigin={utils}
            >
              <Alert
                onClose={handleClose}
                severity="error"
                data-testid="alert-error"
              >
                Please complete the login failure parameters!
              </Alert>
            </Snackbar>

            {/* {警告} */}
            <Snackbar
              open={warningMock}
              autoHideDuration={2000}
              onClose={handleClose}
              anchorOrigin={utils}
            >
              <Alert severity="warning">Incorrect account and password!</Alert>
            </Snackbar>
          </div>
        </Box>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <div className={classes.form}>
            <Grid container spacing={2}>
              {/* {账号输入区域} */}
              <Grid item xs={12}>
                <TextField
                  data-testid="input-email"
                  autoComplete="email"
                  name="email"
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  autoFocus
                  value={email}
                  onChange={(e) => setUser(e.target.value)}
                />
              </Grid>
              {/* {密码输入区域} */}
              <Grid item xs={12}>
                <TextField
                  data-testid="input-password"
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPwd(e.target.value)}
                />
              </Grid>
            </Grid>
            {/* {提交按钮} */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(ev) => {
                handleRegistry(ev);
              }}
              data-testid="login"
            >
              Log In
            </Button>
          </div>
        </div>
      </Container>
    </Container>
  );
}

export default SignUp;
