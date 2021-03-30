/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Typography,
  makeStyles,
  Grid
} from '@material-ui/core';
import PropTypes from 'prop-types';
import CollectionContext from 'src/context/collection';
import { imageUpload, updateClassData } from 'src/utils/Api';

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
  progressBar: {
    fontSize: 20,
    color: 'purple',
    marginLeft: 10,
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
    marginLeft: -90
  },
  fileModal: {
    display: 'none'
  },
}));

export default function EditDialog({
  open, handleClose, id, image, title, desc
}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [valid, setValid] = useState('none');
  const [newTitle, setNewTitle] = useState(title);
  const [briefValid, setBriefValid] = useState('none');
  const [description, setDescription] = useState(desc);
  const [imageSource, setImageSource] = useState(image);
  const [coverImageName, setCoverImageName] = useState('');
  const { collection, setCollection } = React.useContext(CollectionContext);
  React.useEffect(() => {
    setDescription(desc);
    setImageSource(image);
    setNewTitle(title);
  }, [id, image, title, desc]);

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
        uid: id,
        title: newTitle,
        description,
        cover: coverImageName,
      };
      await updateClassData(data).then((res) => {
        const preStore = collection;
        setCollection({
          image: coverImageName === ''
            ? preStore.image : `http://localhost:3001/upload/${coverImageName}`,
          description,
          title: newTitle,
          product: preStore.product,
          quizList: preStore.quizList
        });
      });
      setTimeout(setIsLoading(false), 800);
      handleClose();
    }
  };
  async function handleImageChange(e) {
    if (e.target.files[0]) {
      e.preventDefault();
      const reader = URL.createObjectURL(e.target.files[0]);
      setImageSource(reader);
      await imageUpload(e.target.files[0]).then((res) => {
        setCoverImageName(res.data.filename);
      });
    }
  }
  const imageSelect = () => {
    document.getElementById('image_select').click();
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="alert-dialog-title">Create a New Collection</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid container xs={12}>
            <Grid item xs={12} sm={6} style={{ marginTop: 20 }}>
              <TextField
                variant="outlined"
                className={classes.quizName}
                label="Collection Name"
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
                  src={imageSource}
                  className={classes.coverImg}
                />
                <Button color="secondary" variant="contained" onClick={imageSelect} className={classes.cancelImage}>Change</Button>
              </div>
            </Grid>
          </Grid>

        </DialogContentText>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleNew} color="secondary" autoFocus>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
EditDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  id: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  image: PropTypes.string
};
