import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  withStyles,
  Card,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from "react-router-dom";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import Carousel from "react-multi-carousel";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "react-multi-carousel/lib/styles.css";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between",
  },
  images:{
    width:"100%",
    height:"100%",
    objectFit:"cover"
  },
  imagePlus:{
    width:"60%",
    height:"100%",
  },
  imageBody:{
    padding:3,
    paddingRight:5
  },
  showPlus:{
    padding:3,
    paddingRight:5,
    display:"block"
  },
  hidePlus:{
    display:"none"
  },
  canelIcon:{
    position:"absolute",
    marginTop:-12,
    marginLeft:-13,
  },
  slideImage:{
    width: "100%",
    height: 200,
    objectFit: "cover",
  },
  avatar:{
    width: 60,
    height: 60,
  },
  heading: {
    fontSize: 20,
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: 20,
  },
  avatarDiv:{
    display:"flex", 
    flexDirection:"row", 
    paddingTop:20,
    paddingLeft:20
  },
  otherPadding:{
    paddingTop:5,
    paddingLeft:20
  },
  uptickPadding:{
    paddingTop:20,
    paddingRight:20,
    paddingBottom: 20,
    display: 'flex'
  }
};
const useStyles = makeStyles((theme) => ({
  root: {
    margin:"0 auto",
    '& .MuiTextField-root': {
      // margin: theme.spacing(3),
      position:'flex',
      width: '50vw',
      height:"13vh",
      justifyContent: "space-between"
    },
  },
  cardGrid:{
    marginTop:10,
    cursor:"pointer",
    transition: "transform .3s ease",
    '&:hover': {
      transform: "scale(1.02)"
    },
    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px"
  }
}));

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1 ,
    // paritialVisibilityGutter: 60
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

function PostContent(props) {
  const { openAddBalanceDialog } = props;
  const handle  = props.location.search;
  const id = new URLSearchParams(handle).get('id');
  const [bidText, setBidText] = useState(['']);
  const [textrequired, setTextrequired] = useState(['txtrequiredHidden']);
  const [imageSrc, setImageSrc] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [user, setUser] = useState("");
  const [file, setFile] = useState([]);
  const [toUpload, setToUpload] = useState([]);
  const [capacity, setCapacity] = useState(null);
  // const [proLocation, setProLocation] = useState('');
  const [proCapacity, setProCapacity] = useState('');
  const [proToken, setProToken] = useState('');
  const [plusFade, setPlusFade] = useState("showPlus")
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [requiredToken, setRequiredToken] = useState(null);
  const [userToken, setUserToken] = useState();
  const [userId, setUserId] = useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [bidConfirm, setBidConfirm] = useState(0);
  const [providers, setProviders] = useState([]);
  const classes = useStyles();
  const [duration, setDuration] = useState('');
  const [clientList, setClientList] = useState("");
  const [providerId, setProviderId] = useState('');
  const [eventStart, setEventStart] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const eventlist = await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq: id}}}));
      const selEvent = eventlist.data.listEventss.items[0];
      console.log(selEvent);
      await Storage.get(selEvent.image, { expires: 300 }).then(res=>{
        setImageSrc(res)
        setTitle(selEvent.title);
        setLocation(selEvent.location);
        setDescription(selEvent.description);
        setCapacity(selEvent.capacity);
        setRequiredToken(selEvent.token);
        setEventStart(selEvent.cdate);
        const day = new Date(selEvent.cdate);
        const fromDate = day.getFullYear()+"/"+(day.getMonth()+1)+"/"+day.getDate()+ " "+day.getHours()+":"+day.getMinutes();
        const date = day.getDate();
        day.setMinutes(day.getMinutes()+selEvent.duration);
        var toDates;
        if(date!==day.getDate()){
          toDates = (day.getMonth()+1)+"/"+day.getDate()+ " "+day.getHours()+":"+day.getMinutes();
        } else {
          toDates = day.getHours()+":"+day.getMinutes();
        }
        setDuration(fromDate + " ~ " + toDates);
      })
      
    }
    async function fetchData() {
      const user =await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else {
        setUser(user.attributes.email);
        const hasToken = await API.graphql(graphqlOperation(queries.listUserBs, {filter:{email:{eq:user.attributes.email}}}));
        if(hasToken.data.listUserBs.items[0].token){
          setUserToken(hasToken.data?.listUserBs?.items[0]?.token);
        } else setUserToken(0);
        setUserId(hasToken.data?.listUserBs?.items[0]?.id);
        const proBid = await API.graphql(graphqlOperation(queries.listProviderss, {filter:{eventid:{eq: id}, provider:{eq:hasToken.data?.listUserBs?.items[0]?.id}}}));
        setClientList(proBid.data.listProviderss?.items[0]?.clients);
        setProviderId(proBid.data.listProviderss?.items[0]?.id);
        if(proBid.data.listProviderss?.items[0]?.eventid=== id){
          const providers = proBid.data.listProviderss.items;
          var providerArray = [];
          for(let i = 0; i<providers.length;i++){
            var upticks = null;
            var clientsList = providers[i].clients;
            
            if(clientsList){
              upticks = JSON.parse(clientsList).length;
            } else { upticks = 0;}

            var imageObject = []
            var imageArray = providers[i].images.split(",");

            for(let j = 0; j<imageArray.length-1; j++){
              await Storage.get(imageArray[j], { expires: 300 }).then(res=>{
                imageObject.push(res);
              })
            }
            providerArray.push({
              capacity:providers[i].capacity,
              token:providers[i].token,
              description:providers[i].description,
              location:providers[i].location,
              images: imageObject,
              providerId:providers[i].id,
              upticks: upticks,
              provEmail:providers[i].provider,
            })
            
          }
          setProviders(providerArray)
          setBidConfirm(0);
        } else setBidConfirm(1);
      }
    }
    fetchUser();
    fetchData();
  }, []);
  
  const descriptionSet = (e) =>{
    setBidText(e.target.value);
  }
  

  function uploadSingleFile(e) {
    if(e.target.files[0]&&file.length<=8){
      setFile([...file, URL.createObjectURL(e.target.files[0])]);
      setToUpload([...toUpload, e.target.files[0]]);
      if(file.length===7) setPlusFade("hidePlus")
    } 
    return ;
    
  }

  async function upload(e) {
    e.preventDefault();
    setIsLoading(true);
    if(userToken<requiredToken){
      enqueueSnackbar('Token is not enough.', {
        variant: 'info',
        action: key => (
          <CloseIcon onClick={() => closeSnackbar(key)}/>
        )
      });
      history.push("/p/getoken");
      return false;
    }
    if(toUpload.length>0){
      var d = new Date();
      var n = d.getTime();
      var imageNames = ""
      for(let i = 0; i<toUpload.length; i++){
        const name = n+"-"+(i+1)+".jpg";
        await Storage.put(name, toUpload[i] , {
          contentType: 'image/jpg',
          level: 'public'
        });
        imageNames += name + ",";
      }
      handleAddBid(imageNames)
    } else{
      handleAddBid()
    }
    return;
  }
  async function handleAddBid(e){
    var data = {};
    
    if(e){
      data = {
        provider:userId,
        eventid: id,
        description:bidText,
        capacity:proCapacity,
        token:proToken,
        // location:proLocation,
        images:e,
      }
    } else{
      data = {
        provider:userId,
        eventid: id,
        description:bidText,
        capacity:proCapacity,
        token:proToken,
        // location:proLocation,
        images:""
      }
    }
    const upToken = userToken-(requiredToken*0.2);
    const newProvider = await API.graphql(graphqlOperation(mutations.createProviders, {input: data}));
    await API.graphql(graphqlOperation(mutations.updateUserB, {input:{id:userId, token : upToken}}));

    const transData = {
      userid:userId,
      eventid:newProvider.data.createProviders.id,
      detail: `Bidded in "${title}" event`,
      amount:-requiredToken*0.2,
      date:new Date(),
      status:1
    }
    await API.graphql(graphqlOperation(mutations.createTransaction,{input:transData}));
    history.push('/p/dashboard');
    setIsLoading(false);
    return;
  }

  function deleteFile(e) {
    const s = file.filter((item, index) => index !== e);
    const u = toUpload.filter((item, index) => index !== e);
    setFile(s);
    setToUpload(u);
    if(s.length<8)setPlusFade("showPlus")
  }
  function handleToken(e){
    setProToken(e.target.value)
  }
  
  function handleCapacity(e){
    setProCapacity(e.target.value)
  }
  function handlePlusImage(){
    document.getElementById("fileForm").click()
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  function dialogClose(){
    setDialogOpen(false);
    setCancelLoading(false);
  }
  async function handleCancel(){
    setDialogOpen(true);
  }
  async function cancelEvent(){
    const now = new Date().getTime();
    const start = new Date(eventStart).getTime();
    const eightHours = 1000*60*60*8;
    console.log(start-now, eightHours);
    if(start-now < eightHours){
      alert("You cannot cancel cause you are too late.");
      return false;
    }
    setCancelLoading(true);
    console.log(userId, providerId)
    const transList = await API.graphql(graphqlOperation(queries.listTransactions, {filter: {userid: {eq: userId}, eventid: {eq:providerId}}}));
    const transData = transList?.data?.listTransactions?.items[0];
    await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: transData.id, status: 3}}));
    const newProTrans = {
      userid: userId,
      eventid:providerId,
      detail: 'Refund from a your bid cancellation about "'+title+'" event.',
      amount: Math.abs(transData.amount),
      date:new Date(),
      status:3
    }
    await API.graphql(graphqlOperation(mutations.createTransaction,{input:newProTrans}));


    const newToken = userToken*1 + Math.abs(transData?.amount?transData.amount:0);
    const updateb = await API.graphql(graphqlOperation(mutations.updateUserB, {input:{id:userId, token : newToken}}));
    console.log(updateb);

    const clients = JSON.parse(clientList);
    if(clients){
      for(let i=0; i<clients.length; i++) {
        const clientId = await API.graphql(graphqlOperation(queries.listUserAs, {filter: {email: {eq: clients[i].email}}}));
        const clientData = clientId.data.listUserAs.items[0];
        const clienTrans = await API.graphql(graphqlOperation(queries.listTransactions, {filter: {userid:{eq: clientData.id}, eventid:{eq: providerId}}}));
        const cliTransData = clienTrans.data.listTransactions.items[0];
        const clientToken = clientData.token*1 + Math.abs(cliTransData.amount);
        await API.graphql(graphqlOperation(mutations.updateUserA, {input:{id:clientData.id, token : clientToken}}));
        // await API.graphql(graphqlOperation(mutations.deleteTransaction, {input:{id: cliTransData.id}}));
        await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: cliTransData.id, status: 3}}));
        const newTrans = {
          userid: clientData.id,
          eventid:providerId,
          detail: 'Refund from a provider\'s bid cancellation about "'+title+'" event.',
          amount: Math.abs(cliTransData.amount),
          date:new Date(),
          status:3
        }
        await API.graphql(graphqlOperation(mutations.createTransaction,{input:newTrans}));
      }
    }
    await API.graphql(graphqlOperation(mutations.deleteProviders, {input: {id: providerId}}));
    // await API.graphql(graphqlOperation(mutations.deleteTransaction, {input: {id: transData.id}}));
    setCancelLoading(false);
    dialogClose();
    history.push('/p/dashboard');
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
            Will you cancel to provide this event?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialogClose} variant="contained" color="primary">
            No
          </Button>
          <Button onClick={cancelEvent} disabled={cancelLoading} variant="contained" color="primary" autoFocus>
            Yes {cancelLoading && <ButtonCircularProgress />}
          </Button>
        </DialogActions>
      </Dialog>
      <Paper>
        <img src = {imageSrc} style = {{width:"100%", marginTop:-50, height:400,objectFit:"cover"}}></img>
      </Paper>
      <Grid container spacing={3} style = {{width:"70%",marginTop:30,marginRight:"auto", marginLeft:"auto"}}>
        {/* <Grid item xs = {12} md={1}  sm = {2}>
        <Typography>Details</Typography>
        </Grid> */}
        <Grid item xs = {12} md={8} sm = {10}>
          <SkeletonTheme color="lightgrey" highlightColor="white">
            {title === "" ? <Skeleton width="60%" animation="wave"/> : <Typography>Title : {title}</Typography>}
            {location === "" ? <Skeleton width="60%"/> : <Typography>Location : {location}</Typography>}
            {duration === "" ? <Skeleton width="60%"/> : <Typography>Duration : {duration}</Typography>}
            {description === "" ? <Skeleton count={2}/> : <Typography>{description}</Typography>}
          </SkeletonTheme>
        </Grid>
        <Grid item xs = {12} md={3} sm={12}>
          {capacity === null ? <Skeleton /> : <Typography>Capacity : {capacity}</Typography>}
          {requiredToken === null ? <Skeleton /> : <Typography>Required token : {requiredToken}</Typography>}
        </Grid>
      </Grid>

      <Grid container spacing={1} style = {{width:"80%",marginTop:30,marginRight:"auto", marginLeft:"auto"}}><Grid item xs = {12} md = {12}>
          {providers.map((items, index)=>{
            return <Card key = {index} className = {classes.cardGrid}>
              <Grid container spacing = {1}>
                <Grid item xs = {12} md = {3}>
                <Carousel  
                    swipeable={false}
                    draggable={false}
                    showDots={false}
                    responsive={responsive}
                    ssr={true} 
                    infinite={true}
                    keyBoardControl={true}
                    transitionDuration={500}
                    containerClass="carousel-container">
                    {items.images.map((imageUrl, i)=>{
                      return <div key = {i}>
                          <img src={imageUrl} style = {styles.slideImage} />
                      </div>
                      }
                    )}
                </Carousel>
                </Grid>
                <Grid item xs = {12} md = {7}>
                  <Grid container spacing = {3} style = {styles.otherPadding}>
                    
                    <Grid item xs = {12} md = {4}>
                      <Typography variant="body2" >
                        Capacity : {items.capacity}
                      </Typography>
                      <Typography variant="body2" >
                        Token : {items.token}
                      </Typography>
                    </Grid>
                  </Grid>
                   {items.description.length > 300 ? <Typography variant="body2" style ={{paddingLeft:20, marginTop: 20}}>{items.description.slice(0, 400)+"..."}<ExpandMoreIcon style = {{float:"right", marginRight:20}}/></Typography>:<Typography variant="body2" style ={{paddingLeft:20, marginTop: 20}}>{items.description}</Typography>}
                </Grid>
                <Grid item xs = {12} md = {2} style = {styles.uptickPadding}>
                  <Grid container xs={12}>
                    <Grid item xs={12} sm ={6} lg={12} md={12} xl={12}>
                      <Typography variant="body2" >
                        Clients :{items.capacity} / {items.upticks}
                      </Typography>
                      <Box display="flex" alignItems="center" marginLeft = {1}>
                        <Box width="90%" mr={1}>
                          <LinearProgress variant="determinate" value = {items.upticks/items.capacity*100} />
                        </Box>
                        <Box minWidth={35}>
                          <Typography variant="body2" color="textSecondary">{items.upticks/items.capacity*100}%</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          })}
        </Grid></Grid>
    </div>
  );
}

PostContent.propTypes = {
  openAddPostModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPosts: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
};

export default withStyles(styles)(PostContent);
