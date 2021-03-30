import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import * as mutations from '../../../graphql/mutations';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Grid
} from '@material-ui/core';
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  quizName: {
    width: '100%',
    minWidth: 250
  },
  none: {
    display: 'none'
  },
  valid: {
    display: 'block',
    color: 'red'
  },
  quizDesc: {
    marginTop: 15,
    width: '100%'
  },
  coverImage: {
    marginLeft: 20,
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: 15
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: 20,
    }
  },
  coverImg: {
    borderRadius: 5,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
    },
    [theme.breakpoints.up('sm')]: {
      width: 250,
      height: 180,
    }
  },
  cancelImage: {
    position: 'relative',
    marginTop: -50,
    display: 'flex',
  },
  fileModal: {
    display: 'none'
  },
}));

const Toolbar = ({ className, ...rest }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [valid, setValid] = useState('none');
  const [newTitle, setNewTitle] = useState('');
  const [briefValid, setBriefValid] = useState('none');
  const [description, setDescription] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [coverImageName, setCoverImageName] = useState('');

  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
      }
    }
  }, []);
  const handleClose = () => {
    setOpen(false);
    setIsLoading(false);
  };
  function chr4() {
    return Math.random().toString(16).slice(-4);
  }
  function uniqueID() {
    return `${chr4() + chr4()}-${chr4()}-${chr4()}-${chr4()}-${chr4()}${chr4()}${chr4()}`;
  }

  const handleNew = async () => {
    if (newTitle.length < 3) {
      setValid('valid');
    } else if (description.length < 10) {
      setBriefValid('valid');
      setValid('none');
    } else {
      setValid('none');
      setBriefValid('none');
      setIsLoading(true);
      const data = {
        typename : newTitle,
        description
      }
      console.log(data);
      await API.graphql(graphqlOperation(mutations.createEventType,{input:data})).then((res)=>{
        console.log(res);
      })
      setIsLoading(false);
      setNewTitle('');
      setDescription('');
      handleClose();
    }
  };
  async function goAddNewQuiz() {
    setOpen(true);
  }
  async function handleImageChange(e) {
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      e.preventDefault();
      const reader = URL.createObjectURL(e.target.files[0]);
      setImageSource(reader);
    }
  }
  const imageSelect = () => {
    document.getElementById('image_select').click();
  };
  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">Create class</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container xs={12}>
              <Grid item xs={12} sm={6} style={{ marginTop: 20 }}>
                <TextField
                  variant="outlined"
                  className={classes.quizName}
                  label="Type Name"
                  value={newTitle}
                  id="outlined-basic"
                  onChange={(event) => {
                    setNewTitle(event.target.value);
                  }}
                />
                <Typography color="warnred" variant="body2" className={classes[valid]}>
                  * Please enter at least 3 characters
                </Typography>
                <TextField
                  variant="outlined"
                  className={classes.quizDesc}
                  label="Description"
                  value={description}
                  id="outlined-basic"
                  multiline
                  rows={4}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
                <Typography color="warnred" variant="body2" className={classes[briefValid]}>
                  * Please enter at least 10 characters
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className={classes.coverImage}>
                  <input type="file" id="image_select" onChange={handleImageChange} className={classes.fileModal} />
                  <Typography variant="body1">
                    Cover image
                  </Typography>
                  <img
                    alt="Cover Image"
                    src={imageSource === '' ? '/images/blank.jpg' : imageSource}
                    className={classes.coverImg}
                  />
                  <Button color="secondary" variant="contained" onClick={imageSelect} className={classes.cancelImage}>Change</Button>
                </div>
              </Grid>
            </Grid>

          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" disabled={isLoading} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleNew} disabled={isLoading} color="secondary" autoFocus>
            Create
            {' '}
            {isLoading && <ButtonCircularProgress color="nice" />}
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        {/* <Button className={classes.importButton}>
          Import
        </Button>
        <Button className={classes.exportButton}>
          Export
        </Button> */}
        <Button
          color="primary"
          variant="contained"
          onClick={goAddNewQuiz}
        >
          Add type
        </Button>
      </Box>
      <Box mt={3}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Search type name"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
