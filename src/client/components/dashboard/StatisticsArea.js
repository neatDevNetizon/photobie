import React, { useState, useCallback,useEffect,useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import FeatureCard from "./FeatureCard";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Grid, 
  withTheme,
  isWidthUp
} from "@material-ui/core";
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import { connect } from 'react-redux';
import UpdateIcon from '@material-ui/icons/Update';
import * as queries from '../../../graphql/queries';
import * as subscriptions from "../../../graphql/subscriptions";

function StatisticsArea(props) {
  const { theme, CardChart, data,classes, viewMode, width} = props;
  const [events, setEvents] = useState(['']);
  const[pageNum, setPageNum] = useState(1);
  
  function handleClick(){
    setPageNum(2)
  }
  const history = useHistory();
  const viewEvent = async(event)=>{
    history.push("/c/detail?id="+event);
  }
  const [loadingState, setLoadingState] = useState(false)
  const [mode,setMode] = useState("");
  useEffect(()=>{
    setMode(viewMode);
  },[viewMode]);

  useLayoutEffect(() => {
    function updateSize() {
      if(mode=="right"){
        setMode("right");
        return false;
      }
      else if(window.innerWidth>=700){
        if(mode!="right") setMode("left")
        else return;
      }
      else {
        if(mode!="right") setMode("middle")
        else return ;
      }
      return () => window.removeEventListener('resize', updateSize);
    }
    window.addEventListener('resize', updateSize);
    // if(mode!="right") updateSize();
    return () => window.removeEventListener('resize', updateSize);
    
  },[mode!="right"]);

  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        
        const eventlist = await API.graphql(graphqlOperation(queries.listEventss));
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
          setLoadingState(true)
        }
        
    }
    fetchUser();
  },[]);
  useEffect(()=>{
    refreshEvent(events);
    async function refreshEvent(eventlist){
      const subscription = API
      .graphql(graphqlOperation(subscriptions.onCreateEvents))
      .subscribe({
        next: async(event) => {
          var imageUrl;
          await Storage.get(event.value.data.onCreateEvents.image, { expires: 300 }).then(res=>{
            imageUrl = res;
          })
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
          console.log("eventlist", eventlist)
          console.log("subscritpins", event.value.data.onCreateEvents)
        }
      });
    }
  },[events]);
  return (
    <Grid container spacing={3} xs = {12} style = {{width:"80%",marginRight:"auto", marginLeft:"auto",cursor:"pointer"}}>
    {events.map((item,i)=>{
      return mode=="left"&&loadingState?<Grid item xs={12} md={12}>
        <Card onClick = {()=>viewEvent(item.id)}>
          <div style = {{display:"flex", flexDirection:"row",}}>
          <Box style = {{display:"inline-block"}}>
            <img src = {item.image} style = {{width:300, height:200,objectFit:"cover"}}></img>
          </Box>
            <div style = {{display:"flex", flexDirection:"column",}}>
              <Box pt={2} px={2}  style = {{display:"block"}}>
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
    </Grid>:mode=="right"&&loadingState?<Grid item xs = {12} sm = {6} md = {4} >
      <Card style = {cardstyles.cardbody} onClick = {()=>viewEvent(item.id)}>
          <CardActionArea>
            <img src = {item.image} style = {cardstyles.images}></img>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {item.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              <LocationOnIcon/>{item.location}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>:mode=="middle"&&loadingState?<Grid item xs={12} md={12}>
        <Card onClick = {()=>viewEvent(item.id)}>
          <div style = {{display:"flex", flexDirection:"column",}}>
          <Box style = {{display:"inline-block"}}>
            <img src = {item.image} style = {{width:"100%", height:"100%",objectFit:"cover"}}></img>
          </Box>
            <div style = {{display:"flex", flexDirection:"column",}}>
              <Box pt={2} px={2}  style = {{display:"block"}}>
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
    })}
    </Grid>
  )
}
const cardstyles = {
 
  cardbody:{
    marginLeft:10,
    marginRight:20,
    borderRadius:15,

  },
  images:{
    width:"100%",
    height:"100%",
    minHeight:250,
    maxHeight:250,
    shadowColor: "#000",
    objectFit:"cover",
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 1.2,
    shadowRadius: 3.30,
    elevation: 3,
  }
};
StatisticsArea.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  CardChart: PropTypes.elementType
};

export default withTheme(StatisticsArea);
