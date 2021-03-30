import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
// import Page from 'src/components/Page';
import Toolbar from './Toolbar';
import TypeTable from './TypeTable';
import Amplify, {API, graphqlOperation, Auth, Storage} from "aws-amplify";
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';

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
  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        const listType = await API.graphql(graphqlOperation(queries.listEventTypes));
        const typeArray = listType.data.listEventTypes.items;
        let newData = [];
        for(let i=0; i<typeArray.length; i++){
          newData.push({
            name: typeArray[i].typename,
            description: typeArray[i].description
          })
        }
        setRowData(newData);
      }
    }
    fetchUser();
  }, []);
  return (
      <Container maxWidth={false}>
        <Toolbar />
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
                <TypeTable rowData = {rowData} />
              </Grid>
          </Grid>
        </Box>
      </Container>
  );
};

export default EventType;
