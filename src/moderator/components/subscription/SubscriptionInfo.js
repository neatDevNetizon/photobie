import React, { useState, useEffect,useRef } from "react";
import PropTypes from "prop-types";
import { flexbox, spacing } from '@material-ui/system';
import { useHistory } from "react-router-dom";
import SecurityIcon from '@material-ui/icons/Security';
import PublicIcon from '@material-ui/icons/Public';
import Button from '@material-ui/core/Button';
import Amplify, {API, graphqlOperation, Auth, Storage } from "aws-amplify";
import * as mutations from '../../../graphql/mutations';
import {
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  withStyles,
  Toolbar,
  TextField,
  makeStyles,
  BottomNavigation,
  BottomNavigationAction,
  Typography
} from '@material-ui/core';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import CancelIcon from '@material-ui/icons/Cancel';
import * as queries from "../../../graphql/queries";
import { useSnackbar } from 'notistack';
import CloseIcon from '@material-ui/icons/Close';
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import * as subscriptions from "../../../graphql/subscriptions";
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';

const styles = {
  toolbar: {
    justifyContent: "space-between",
  },
  txtFiled: {
    justifyContent: "space-between",
    width:"50vw",
    fontSize:'1.5em'
  },
  twoTextField:{
    justifyContent: "center",
    width:"24vw",
    fontSize:'1.5em',
    marginRight:"2vw",
    display:"flex",
    flexDirection:"row",
  },
  twoTextField1:{
    display:"none"
  },
  txtrequired: {
    justifyContent: "space-between",
    color: 'firebrick',
    fontSize: '13px',
    marginTop:'0px',
  },
  txtrequiredHidden: {
    justifyContent: "space-between",
    color: 'firebrick',
    fontSize: '13px',
    display:'none',
    marginTop:'0px',
  },
  twoFieldReqiredHidden:{
    display:"none",
    color: 'firebrick',
    fontSize: '13px',
    marginTop:'0px',
  },
  twoFieldReqired:{
    color: 'firebrick',
    fontSize: '13px',
    marginTop:'0px',
  },
  txtFiled1: {
    justifyContent: "space-between",
    marginTop: "10px",
    display:'none',
    width:"50%",
    fontSize:'1.5em'
  },
  
  txtFiled2: {
    display:'none',
  },
  txtFiled3: {
    justifyContent: "space-between",
    fontSize:'3em',
    marginTop:20,
  },
  toppadding:{
    marginTop:'40px'
  },
  toppadding2:{
    marginTop:20,
    width:"50vw",
    height:180,
    borderStyle:"dotted",
    borderWidth:2, 
    borderColor:"grey",
    cursor:"pointer"
  },
  previews:{
    marginTop:30,
    justifyContent:"center",
    alignItems:"center",
    display:"flex",
    flexDirection:"column",
  },
  bottompadding:{
    marginTop:20,
    display: "flex",
    justifyContent: "center",
    marginBottom:'5px'
  },
  button: {
    marginBottom:'30px',
    paddingRight:20,
    paddingLeft:20,
    // margin: theme.spacing.unit,
  },
  image:{
    marginTop:20,
    width:"50vw",
    objectFit:"cover",
  },
  fileModal:{
    height:180,
    zIndex:100,
    marginTop:-30,
    opacity:0.6,
    borderStyle:"solid", 
    width:"50vw", 
    borderColor:"black", 
    borderWidth:1, 
    display:"contents"
  },
  imageLetterHidden:{
    display:"none"
  },
  showImageSection:{
    display:"block",
  },
  hideImageSection:{
    display:"none"
  },
  cancelImage:{
    fontSize:40, 
    position:"absolute", 
    marginTop:40,
    marginLeft:-60
  },
  duration: {
    width: '100%',
    marginTop: 14
  },
  listItem: {
    whiteSpace: "normal",
  }
};
const useStyles = makeStyles((theme) => ({
  root: {
    margin:"0 auto",
    '& .MuiTextField-root': {
      // margin: theme.spacing(3),
      position:'flex',
      width: '50vw',
      marginTop:"15px",
      justifyContent: "space-between"
    },
  },
}));
function SubscriptionInfo(props) {
  const [moderator, setModerator] = useState("");
  const [userToken, setUserToken] = useState();
  const [userId, setUserId] = useState();
  const [favorTypes, setFavorTypes] = useState([]);
  const [venues, setVenues] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const user =await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        setModerator(user.attributes.email);
        const hasToken = await API.graphql(graphqlOperation(queries.listUserCs, {filter:{email:{eq:user.attributes.email}}}));
        if(hasToken.data.listUserCs.items[0].token){
          setUserToken(hasToken.data.listUserCs.items[0].token);
        } else setUserToken(0);
        setUserId(hasToken.data.listUserCs.items[0].id);
        const userProps = await API.graphql(graphqlOperation(queries.listUserss, {filter:{email:{eq:user.attributes.email}}}));
        const userFavorData = userProps.data.listUserss.items[0].favortype;
        const venueList = JSON.parse(userProps.data.listUserss.items[0].venues);

        const arr1 = venueList.filter(d => d.status === 2);
        setVenues(arr1);
        if(userFavorData)setFavorTypes(userFavorData.split(","));
      }
    }
    fetchData();
  },[]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const descriptionSet = (e) =>{
    setDescription(e.target.value);
  }
  const titleSet = (e) =>{
    setTitle(e.target.value);
    console.log(moderator)
  }
  const locationSet = (e) =>{
    setLocation(e.target.value);
  }
  const capacitySet = (e) =>{
    setCapacity(e.target.value);
  }
  const tokenSet = (e) => {
    setToken(e.target.value)
  }
  const typeSet = (e) => {
    setType(e.target.value)
  }
  const imageSelect = () =>{
    document.getElementById("image_select").click();
  }
  async function handleImageChange(e){
    if(e.target.files[0]){
      console.log(e.target.files[0])
      e.preventDefault();
      let file = e.target.files[0];
      let reader = URL.createObjectURL(e.target.files[0])
      var d = new Date();
      var n = d.getTime();
      const picture = n+".jpg";
      setImageSource(reader)
      setImageLetter("imageLetterHidden");
      setImageSection("showImageSection");
      scrollToBottom();
      await Storage.put(picture, file, {
        contentType: 'image/jpg',
        level: 'public'
      });
      // const downloadUrl = await Storage.get(picture, { expires: 300 });
      setPictureUrl(picture)
    }
    scrollToBottom();
    return;
  }
  const scrollToBottom= async()=> {
    await wholePage.current.scrollIntoView({ behavior: 'smooth', block:"end",inline:"end" });
  }
  const cancelImageSelect = () =>{
    setImageLetter("toppadding2");
    setImageSection("hideImageSection")
    setImageSource("")
    document.getElementById("image_select").value = ""
  }
  const { classes, openAddBalanceDialog } = props;
  const classess = useStyles();
  const history = useHistory();

  const [title, setTitle] = useState(['']);
  const [description, setDescription] = useState(['']);
  const [location, setLocation] = useState(['']);
  const [capacity, setCapacity] = useState(0);
  const [postbtn, setPostbtn] = useState(['next']);
  const [token, setToken] = useState(0);
  const [value, setValue] = useState("2");
  const [textrequired, setTextrequired] = useState(['txtrequiredHidden']);
  const [cart, setCart] = useState(['txtFiled1']);
  const [security, setSecurity] = useState(['txtFiled2']);
  const [count, setCount] = useState(0);
  const [titleRequired, setTitleRequired] = useState("txtrequiredHidden");
  const [typeRequired, setTypeRequired] = useState("txtrequiredHidden");
  const [capacityrequired, setCapacityrequired] = useState("twoFieldReqiredHidden");
  const [locationrequired, setLocationrequired] = useState("twoFieldReqiredHidden");
  const [twocart, setTwocart] = useState("twoTextField1");
  const [tokenrequired, setTokenrequired] = useState("twoFieldReqiredHidden")
  const [type, setType] = useState("");
  const [imageSource, setImageSource] = useState("")
  const [imageLetter, setImageLetter] = useState("toppadding2");
  const [imageSection, setImageSection] = useState("hideImageSection");
  const [image, setImage] = useState("imageLetterHidden");
  const [pictureUrl, setPictureUrl] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false)
  const wholePage = useRef();
  const [events, setEvents] = useState();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [duration, setDuration] = useState(15);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const test = async() => {
    
    if(count == 0){
      if(title.length < 3){
        setTitleRequired("txtrequired");
        return;
      } else {
        setTitleRequired("txtrequiredHidden");
      }
      if(type.length < 3){
        setTypeRequired("txtrequired");
        return;
      } else {
        setTypeRequired("txtrequiredHidden");
      }
      if (description.length > 20){
        setTextrequired('txtrequiredHidden')
        setCart('txtFiled')
        setTwocart("twoTextField")
        setCount(count + 1);
      } else {
        setTextrequired("txtrequired");
        return;
      }
      return
    }
    else if(count === 1){
      setImage("showImageSection");
      console.log(typeof location);
      if(location.length>0){
        setLocationrequired('twoFieldReqiredHidden')
      }
      else{
        setLocationrequired('twoFieldReqired')
        return;
      }
      if(capacity.length > 0){
        setCapacityrequired('twoFieldReqiredHidden')
      }
      else{
        setCapacityrequired('twoFieldReqired')
        return;
      }
      if(token.length > 0){
        setTokenrequired('twoFieldReqiredHidden')
        setSecurity('txtFiled3')
        setPostbtn('complete')
        setCount(count + 1);
      }
      else{
        setTokenrequired('twoFieldReqired')
        return;
      }
      return
    }
    else
    {
      if(userToken<token*0.2){
        enqueueSnackbar('Token is not enough.', {
          variant: 'info',
          action: key => (
              <CloseIcon onClick={() => closeSnackbar(key)}/>
          )
        });
        history.push("/m/getoken");
        return false;
      } else {
        setIsLoading(true)
        const upToken = userToken - token*0.2;
        await API.graphql(graphqlOperation(mutations.updateUserC, {input:{id:userId, token : upToken}}));
        const data = {
          user:moderator,
          token:token*1,
          location:location,
          title:title,
          secure:value*1,
          capacity:capacity*1,
          description:description,
          type:type,
          status:1,
          image:pictureUrl,
          cdate:selectedDate,
          duration:duration
        }
        const event = await API.graphql(graphqlOperation(mutations.createEvents, {input: data}));
        const transData = {
          userid:userId,
          detail:'Post a new event "' + event.data.createEvents.title+'"',
          eventid: event.data.createEvents.id,
          amount:-token*0.2,
          date:new Date(),
          status:1
        }
        await API.graphql(graphqlOperation(mutations.createTransaction,{input:transData}));
        setIsLoading(false);
        history.push('/m/dashboard');
      }
    }
  };
  useEffect(()=>{
    const events = API.graphql(graphqlOperation(queries.listEventss));
    console.log(events);
  },[])
  useEffect(() => {
    const subscription = API
      .graphql(graphqlOperation(subscriptions.onCreateEvents))
      .subscribe({
        next: (event) => {
          console.log(event.value.data.onCreateEvents)
          // setEvents([...events, event.value.data.onCreateEvents]);
        }
      });
    return () => {
      subscription.unsubscribe();
    }
  }, [events]);
  async function handleChangeDuration(event){
    setDuration(event.target.value)
  }
  return (
    <Toolbar className={classes.toolbar} >
      <form className={classess.root} noValidate autoComplete="off" ref={wholePage}>
        <div className={classes.toppadding}></div> 
        <div className={classes.txtFiled}>
            <TextField
              onChange={titleSet}
              id="outlined-search"
              label="Event Title"
              variant="outlined"
            />
        </div>
        <div className={classes[titleRequired]}>
        * Please enter at least 3 characters
        </div>
        <div className={classes.txtFiled}>
          <Grid container x={12} spacing={3}>
            <Grid item sm={12} md={6} xs={12}>
              <TextField
                id="datetime-local"
                label="Start time"
                type="datetime-local"
                variant="outlined"
                defaultValue={new Date().toISOString()}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                style={{width:'100%'}}
                onChange={(event)=>{
                  const day = new Date(event.target.value);
                  setSelectedDate(day);
                }}
              />
            </Grid>
            <Grid item sm={12} md={6} xs={12}>
              <FormControl variant="outlined" className={classes.duration}>
                <InputLabel id="demo-simple-select-outlined-label">Event Duration</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={duration}
                  onChange={handleChangeDuration}
                  label="Event Duration"
                >
                  <MenuItem value={15}>15 minutes</MenuItem>
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={45}>45 minutes</MenuItem>
                  <MenuItem value={60}>1 hour</MenuItem>
                  <MenuItem value={90}>1 hour 30 min</MenuItem>
                  <MenuItem value={120}>2 hours</MenuItem>
                  <MenuItem value={180}>3 hours</MenuItem>
                  <MenuItem value={240}>4 hours</MenuItem>
                  <MenuItem value={300}>5 hours</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>
        <div className={classes.txtFiled}>
        <FormControl variant="outlined" className={classes.duration}>
          <InputLabel id="demo-simple-select-outlined-label">Event Type</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={type}
            label="Event Type"
            onChange={typeSet}
          >
            {favorTypes.map((item, index) => {
              return <MenuItem value={item} key={index}>{item}</MenuItem>
            })}
          </Select></FormControl>
        </div>
        <div className={classes[typeRequired]}>
        * Please enter at least 3 characters
        </div>
        <div className={classes.txtFiled}>
          <TextField
              onChange={descriptionSet}
              id="outlined-search"
              label="Event Description"
              multiline
              rows={4}
              variant="outlined"
            />
        </div>
        <div className={classes[textrequired]}>
        * Please enter at least 20 characters
        </div>

        {/* hidden items */}
        <div  className={classes[cart]}>
          <div className={classes[imageLetter]}>
            <div className = {classes.previews} onClick = {imageSelect} >
              <input type="file" id = "image_select" onChange = {handleImageChange} className = {classes.fileModal}/>
              <ImageSearchIcon fontSize = "large"/>
              <Typography variant="h6" color="primary" component="h2" style = {{textAlign:"center"}}>
                Drag and Drop Event image here
              </Typography>
            </div>
          </div>
          <div className = {classes[imageSection]}>
            <img src = {imageSource} className = {classes.image} onClick = {imageSelect}></img>
            <CancelIcon color = "primary" className = {classes.cancelImage} onClick={cancelImageSelect}/>
          </div>
        </div>
        <div className={classes[cart]}>
          <FormControl variant="outlined" className={classes.duration}>
            <InputLabel id="demo-simple-select-outlined-label">Location</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={location}
              label="Location"
              onChange={locationSet}
            >
              {venues.map((item, index) => {
                return <MenuItem value={item.address} className={classes.listItem} key={index}>{item.address}</MenuItem>
              })}
            </Select>
          </FormControl>
        </div>
        <div className={classes[locationrequired]}>
          * Please select address (Check your profile).
        </div>
        <div style = {{display:"flex", flexDirection:"row", width:"100%"}}>
          <div className={classes[twocart]}>
            <TextField
              onChange={capacitySet}
              id="outlined-search"
              label="Capacity"
              variant="outlined"
              type="number"
            />
          </div>
          <div className={classes[twocart]}>
            <TextField
              onChange={tokenSet}
              id="outlined-search"
              label="Minimun token"
              variant="outlined"
              type="number"
            />
          </div>
        </div>
        <div className={classes[capacityrequired]}>
          * Please enter value of capacity to Number.
        </div>
        <div className={classes[tokenrequired]}>
          * Please enter the minimum token value to Number.
        </div>
        <div className={classes[security]}>
        <BottomNavigation value={value} showLabels onChange={handleChange} className={classes.root}>
          <BottomNavigationAction label="Private" selected value="1" icon={<SecurityIcon />} />
          <BottomNavigationAction label="Public" value="2" icon={<PublicIcon />} />
        </BottomNavigation>
        </div>
        <div className={classes.bottompadding}  ref={wholePage}>
          <Button variant="contained"
            color="secondary"
            onClick={() => {
              test();
            }}
            className={classes.button}
            disabled={isLoading} 
            >
              {postbtn} {isLoading && <ButtonCircularProgress />}
          </Button>
        </div>
      </form>
    </Toolbar>
  );
}

SubscriptionInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  openAddBalanceDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(SubscriptionInfo);
