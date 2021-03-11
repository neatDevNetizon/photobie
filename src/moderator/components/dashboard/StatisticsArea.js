import React, { useState, useCallback, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Grid, withTheme } from "@material-ui/core";
import * as queries from '../../../graphql/queries';
import * as mutations from "../../../graphql/mutations";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import { connect } from 'react-redux';

import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import * as subscriptions from "../../../graphql/subscriptions";
import { fade, makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import { Timeline } from "@material-ui/lab";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const useStyles = makeStyles((theme) => ({
  cardGrid:{
    marginTop:20,
    marginRight:"5%",
    marginLeft:"5%", 
    cursor:"pointer",
    transition: "transform .3s ease",
    '&:hover': {
      transform: "scale(1.02)"
    },
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
  }
}));

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}

function StatisticsArea(props) {
  const { theme, CardChart, data} = props;
  const [events, setEvents] = useState(['']);
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const [userEmail, setUserEmail] = useState("");
  const classes = useStyles();
  const history = useHistory();
  const [mode, setMode] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  
  const viewEvent = async(e, event)=>{
    e.preventDefault();
    history.push("/m/detail?id="+event);
  }
  
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
  const calculateTimeLeft = (cdate) => {
    let cDate = new Date(cdate);
    cDate.setHours(24);
    cDate.setMinutes(-1)
    let difference = +cDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        timeFlag:1,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        text : "In "+Math.floor(difference / (1000 * 60 * 60 * 24))+" days "+Math.floor((difference / (1000 * 60 * 60)) % 24)+" hours"
      };
    } else {
      timeLeft = {
        timeFlag:2,
        days: Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24)),
        hours: Math.floor((Math.abs(difference) / (1000 * 60 * 60)) % 24),
        text : Math.floor(Math.abs(difference) / (1000 * 60 * 60 * 24))+" days "+Math.floor((Math.abs(difference) / (1000 * 60 * 60)) % 24)+" hours ago"
      };
    }
    return timeLeft;
    
  }
  const [handle, setHandle] = useState();
  useEffect(()=>{
   
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        setUserEmail(email);
        const eventlist = await API.graphql(graphqlOperation(queries.listEventss, { filter: {user:{eq:email}}},{filter:{createdAt:{orderBy:'ASC'}}}));
          const data = eventlist.data.listEventss.items;
          let array = [];
          for(let i=0; i<data.length; i++){
            const timer = await calculateTimeLeft(data[i].cdate);
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
                status:data[i].status*1,
                image:res,
                cdate:timer.text,
                timeFlag:timer.timeFlag
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
    
  },[handle])
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
              status:event.value.data.onCreateEvents.status*1,
              image:imageUrl,
            }]);
          }
          console.log("subscritpins", event.value.data.onCreateEvents)
        }
      });
    }
    // refreshList(events);
    // async function refreshList(eventlist){
    //   const subscription = API.graphql(graphqlOperation(subscriptions.onUpdateEvents)).subscribe({
    //     next:async(event)=>{
    //       // setEvents([...eventlist]);
    //       console.log(event.value.data.onUpdateEvents);
    //       console.log(eventlist)

    //       var imageUrl;
    //       await Storage.get(event.value.data.onUpdateEvents.image, { expires: 300 }).then(res=>{
    //         imageUrl = res;
    //       })
    //       setEvents([...eventlist, {
    //         id:event.value.data.onUpdateEvents.id,
    //         user:event.value.data.onUpdateEvents.user,
    //         token:event.value.data.onUpdateEvents.token,
    //         location:event.value.data.onUpdateEvents.location,
    //         title:event.value.data.onUpdateEvents.title,
    //         secure:event.value.data.onUpdateEvents.secure,
    //         capacity:event.value.data.onUpdateEvents.capacity,
    //         description:event.value.data.onUpdateEvents.description,
    //         type:event.value.data.onUpdateEvents.type,
    //         status:event.value.data.onUpdateEvents.status*1,
    //         image:imageUrl,
    //       }]);
          
    //     }
    //   })
    // } 
  },[events]);
  
  async function handleUpdate(e){
    e.preventDefault();
    setDialogOpen(true)
  }
  function dialogClose(){
    setDialogOpen(false);
    setDialogContent("");
    setCancelId("");
    setCancelToken(0);
    setCancelFlag(0);
  }
  async function cancelEvent(){
    setIsLoading(true);

    const eventID = await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq:cancelId}}}));
    const eStatus = eventID.data.listEventss.items[0].status*1;
    const minimumToken = eventID.data.listEventss.items[0].token*1;
    const managerEmail = eventID.data.listEventss.items[0].user;
    const eventTitle = eventID.data.listEventss.items[0].title;

    if(cancelFlag===1&&(eStatus===1||eStatus===2)){
      const manager = await API.graphql(graphqlOperation(queries.listUserCs, {filter:{
        email:{eq:managerEmail}
      }}));
      
      const managerToken = manager.data?.listUserCs?.items[0]?.token*1;
      const manUpdateToken = managerToken + cancelToken*1;
      const managerID = manager.data?.listUserCs?.items[0]?.id;
      await API.graphql(graphqlOperation(mutations.updateUserC, {input:{id : managerID, token:manUpdateToken}})); 

      await API.graphql(graphqlOperation(queries.listTransactions, {filter:{eventid:{eq:cancelId}, userid:{eq:managerID}}})).then(async (res) => {
        await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: res.data.listTransactions.items[0].id, status: 3}}))
      });
      const transData = {
        userid: managerID,
        eventid:cancelId,
        detail:'Canceled an event "' + eventTitle+'"',
        amount: cancelToken*1,
        date:new Date(),
        status:3
      }
      await API.graphql(graphqlOperation(mutations.createTransaction,{input:transData}));

      const providerList = await API.graphql(graphqlOperation(queries.listProviderss, { filter: {eventid:{eq:cancelId}}}));
      const providers = providerList?.data?.listProviderss?.items;
      console.log(providers)
      if(providers){
        for(let i = 0; i<providers.length;i++){
          var upticks = null;
          var clientsList = providers[i].clients;
          const providerID = providers[i].provider;
          const userBData = await API.graphql(graphqlOperation(queries.listUserBs, {filter:{id:{eq:providerID}}}));

          const providerToken = userBData.data.listUserBs.items[0].token*1;
          const proCanToken = providerToken + minimumToken*0.2;

          console.log(proCanToken, minimumToken, providerToken);
          const clientUpdate = await API.graphql(graphqlOperation(mutations.updateUserB,{input:{id:providerID, token : proCanToken}}));

          await API.graphql(graphqlOperation(queries.listTransactions, {filter:{eventid:{eq:cancelId}, userid:{eq:providerID}}})).then(async (res) => {
            await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: res.data.listTransactions.items[0].id, status: 3}}))
          });
          const transDataBs = {
            userid: providerID,
            eventid:cancelId,
            detail:'Deducted from an event "' + eventTitle+'"',
            amount: minimumToken*0.2,
            date:new Date(),
            status:3
          }
          await API.graphql(graphqlOperation(mutations.createTransaction,{input:transDataBs}));

          if(clientsList){
            upticks = JSON.parse(clientsList);
            for(let j = 0; j<upticks.length; j++){
  
              const clientsIDs = await API.graphql(graphqlOperation(queries.listUserAs, {filter:{email:{eq:upticks[j].email}}}));
              const userId = clientsIDs.data?.listUserAs?.items[0]?.id;
              const userToken = clientsIDs?.data?.listUserAs?.items[0]?.token*1;

              const transaction = await API.graphql(graphqlOperation(queries.listTransactions, {filter:{eventid:{eq:cancelId}, userid:{eq:userId}}}));

              await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: transaction.data.listTransactions.items[0].id, status: 3}}))

              const transToken = Math.abs(transaction.data?.listTransactions?.items[0]?.amount*1);
              const retakeToken = transToken?transToken:0+userToken;
              console.log(retakeToken);

              const transDataAs = {
                userid: userId,
                eventid:cancelId,
                detail:'Deducted from an event "' + eventTitle+'"',
                amount: transToken?transToken:0,
                date:new Date(),
                status:3
              }
              await API.graphql(graphqlOperation(mutations.createTransaction,{input:transDataAs}));

              const clientUpdate = await API.graphql(graphqlOperation(mutations.updateUserA,{input:{id:userId, token : retakeToken}}));
            }
          } else { upticks = 0;}
        }
      }
    } else if(cancelFlag === 2&&(eStatus===1||eStatus===2)){
      console.log("adfasdf");
      const providerList = await API.graphql(graphqlOperation(queries.listProviderss, { filter: {eventid:{eq:cancelId}}}));
      const providers = providerList?.data?.listProviderss?.items;
      if(providers){
        for(let i = 0; i<providers.length;i++){
          var upticks = null;
          var clientsList = providers[i].clients;
          const providerID = providers[i].provider;
          const userBData = await API.graphql(graphqlOperation(queries.listUserBs, {filter:{id:{eq:providerID}}}));

          const providerToken = userBData.data.listUserBs.items[0].token*1;
          const proCanToken = providerToken + minimumToken*0.2 + cancelToken*0.5;

          console.log(proCanToken, minimumToken, providerToken)
          const clientUpdate = await API.graphql(graphqlOperation(mutations.updateUserB,{input:{id:providerID, token : proCanToken}}));
          
          await API.graphql(graphqlOperation(queries.listTransactions, {filter:{eventid:{eq:cancelId}, userid:{eq:providerID}}})).then(async (res) => {
            await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: res.data.listTransactions.items[0].id, status: 3}}))
          });

          const transDataBs = {
            userid: providerID,
            eventid:cancelId,
            detail:'Deducted from an event "' + eventTitle+'"',
            amount: minimumToken*0.2 + + cancelToken*0.5,
            date:new Date(),
            status:3
          }
          await API.graphql(graphqlOperation(mutations.createTransaction,{input:transDataBs}));

          if(clientsList){
            upticks = JSON.parse(clientsList);
            const plusToken = cancelToken*0.5/upticks.length;
            for(let j = 0; j<upticks.length; j++){
              
              const clientsIDs = await API.graphql(graphqlOperation(queries.listUserAs, {filter:{email:{eq:upticks[j].email}}}));
              const userId = clientsIDs.data?.listUserAs?.items[0]?.id;
              const userToken = clientsIDs?.data?.listUserAs?.items[0]?.token*1;

              const transaction = await API.graphql(graphqlOperation(queries.listTransactions, {filter:{eventid:{eq:cancelId}, userid:{eq:userId}}}));

              await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: transaction.data.listTransactions.items[0].id, status: 3}}));

              const transToken = Math.abs(transaction.data?.listTransactions?.items[0]?.amount*1);
              const transDataAs = {
                userid: userId,
                eventid:cancelId,
                detail:'Deducted from an event "' + eventTitle+'"',
                amount: transToken?transToken:0+plusToken,
                date:new Date(),
                status:3
              }
              await API.graphql(graphqlOperation(mutations.createTransaction,{input:transDataAs}));

              const retakeToken = transToken?transToken:0+userToken+plusToken;
              console.log(transToken, userToken, plusToken, retakeToken)
              const clientUpdate = await API.graphql(graphqlOperation(mutations.updateUserA,{input:{id:userId, token : retakeToken}}));
            }
          } else { upticks = 0;}
        }
      }
    } 
    const cancelEvents = await API.graphql(graphqlOperation(mutations.updateEvents, {input:{id:cancelId, status:4}}))
    setHandle(cancelEvents);
    // handleUpdateResult();
    setIsLoading(false)
    dialogClose();
  }
  async function handleUpdateResult(){

  }
  const [dialogContent, setDialogContent]  = useState("");
  const [cancelId, setCancelId] = useState("");
  const [cancelToken, setCancelToken] = useState(0);
  const [cancelFlag, setCancelFlag] = useState(0);

  async function handleCancelEvent(flag, event, eToken){
    if(!flag) return false;
    setDialogOpen(true);
    const chargeToken = eToken*0.2;
    setCancelId(event);
    setCancelToken(chargeToken);
    setCancelFlag(flag);
    if(flag==1){
      setDialogContent("If you cancel this event now, you will take back "+ chargeToken+" tokens($"+chargeToken/100+"USD) that you charged when created this event.")
    } else {
      setDialogContent("You cannot take back "+chargeToken+" tokens that you charged when created this event because you are canceling too late.")
    }
  }
  return (
    <div>
      <Dialog
        open={dialogOpen}
        onClose={dialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Do you want to cancel this Event?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialogClose} variant="contained" color="primary">
            No
          </Button>
          <Button onClick={cancelEvent} disabled={isLoading} variant="contained" color="primary" autoFocus>
            Yes {isLoading && <ButtonCircularProgress />}
          </Button>
        </DialogActions>
      </Dialog>
      {events.map((item, index)=>{
        return mode=="row"?<Grid item xs={12} md={12} className = {classes.cardGrid}>
        <Card >
          <div style = {{display:"flex", flexDirection:"row",}}>
          <Box style = {{display:"flex", alignItems:"center"}} onClick = {(e)=>viewEvent(e, item.id)}>
            <img src = {item.image} style = {{width:250, height:200,objectFit:"cover"}}></img>
          </Box>
            <div style = {{display:"flex", flexDirection:"column",width:"100%"}}>
              <Box pt={2} px={2} pb={4} style = {{display:"block"}}>
                <Box display="flex" justifyContent="space-between" >
                  <div onClick = {(e)=>viewEvent(e, item.id)}>
                    <Typography variant="subtitle1">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.location}
                    </Typography>
                    {item.status==3?null:item.status==4?null:<Typography variant="subtitle1">
                      {item.cdate}
                    </Typography>}
                  </div>
                  {item.status==3?<div>Finished</div>:item.status==4?<div>Canceled</div>:<div>
                    <BootstrapTooltip title="Edit event">
                        <IconButton
                          aria-label="More"
                          aria-owns={isOpen ? "long-menu" : undefined}
                          aria-haspopup="true"
                          style = {{zIndex:1000}}
                          color = "secondary"
                          onClick={(e)=>handleUpdate(e)}
                        >
                        <EditRoundedIcon />
                      </IconButton>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Cancel Event">
                      <IconButton
                          aria-label="More"
                          aria-owns={isOpen ? "long-menu" : undefined}
                          aria-haspopup="true"
                          style = {{zIndex:1000}}
                          color = "primary"
                          onClick={()=>handleCancelEvent(item.timeFlag, item.id, item.token)}
                        >
                        <CancelRoundedIcon />
                      </IconButton>
                    </BootstrapTooltip>
                  </div>}
                </Box>
              </Box >
              
              <CardContent style = {{display:"block",marginTop:-20}} onClick = {(e)=>viewEvent(e, item.id)}>
                <Box  boxShadow={0.2} >
                  {item.description}
                </Box>
              </CardContent>
            </div>
          </div>
        </Card>
      </Grid>:mode=="column"?<Grid item xs={12} md={12} className = {classes.cardGrid}>
          <Card >
            <div style = {{display:"flex", flexDirection:"column",}}>
            <Box style = {{display:"inline-block"}} onClick = {(e)=>viewEvent(e, item.id)}>
              <img src = {item.image} style = {{width:"100%", height:"45vw",objectFit:"cover"}}></img>
            </Box>
              <div style = {{display:"flex", flexDirection:"column",}}>
                <Box pt={2} px={2} pb={4} style = {{display:"block"}}>
                  <Box display="flex" justifyContent="space-between">
                    <div onClick = {(e)=>viewEvent(e, item.id)}>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.location}
                      </Typography>
                      <Typography variant="subtitle1">
                      {item.cdate}
                    </Typography>
                    </div>
                    {item.status==3?<div>Finished</div>:item.status==4?<div>Canceled</div>:<div>
                    <BootstrapTooltip title="Edit event">
                        <IconButton
                          aria-label="More"
                          aria-owns={isOpen ? "long-menu" : undefined}
                          aria-haspopup="true"
                          style = {{zIndex:1000}}
                          color = "secondary"
                          onClick={(e)=>handleUpdate(e)}
                        >
                        <EditRoundedIcon />
                      </IconButton>
                    </BootstrapTooltip>
                    <BootstrapTooltip title="Cancel Event">
                      <IconButton
                          aria-label="More"
                          aria-owns={isOpen ? "long-menu" : undefined}
                          aria-haspopup="true"
                          style = {{zIndex:1000}}
                          color = "primary"
                          onClick={()=>handleCancelEvent(item.timeFlag, item.id, item.token)}
                        >
                        <CancelRoundedIcon />
                      </IconButton>
                    </BootstrapTooltip>
                  </div>}
                  </Box>
                </Box >
                
                <CardContent style = {{display:"block"}} onClick = {(e)=>viewEvent(e, item.id)}>
                  <Box  boxShadow={0.2} height="300">
                    {item.description}
                  </Box>
                </CardContent>
              </div>
            </div>
          </Card>
      </Grid>:null
      })
    }
  </div>
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
