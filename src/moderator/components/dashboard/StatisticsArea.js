import React, { useState, useCallback, useEffect, useLayoutEffect } from "react";
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
import * as subscriptions from "../../../graphql/subscriptions";

function StatisticsArea(props) {
  const { theme, CardChart, data,classes } = props;
  const [events, setEvents] = useState(['']);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const [userEmail, setUserEmail] = useState("")
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
  const [mode, setMode] = useState("")
  useLayoutEffect(() => {
    function updateSize() {
      if(window.innerWidth<=650){
        setMode("column")
      }
      else setMode("row")
      return () => window.removeEventListener('resize', updateSize);
    }
    window.addEventListener('resize', updateSize);
    // if(mode!="right") updateSize();
    return () => window.removeEventListener('resize', updateSize);
    
  },[]);
  useEffect(()=>{
   
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        setUserEmail(email);
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
          if(window.innerWidth<=650){
            setMode("column")
          }
          else setMode("row")
        }
    }
    fetchUser();
    
  },[])
  useEffect(()=>{
    console.log(events)
    refreshEvent(events);
    async function refreshEvent(eventlist){
      const subscription = API
      .graphql(graphqlOperation(subscriptions.onCreateEvents))
      .subscribe({
        next: async(event) => {
          var imageUrl;
          await Storage.get(event.value.data.onCreateEvents.image, { expires: 300 }).then(res=>{
            imageUrl = res;
            console.log(res)
          })
          console.log(events)
          if(event.value.data.onCreateEvents.user==userEmail){
            setEvents([...eventlist, {
              id:event.value.data.onCreateEvents.id,
              user:event.value.data.onCreateEvents.user,
              token:event.value.data.onCreateEvents.token,
              location:event.value.data.onCreateEvents.location,
              title:event.value.data.onCreateEvents.title,
              secure:event.value.data.onCreateEvents.secure,
              capacity:event.value.data.onCreateEvents.capacity,
              description:event.value.data.onCreateEvents.description,
              type:event.value.data.onCreateEvents.type,
              status:event.value.data.onCreateEvents.status,
              image:imageUrl,
            }]);
          }
          console.log("subscritpins", event.value.data.onCreateEvents)
        }
      });
    }
  },[events]);
  
  async function handleUpdate(e){
    console.log("adfadfadf11")
  }
  async function handleFinish(){
    console.log("adfadfadf11")
  }
  return (
    events.map((item, index)=>{
      return mode=="row"?<Grid item xs={12} md={12} style = {{marginTop:15,marginRight:"2%",marginLeft:"2%", cursor:"pointer"}}>
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
  </Grid>:mode=="column"?<Grid item xs={12} md={12} style = {{marginTop:15}}>
        <Card onClick = {()=>viewEvent(item.id)}>
          <div style = {{display:"flex", flexDirection:"column",}}>
          <Box style = {{display:"inline-block"}}>
            <img src = {item.image} style = {{width:"100%", height:"45vw",objectFit:"cover"}}></img>
          </Box>
            <div style = {{display:"flex", flexDirection:"column",}}>
              <Box pt={2} px={2} pb={4} style = {{display:"block"}}>
                <Box display="flex" justifyContent="space-between">
                  <div>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.location}
                    </Typography>
                  </div>
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
    </Grid>:null
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
