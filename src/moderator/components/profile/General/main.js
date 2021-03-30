
import React, {useState,useEffect,useMemo} from 'react';
// import Badge from '@material-ui/core/Badge';
// import Avatar from '@material-ui/core/Avatar';
import AvatarEdit from 'react-avatar-edit';
import EditIcon from '@material-ui/icons/Edit';
import Amplify, {API, graphqlOperation, Auth, Storage } from "aws-amplify";
import FormDialog from "../FormDialog";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ButtonCircularProgress from "../../../../shared/components/ButtonCircularProgress";
import * as queries from '../../../../graphql/queries';
import * as mutations from '../../../../graphql/mutations';
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
  Typography,
  Hidden,
  Drawer,
  Card,
  CardContent,
} from "@material-ui/core";
import countryList from 'react-select-country-list';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTodoAction } from '../../../../actions/addTodoAction';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    flexDirection:"column",
    alignItems:"center",
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop:30,
  },
  previewImage:{
    width:150,
    height:150,
    borderRadius:150,
    
  },
  avatarContainer:{
    display:"flex",
    flexDirection:"column",
    cursor:"pointer",
    alignItems: 'center'
  },
  editButton:{
    backgroundColor:"#44b700",
    borderRadius:20,
    width:30,
    height:30,
    marginTop:-30,
    marginLeft:"127%",
    alignItems:"center",
    textAlign:"center"
  },
  endFloat:{
    zIndex:10,
  },
  avatarImageSelecter:{
    
  },
  selecterContainer:{
  
  },
  chip:{
    margin:2,
  },
  chips:{
    whiteSpace:"normal"
  },
  main: {
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
        marginLeft: 0,
    },
    [theme.breakpoints.up("sm")]: {
        marginLeft: 200,
    },
  },
  avatarCard: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#eaffe7'
  }
}));

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
  const [personName, setPersonName] = React.useState([]);
  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [zipCode, setZipCode] = useState();
  const [cityName, setCityName] = useState("")
  const [countryName, setCountryName] = useState("US");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [current, setCurrent] = useState();
  const [onhold, setOnhold] = useState();
  const [past, setPast] = useState();
  const [typeList, setTypeList] = useState([]);

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
        await API.graphql(graphqlOperation(queries.listEventTypes)).then((res)=>{
          const typeData = res.data.listEventTypes.items;
          let newArr = [];
          for(let i=0; i<typeData.length; i++){
            newArr.push({
              id: typeData[i].id,
              name: typeData[i].typename
            })
          }
          setTypeList(newArr);
        })
        const userToken = await API.graphql(graphqlOperation(queries.listUserCs, {filter:{email:{eq:email}}}))
        setCurrent(userToken.data.listUserCs?.items[0]?.token);
        const userId = userToken.data.listUserCs?.items[0]?.id;

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
        if(userData.favortype)setPersonName(userData.favortype.split(","));
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
    return {
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
    console.log(event.target.value);
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
              <AvatarEdit
                width={390}
                height={295}
                onCrop={onCrop}
                onClose={onClose}
                onBeforeFileLoad={onBeforeFileLoad}
                src={src}
                width = {550}
                className = {classes.avatarImageSelecter}
              /> 
            }
            onClose = {handleModalClose}
          />
        </div>
        <Grid container xs={12} spacing={3}>
          <Grid item xs = {12} md={4} style={{textAlign: 'center'}}>
            <Card className={classes.avatarCard} variant="outlined">
              <CardContent>
                <div className = {classes.avatarContainer} >
                  <Avatar
                    alt={userEmail}
                    src={preview}
                    className={classes.previewImage}
                  />
                  <div className = {classes.endFloat} onClick = {editAvatar}>
                    <div className = {classes.editButton}>
                      <EditIcon/>
                    </div>
                  </div>
                </div>
                <div style={{marginTop: 20}}>
                  <Typography variant="body2" color="textSecondary">
                    CURRENT : {current?current/100:0} &nbsp;(USD)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ON HOLD : {onhold?onhold/100:0} &nbsp;(USD)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    PAST : {past?past/100:0} &nbsp;(USD)
                  </Typography>
                </div>
              </CardContent>
            </Card>
            
          </Grid>
          <Grid item xs = {12} md={8}>
            <Card className={classes.avatarCard} variant="outlined">
              <CardContent>
                <Grid container xs = {12} style = {{justifyContent:"center", textAlign: 'center'}}>
                  <Grid item xs={12} md={12} sm = {12}>
                    <TextField
                      variant="outlined"
                      margin="none"
                      required
                      label="Your Full Name"
                      value={profileName}
                      onChange={event => {
                        setProfileName(event.target.value);
                      }}
                      style = {{width:"80%", maxWidth: 400}}
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
                        style={{whiteSpace:"none", minWidth:220}}
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
                        {typeList.map((list, index) => (
                          <MenuItem key={list.id} name = {list.id} value={list.name} style={getStyles(list.name, personName, theme)}>
                            {list.name}
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
                          style = {{marginTop:20, width: '80%'}}
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
                          style = {{marginTop:20, width: '80%'}}
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
                  <div style={{marginTop: 20}}>
                    <Button variant="contained" color="secondary" disabled={loading} onClick = {saveAvatar}>
                      Save Change {loading && <ButtonCircularProgress />}
                    </Button>
                  </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
