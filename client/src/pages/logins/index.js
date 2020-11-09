
import React, {useEffect, useState} from 'react';

import { Grid, TextField, CssBaseline, Box, Snackbar, Typography, Container, Button, Avatar, makeStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import API from "../../api"




const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
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
    width: '100%',
    '& > * + *': {
      marginTop: 0,
    },
  },
}));

function SignUp(props) {
  const classes = useStyles();
  let [email, setUser] = useState("");
  let [password, setPwd] = useState("");
  let [open, setOpen] = useState(false);
  let [Submitted, setSubmitted] = useState(false);
  let [ErrorMock, setErrorMock] = useState(false);
  let [warningMock, setwarningMock] = useState(false)
  const [identity, setIdentity] = useState('teacher');
  const utils = { vertical: 'top', horizontal: 'center' };

  const handleChange = (event) => {
    setIdentity(event.target.value);
  };

  let handleRegistry = async (ev) => {

    //   //条件赛选
    ev.preventDefault()
    setErrorMock(false);
    setOpen(false);
    setwarningMock(false);
    setSubmitted(false);
    if (email.trim() !== '' && password.trim() !== '' && identity.trim() !== '') {
      console.log(email)
      console.log(password)
      let res = await props.login({
        email,
        password,
        identity
      })
      setSubmitted(true)
      } else {
        setErrorMock(true)
      }
   
  };
  const classes1 = useStyles1();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMock(false);
    setOpen(false);
    setwarningMock(false);
    setSubmitted(false);
   
  };
  useEffect(()=>{
    //to correctly show the alerts for error/success
    if(Submitted && !props.loading) {
      if (props.error)
        setwarningMock(true)
      else
        setOpen(true)
    }
  })
  return (
    <Container>
      <Container component="main" maxWidth="xs">
        <Box mt={5}>
          {/* {弹框提示} */}
          <div className={classes1.root}>
            {/* {成功} */}
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={utils}>
              <Alert onClose={handleClose} severity="success" >
                Login successful
              </Alert>
            </Snackbar>
            {/* {失败} */}
            <Snackbar open={ErrorMock} autoHideDuration={2000} onClose={handleClose} anchorOrigin={utils}>
              <Alert onClose={handleClose} severity="error">
                Please complete the login failure parameters!
              </Alert>
            </Snackbar>
         
            {/* {警告} */}
            <Snackbar open={warningMock} autoHideDuration={2000} onClose={handleClose} anchorOrigin={utils}>
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
          <div className={classes.form} >
            <Grid container spacing={2}>
              {/* {账号输入区域} */}
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="email"
                  name="email"
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  autoFocus
                  value={email} onChange={(e) => setUser(e.target.value)}
                />
              </Grid>
              {/* {身份} */}
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="demo-simple-select-outlined-label">identity</InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={identity}
                    onChange={handleChange}
                    label="identity"
                  >
                    <MenuItem value={'admin'}>admin</MenuItem>
                    <MenuItem value={'student'}>student</MenuItem>
                    <MenuItem value={'teacher'}>teacher</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* {密码输入区域} */}
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password} onChange={(e) => setPwd(e.target.value)}
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
              onClick={(ev)=>{handleRegistry(ev)}}
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
