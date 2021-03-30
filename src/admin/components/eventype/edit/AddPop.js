/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
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
  Grid,
  Paper,
  IconButton,
  InputBase,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import CollectionContext from 'src/context/collection';
import { getQuizList, updateColQuiz } from 'src/utils/Api';
import QuizSelect from './QuizSelect';

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
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  searchBar: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  dialogContainer: {
    height: '70vh',
    minHeight: '70vh',
    minWidth: '40vw',
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

export default function AddDialog({
  open, handleClose, id, selectedQuiz
}) {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [valid, setValid] = useState('none');
  const [briefValid, setBriefValid] = useState('none');
  const [coverImageName, setCoverImageName] = useState('');
  const { collection, setCollection } = React.useContext(CollectionContext);
  const [products, setProducts] = useState([]);
  const [proList, setProList] = useState([]);
  const [quizes, setQuizes] = useState([]);

  async function handleNew() {
    const quizString = JSON.stringify(quizes);
    const data = { uid: id, quiz: quizString };
    const preStore = collection;
    await updateColQuiz(data).then((res) => {
      console.log(collection.product);
    });
    const aaa = proList.filter((student) => {
      return quizString.toLowerCase().indexOf(student.id.toLowerCase()) > 0;
    });
    setCollection({
      image: preStore.image,
      description: preStore.description,
      title: preStore.title,
      product: [...aaa],
      quizList: quizes
    });
    handleClose();
  }
  React.useEffect(() => {
    async function getList() {
      const user = JSON.parse(localStorage.getItem('brainaly_user'));
      await getQuizList({ userid: user.userId }).then((res) => {
        const productsArray = [];
        const prolistArray = [];
        const selectedQuizString = JSON.stringify(collection.quizList);
        for (let i = 0; i < res.result.length; i++) {
          const lNum = selectedQuizString?.toLowerCase().indexOf(res.result[i].q_uid.toLowerCase());
          const newData = {
            title: res.result[i].q_name,
            length: JSON.parse(res.result[i].q_content).length,
            description: res.result[i].q_description,
            id: res.result[i].q_uid,
            selected: lNum > 0 ? 2 : 1,
            media: res.result[i].q_cover === null
              ? '/static/collection.png' : `http://localhost:3001/upload/${res.result[i].q_cover}`
          };
          const newDataPro = {
            title: res.result[i].q_name,
            length: JSON.parse(res.result[i].q_content).length,
            description: res.result[i].q_description,
            id: res.result[i].q_uid,
            selected: lNum > 0 ? 2 : 1,
            media: res.result[i].q_cover
          };
          productsArray.push(newData);
          prolistArray.push(newDataPro);
        }
        setProducts(productsArray);
        setProList(prolistArray);
        setQuizes(collection.quizList);
      });
    }
    getList();
  }, [open]);
  async function handleSearch(event) {
    const str = event.target.value;
    const newArr = [...proList];
    let expends = [];
    if (str) {
      newArr.map((item, index) => {
        const lNum = item.title.toLowerCase().indexOf(str.toLowerCase());
        if (lNum >= 0) {
          expends.push({
            id: item.id,
            length: item.length,
            description: item.description,
            title: item.title,
            media: item.media === null
              ? '/static/collection.png' : `http://localhost:3001/upload/${item.media}`,
            selected: item.selected
          });
        }
      });
    } else expends = [...proList];
    setProducts(expends);
  }
  function handleClick(ad, selected, index) {
    const preStore = collection;
    const newProduct = [...quizes];
    console.log(newProduct);
    let trueFalse = false;
    quizes.map((item) => {
      if (ad === item.id) {
        trueFalse = true;
      }
    });
    let newArray = [];
    if (trueFalse) {
      const aaa = newProduct.filter((student) => {
        return student.id !== ad;
      });
      newArray = [...aaa];
    } else {
      newProduct.push({ id: ad });
      newArray = [...newProduct];
    }
    // setCollection({
    //   image: preStore.image,
    //   description: preStore.description,
    //   title: preStore.title,
    //   product: preStore.product,
    //   quizList: preStore.quizList
    // });
    const current = [...products];
    const providerArray = {
      title: current[index].title,
      length: current[index].length,
      description: current[index].description,
      id: current[index].id,
      selected: selected === 1 ? 2 : 1,
      media: current[index].media
    };
    current[index] = providerArray;
    setProducts(current);
    setQuizes(newArray);
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="alert-dialog-title">
        Add Quizes to this collection
        <Paper className={classes.searchBar}>
          <InputBase
            className={classes.input}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearch}
          />
          <IconButton className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </DialogTitle>
      <DialogContent className={classes.dialogContainer}>
        <DialogContentText id="alert-dialog-description">
          <Grid container xs={12}>
            <Grid item xs={12} md={12} sm={12}>
              <Grid
                container
                spacing={3}
              >
                {products.map((product, index) => (
                  <Grid
                    item
                    key={product.id}
                    lg={12}
                    md={12}
                    xs={12}
                  >
                    <QuizSelect
                      handleClick={() => { handleClick(product.id, product.selected, index); }}
                      className={classes.productCard}
                      product={product}
                      selected={product.selected}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

        </DialogContentText>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleNew} color="secondary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
AddDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  id: PropTypes.string,
  selectedQuiz: PropTypes.array
};
