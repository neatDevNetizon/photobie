import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import * as mutations from '../../../../graphql/mutations';
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
  Grid,
  ButtonGroup
} from '@material-ui/core';
import ButtonCircularProgress from "../../../../shared/components/ButtonCircularProgress";
import BackupIcon from '@material-ui/icons/Backup';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AppsIcon from '@material-ui/icons/Apps';
import AddIcon from '@material-ui/icons/Add';

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
    minWidth: 250,
    marginTop: 10
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
  venueDialog: {
    minHeight: '90vh'
  },
  fileModal: {
    display: 'none',
    
  },
  uploadButton: {
    border: '1px solid #ccc',
    display: 'inline-block',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  }
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
  const [dummyData, setDummyData] = useState();
  const [selectedVenue, setSelectedVenue] = useState([]);

  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        const data = {
          'address':'New York city',
          'detail': [
            {
              'media': 'xx.png',
              'detail':'Outside image'
            }
          ]
        };
        console.log("adfadfadf",data)
        setSelectedVenue(data);
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
      const file = e.target.files[0];
      var filesArr = Array.prototype.slice.call(e.target.files);
      const fileType = filesArr[0];
      e.preventDefault();
      var d = new Date();
      var n = d.getTime();
      const picture = n+".jpg";
      // await Storage.put(picture, file, {
      //   contentType: fileType,
      //   level: 'public'
      // });
      // const reader = URL.createObjectURL(e.target.files[0]);
      // setImageSource(reader);
    }
  }
  const handleOpenUpload = () => {
    document.getElementById('image_select').click();
  }
  async function handleDetail(index, value){
    console.log(selectedVenue.detail[index].detail)

  }
  function changeModeList(){
    // setTargetValue("left")
  }
  function changeModeGrid(){
    // setTargetValue("right")
  }
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
        className={classes.venueDialog}
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant='h5'>
            Add new Venue
          </Typography>
          <TextField
            variant="outlined"
            className={classes.quizName}
            label="Venue Address"
            value={newTitle}
            id="outlined-basic"
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
          />
          <Typography color="warnred" variant="body2" className={classes[valid]}>
            * Please enter at least 3 characters
          </Typography>
          <Typography color="textPrimary" variant = "h6" align="center">Venue detail</Typography>
          <ButtonGroup size="large" color="secondary" aria-label="large outlined primary button group" style = {{marginLeft:"5%",marginTop:10,marginBottom:30,position:"relative"}}>
          <Button onClick = {changeModeGrid}><AddIcon/></Button>
            <Button onClick = {changeModeList}><FormatListBulletedIcon/></Button>
            <Button onClick = {changeModeGrid}><AppsIcon/></Button>
          </ButtonGroup>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedVenue?.detail?.map((item, index)=>{
              return <Grid container xs={12} spacing ={2}>
                <Grid item xs={12} md={6} sm={6}>
                  <div className={classes.uploadContainer}>
                    <div className={classes.uploadButton}>
                      <BackupIcon color="primary" onClick={handleOpenUpload}/>
                    </div>
                    <input type="file" id="image_select" onChange={handleImageChange} className={classes.fileModal} />
                    <Typography style={{marginLeft: 10}}>adfad</Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={6} sm={6}>
                  <TextField
                    variant="outlined"
                    // className={classes.quizName}
                    label="Detail data"
                    value={item.detail}
                    fullWidth
                    id="outlined-basic"
                    onChange={(event) => {
                      handleDetail(index, event.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            })}
            

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
        <Button
          color="primary"
          variant="contained"
          onClick={goAddNewQuiz}
        >
          Add Venue Address
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
                placeholder="Search Address"
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
