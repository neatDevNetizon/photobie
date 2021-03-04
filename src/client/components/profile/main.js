
import React, {useState,useEffect,useMemo} from 'react';
// import Badge from '@material-ui/core/Badge';
// import Avatar from '@material-ui/core/Avatar';
import AvatarEdit from 'react-avatar-edit';
import EditIcon from '@material-ui/icons/Edit';
import Amplify, {API, graphqlOperation, Auth, Storage } from "aws-amplify";
import FormDialog from "./FormDialog";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import { TextField,
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  Chip,
  Grid,
  Button,
  Avatar,
  Drawer,
  Typography,
} from "@material-ui/core";
import countryList from 'react-select-country-list';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTodoAction } from '../../../actions/addTodoAction';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    flexDirection:"column",
    alignItems:"center"
  },
  formControl: {
    margin: theme.spacing(1),
    // minWidth: ,
    marginTop:30,
    width:"80%"
  },
  previewImage:{
    width:150,
    height:150,
    borderRadius:150,
    
  },
  avatarContainer:{
    display:"flex",
    flexDirection:"column",
    cursor:"pointer"
  },
  editButton:{
    backgroundColor:"#44b700",
    borderRadius:20,
    width:30,
    height:30,
    marginTop:-30,
    marginLeft:"70%",
    alignItems:"center",
    textAlign:"center"
  },
  endFloat:{
    width:"100%",
    zIndex:10,
  },
  avatarImageSelecter:{
    
    overflowX:"scroll",
  },
  selecterContainer:{
   maxWidth:"-webkit-fill-available"
   
  },
  chip:{
    margin:2,
  },
  chips:{
    whiteSpace:"normal"
  }
}));
const names = [
  'Event Birthday',
  'Event Wedding',
  'Event Night',
  'Event Shopping',
  'Event Meeting',
  'Event Dinner',
  'Event Friends',
  'Event Dissert',
  'Event Holiday',
  'Event Sunday',
];



function BadgeAvatars(props) {

  const countries = countryList().getData();
  const [listCountry, setListCountry] = useState(countries);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [src, setSrc] = useState("");
  const [preview, setPreview] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [open, setOpen] = useState(false)
  const [profileName, setProfileName] = useState("")
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [zipCode, setZipCode] = useState();
  const [cityName, setCityName] = useState("")
  const [countryName, setCountryName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [current, setCurrent] = useState();
  const [onhold, setOnhold] = useState();
  const [past, setPast] = useState();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(()=>{
    console.log(props)
    async function fetchUser(){
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else{
        const email = user.attributes.email;
        setUserEmail(email);
        const userToken = await API.graphql(graphqlOperation(queries.listUserAs, {filter:{email:{eq:email}}}))
        setCurrent(userToken.data.listUserAs?.items[0]?.token);
        const userId = userToken.data.listUserAs?.items[0]?.id;

        const userTrans = await API.graphql(graphqlOperation(queries.listTransactions,{filter:{userid:{eq:userId}}}));
        const transdata = userTrans.data.listTransactions?.items;
        console.log(transdata)

        var onholdValue=0;
        var pastValue=0;
        for(let i in transdata){
          if(transdata[i].status===1) onholdValue += transdata[i].amount;
          else if(transdata[i].status===2)  pastValue += transdata[i].amount;
        }
        setOnhold(Math.abs(onholdValue)); 
        setPast(Math.abs(pastValue))

        const userProfile = await API.graphql(graphqlOperation(queries.listUserss, { filter: {email:{eq:email}}}));
        const userData = userProfile.data.listUserss.items[0];
        
        setUserId(userData.id);
        setCountryName(userData.country);
        setProfileName(userData.name);
        setZipCode(userData.zipcode);
        setCityName(userData.city);
        if(userData.favortype)setPersonName(userData?.favortype?.split(","));
        setAvatarUrl(userData.photo)
        await Storage.get(userData.photo, { expires: 300 }).then(res=>{
          setPreview(res);
        })
      }
      return ;
    }
    fetchUser();
  },[])


  const changeHandler = value => {
    setValue(value)
  }
  function getStyles(name, personName, theme) {
    if(!personName) return ;
    return {
      // whiteSpace:"none",
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const handleChange = (event) => {
    if(event.target.value.length>5){
      return false;
    }
    setPersonName(event.target.value);
  };
  function onClose(){
    setPreview(null)
  }
  function onCrop(preview){
    setPreview(preview)
    var arr = preview.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
          
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      setNewAvatar(new File([u8arr], "fedf.png", {type:mime}));
  }
   
  function onBeforeFileLoad(elem){
    if(elem.target.files[0].size > 10271680){
      alert("File is too big!");
      elem.target.value = "";
    };
  }
  async function saveAvatar(){
    setLoading(true)
    var avatar = avatarUrl;
    if(newAvatar){
      const d = new Date();
      const imgurl = d.getTime();
      const imageUrl = imgurl+".png";
      await Storage.put(imageUrl, newAvatar, {
        contentType: 'image/png',
        level: 'public'
      }).then((res)=>{console.log(res)});
      setAvatarUrl(imageUrl);
      avatar = imageUrl;
    }
    setNewAvatar(null)
    await API.graphql(graphqlOperation(mutations.updateUsers,  {input:
      {
        id:userId, 
        name:profileName, 
        photo:avatar, 
        zipcode:zipCode,
        favortype : personName.toString(),
        city : cityName,
        country : countryName,
      }})).then((res)=>{
       
    })
    setLoading(false);
    await Storage.get(avatar, { expires: 300 }).then(res=>{
      props.addTodo(res);
    })
    
  }
  const editAvatar = () =>{
    setOpen(true)
  }
  const handleModalClose = () =>{
    setOpen(false)
  }
  return (
      <div className={classes.root}>
      
        <div style = {{position:"absolute", bottom:1}}>
          <FormDialog
            open={open}
            className = {classes.selecterContainer}
            content={
              <Grid container xs = {12}>
                <AvatarEdit
                width={390}
                height={260}
                onCrop={onCrop}
                onClose={onClose}
                onBeforeFileLoad={onBeforeFileLoad}
                src={src}

                className = {classes.avatarImageSelecter}
              />
              </Grid>
               
            }
            onClose = {handleModalClose}
          />
        </div>
        <div className = {classes.avatarContainer} >

          <Avatar
            alt="profile picture"
            src={preview}
            className={classes.previewImage}
          />
         
          <div className = {classes.endFloat} onClick = {editAvatar}>
            <div className = {classes.editButton}>
              <EditIcon/>
            </div>
          </div>
        </div>
        <Typography variant="body2" color="textSecondary">
        CURRENT : {current?current/100:0}&nbsp;&nbsp;ON HOLD : {onhold?onhold/100:0}&nbsp;&nbsp;PAST : {past?past/100:0} &nbsp;(USD)
        </Typography>
        <Grid container xs = {12} style = {{textAlign:"center"}}>
          <Grid item xs={1} md={3} sm = {2} ></Grid>
          <Grid item xs={10} md={6} sm = {8}>
            <TextField
              variant="outlined"
              margin="none"
              required
              label="Your Full Name"
              value={profileName}
              onChange={event => {
                setProfileName(event.target.value);
              }}
              style = {{width:"80%"}}
              // autoFocus
              autoComplete="off"
              type="text"
            />

            <FormControl className={classes.formControl} variant="outlined" >
              <InputLabel htmlFor="outlined-age-native-simple" id="demo-mutiple-chip-label">Favourite Event Types</InputLabel>
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                // style = {{minWidth:300, }}
                style={{whiteSpace:"none"}}
                value={personName}
                size = {5}
                onChange={handleChange}
                input={<Input id="select-multiple-chip"  />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip key={value}  label={value} className={classes.chip} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {names.map((name, index) => (
                  <MenuItem key={name} name = {name} value={name} style={getStyles(name, personName, theme)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            
            <Grid container xs = {12} style = {{textAlign:"center", marginTop:10}}>
              <Grid item xs = {12} sm = {6}>
                <TextField
                  variant="outlined"
                  margin="none"
                  required
                  label="City Name"
                  autoComplete="off"
                  type="text"
                  value = {cityName}
                  style = {{marginTop:20,}}
                  onChange={event => {
                    setCityName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs = {12} sm = {6}>
                <TextField
                  id="outlined-number"
                  label="Zipcode"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value ={zipCode}
                  style = {{marginTop:20,}}
                  onChange={event => {
                    setZipCode(event.target.value);
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">Country Name</InputLabel>
              <Select
                native
                label="Country Name"
                value = {countryName}
                style = {{height:50, backgroundColor:"none", }}
                inputProps={{
                    name: 'Country Name',
                    id: 'outlined-age-native-simple',
                }}
                onChange={event => {
                  setCountryName(event.target.value);
                }}
                >
                {listCountry.map((item, index)=>{
                    return <option key = {index} value={item.value}>{item.label}</option>
                })}
            </Select>
          </FormControl>
          </Grid>
              <Grid item xs={1} md={3} sm = {2}></Grid>
          </Grid>
        <Button variant="contained" color="secondary" style = {{marginTop:30}} disabled={loading} onClick = {saveAvatar}>
          Save Change {loading && <ButtonCircularProgress />}
        </Button>
      </div>
  );
}
const mapStateToProps = () => state => {
  return {
      items: state.userEmail
  };
};
const mapDistachToProps = () => dispatch => {
  return bindActionCreators({ addTodo: addTodoAction }, dispatch);
};
export default connect(mapStateToProps, mapDistachToProps)(BadgeAvatars);
