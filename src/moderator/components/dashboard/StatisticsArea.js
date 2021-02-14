import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, withTheme } from "@material-ui/core";
import * as queries from '../../../graphql/queries';
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
} from "@material-ui/core";
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import { connect } from 'react-redux';
import UpdateIcon from '@material-ui/icons/Update';

function StatisticsArea(props) {
  const { theme, CardChart, data,classes } = props;
  const [events, setEvents] = useState(['']);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const history = useHistory();
  const viewEvent = async(event)=>{
    history.push("/m/detail?id="+event);
  }
  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        
        const eventlist = await API.graphql(graphqlOperation(queries.listEventss, { filter: {user:{eq:email}}}));
          const data = eventlist.data.listEventss.items;
          let array = [];
          for(let i=0; i<data.length; i++){
            const downloadUrl = await Storage.get(data[i].image, { expires: 300 }).then(res=>{
              array.push({
                id:data[i].id,
                user:data[i].user,
                token:data[i].token,
                location:data[i].location,
                title:data[i].title,
                secure:data[i].secure,
                capacity:data[i].capacity,
                description:data[i].description,
                type:data[i].type,
                status:data[i].status,
                image:res,
              })
            });
          }
          setEvents(array)
          // eventlist.data.listEventss.items.map(async(item,i)=>{
            
            
          // });
        
        }
        
    }
    fetchUser();

  },[])
  async function handleUpdate(e){
    console.log("adfadfadf11")
  }
  async function handleFinish(){
    console.log("adfadfadf11")
  }
  return (
    events.map((item, index)=>{
      return <Grid item xs={12} md={12} style = {{marginTop:15,marginRight:"2%",marginLeft:"2%", cursor:"pointer"}}>
      <Card >
        <div style = {{display:"flex", flexDirection:"row",}} onClick = {()=>viewEvent(item.id)}>
        <Box style = {{display:"inline-block"}}>
          <img src = {item.image} style = {{width:300, height:"100%",objectFit:"cover"}}></img>
        </Box>
          <div style = {{display:"flex", flexDirection:"column",width:"100%"}}>
            <Box pt={2} px={2} pb={4} style = {{display:"block"}}>
              <Box display="flex" justifyContent="space-between">
                <div>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  
                  <Typography variant="body2" color="textSecondary">
                    {item.location}
                   
                  </Typography>
                  
                </div>
                {/* <div>
                  <IconButton
                      aria-label="More"
                      aria-owns={isOpen ? "long-menu" : undefined}
                      aria-haspopup="true"
                      onClick={(e)=>handleUpdate}
                    >
                      <UpdateIcon />
                    </IconButton>
                    
                </div> */}
              </Box>
            </Box >
            
            <CardContent style = {{display:"block"}}>
              <Box  boxShadow={0.2} height="300">
                {item.description}
              </Box>
            </CardContent>
          </div>
        </div>
      </Card>
  </Grid>
    })
  )
    
  
}
const mapStateToProps = () => state => {
  return {
      userEmail: state.userEmail
  };
};
StatisticsArea.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  CardChart: PropTypes.elementType
};
export default withTheme(connect(mapStateToProps)(StatisticsArea));
