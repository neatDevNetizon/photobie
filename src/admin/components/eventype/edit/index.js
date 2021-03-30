/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  Typography,
  Divider,
  Button
} from '@material-ui/core';
import { getClassById, getStudentById } from 'src/utils/Api';
import CollectionContext from 'src/context/collection';
import { DataGrid } from '@material-ui/data-grid';
import ProductCard from './ProductCard';
import EditDialog from './dialog';
import AddDialog from './AddPop';

const columns = [
  {
    field: 'media',
    headerName: 'Photo',
    sortable: false,
    width: 80,
  },
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  // { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'birthday',
    headerName: 'Birthday',
    type: 'date',
    width: 150,
  }
];
const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20
  },
  tatsItem: {
    alignItems: 'center',
    display: 'flex'
  },
  statsIcon: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(3)
  },
  quAvatar: {
    width: 150,
    borderRadius: 5
  },
  hambergerContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  menuItem: {
    width: 100
  },
  menuIcon: {
    marginRight: theme.spacing(1)
  },
  desImage: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'cover',
    borderRadius: 5,
    [theme.breakpoints.up('xs')]: {
      display: 'block'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  divider: {
    marginTop: 5,
    marginBottom: 5
  },
  editButton: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 30
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
}));
export default function EditCollection() {
  const classes = useStyles();
  const handle = window.location.search;
  const id = new URLSearchParams(handle).get('id');
  const [product, setProduct] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { collection, setCollection } = React.useContext(CollectionContext);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState('');

  useEffect(() => {
    async function fetchData() {
      const user = JSON.parse(localStorage.getItem('brainaly_user'));
      await getClassById({ id }).then(async (res) => {
        const quizList = JSON.parse(res[0].cl_students);
        setSelectedQuiz(res[0].cl_students);
        const quizArray = [];
        for (let i = 0; i < quizList.length; i++) {
          const data = { id: quizList[i].id, userid: user.userId };
          await getStudentById(data).then((res) => {
            const born = new Date(res[0].u_birthday);
            quizArray.push({
              media: res[0].u_avatar,
              id: res[0].u_id,
              name: res[0].u_name,
              birthday: res[0].u_birthday === null ? 'Undefined' : `${born.getFullYear()}-${born.getMonth() + 1}-${born.getDate()}`,
            });
          });
        }
        setProduct(quizArray);
        setCollection({
          image: res[0].cl_cover === ''
            ? '/static/collection.png' : `http://localhost:3001/upload/${res[0].cl_cover}`,
          description: res[0].cl_description,
          title: res[0].cl_name,
          product: quizArray,
          quizList,
        });
      });
    }
    fetchData();
  }, []);
  async function handleEdit() {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };
  async function addQuizes() {
    setAddOpen(true);
  }
  const handleAddClose = () => {
    setAddOpen(false);
  };
  return (
    <div className={classes.root}>
      <Grid container xs={12} spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className={classes.cardContainer}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" variant="h6" gutterBottom>
                {collection.title}
              </Typography>
              <Divider className={classes.divider} />
              <img
                src={collection.image}
                className={classes.desImage}
                alt="Cover Image"
              />
              <Typography variant="body1">
                {collection.description}
              </Typography>
              <div className={classes.editButton}>
                <Button variant="contained" color="primary" onClick={() => { handleEdit(); }} style={{ fontSize: 16 }}>Edit</Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card className={classes.cardContainer}>
            <CardContent>
              <div className={classes.headerContainer}>
                <Typography className={classes.title} color="textSecondary" variant="h6" gutterBottom>
                  Entered students list
                </Typography>
              </div>
              <Divider className={classes.divider} />
              <div style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <DataGrid rows={product} columns={columns} pageSize={10} checkboxSelection />
                {/* <Grid container xs={12} spacing={2}>
                  {collection?.product?.map((product, index) => (
                  ))}
                </Grid> */}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <EditDialog
        open={open}
        handleClose={handleClose}
        id={id}
        title={collection.title}
        desc={collection.description}
        image={collection.image}
      />
      <AddDialog
        open={addOpen}
        handleClose={handleAddClose}
        id={id}
        selectedQuiz={selectedQuiz}
      />
    </div>
  );
}
