import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Button
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
// import Page from 'src/components/Page';
import TypeTable from './TypeTable';
import Amplify, {API, graphqlOperation, Auth, Storage} from "aws-amplify";
import * as mutations from '../../../../graphql/mutations';
import * as queries from '../../../../graphql/queries';
import VenueDialog from './Dialog';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%',
    '&:hover': {
      animation: '0.25s ease 0s 1 normal none running'
    }
  }
}));
const EventType = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [venueModal, setVenueModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        setUserEmail(email);
        const userToken = await API.graphql(graphqlOperation(queries.listUserss, {filter:{email:{eq:email}}}))
        const typeArray = JSON.parse(userToken.data.listUserss.items[0].venues);
        console.log(userToken);
        let newData = [];
        for(let i=0; i<typeArray.length; i++){
          newData.push({
            name: typeArray[i].address,
          })
        }
        setRowData(newData);
      }
    }
    fetchUser();
  }, []);
  const refreshFunc = async() => {
    const userToken = await API.graphql(graphqlOperation(queries.listUserss, {filter:{email:{eq:userEmail}}}))
    const typeArray = JSON.parse(userToken.data.listUserss.items[0].venues);
    console.log(userToken);
    let newData = [];
    for(let i=0; i<typeArray.length; i++){
      newData.push({
        name: typeArray[i].address,
      })
    }
    setRowData(newData);
  }
  const goAddNewQuiz = () =>{
    setVenueModal(true)
  }
  const handleClose = () => {
    // setOpen(false);
    setVenueModal(false);
  };
  return (
    <div>
      <VenueDialog open={venueModal} status={''} refreshFunc = {refreshFunc} handleClose={handleClose}/>
      <Container maxWidth={false}>        
        <Card>
          <CardContent>
            <Grid container xs={12}>
              <Grid item xs={12} md={8}>
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
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Button
                    color="primary"
                    variant="contained"
                    style={{marginTop: 10, minWidth: 180}}
                    onClick={goAddNewQuiz}
                  >
                    Add Venue Address
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box mt={3}>
          <Grid
            container
            spacing={3}
          >
            <Grid
                item
                lg={12}
                md={12}
                xs={12}
              >
                <TypeTable rowData = {rowData} refreshFunc = {refreshFunc}/>
              </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default EventType;
