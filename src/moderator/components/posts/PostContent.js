import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  TablePagination,
  Divider,
  Toolbar,
  Typography,
  Button,
  Paper,
  Box,
  withStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from "react-router-dom";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

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
}));
function PostContent(props) {
  const { classes, openAddBalanceDialog } = props;
  const [bidText, setBidText] = useState(['']);
  const [textrequired, setTextrequired] = useState(['txtrequiredHidden']);
  const [imageSrc, setImageSrc] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [user, setUser] = useState("");
  const [file, setFile] = useState([]);
  const [toUpload, setToUpload] = useState([]);
  const [proLocation, setProLocation] = useState('');
  const [proCapacity, setProCapacity] = useState('');
  const [proToken, setProToken] = useState('');
  const [plusFade, setPlusFade] = useState("showPlus")
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchUser() {
      const eventlist = await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq:props.id}}}));
      const selEvent = eventlist.data.listEventss.items[0];
      await Storage.get(selEvent.image, { expires: 300 }).then(res=>{
        setImageSrc(res)
        setTitle(selEvent.title);
        setLocation(selEvent.location);
        setDescription(selEvent.description);
      })
      
    }
    async function fetchData() {
      const user =await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      } else {
        setUser(user.attributes.email)
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
      if(file.length==7) setPlusFade("hidePlus")
    } 
    return ;
    
  }

  async function upload(e) {
    e.preventDefault();
    setIsLoading(true);
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
    var data = {}
    if(e){
      data = {
        provider:user,
        eventid:props.id,
        description:bidText,
        token:proToken,
        location:proLocation,
        images:e,
      }
    } else{
      data = {
        provider:user,
        eventid:props.id,
        description:bidText,
        token:proToken,
        location:proLocation,
        images:""
      }
    }
    await API.graphql(graphqlOperation(mutations.createProviders, {input: data}));
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
  function handleLocation(e){
    setProLocation(e.target.value)
  }
  function handleCapacity(e){
    setProCapacity(e.target.value)
  }
  function handlePlusImage(){
    document.getElementById("fileForm").click()
  }
  return (
    <div>
      <Paper>
        <img src = {imageSrc} style = {{width:"100%", marginTop:-50, height:400,objectFit:"cover"}}></img>
      </Paper>
      <Grid container spacing={3} style = {{width:"70%",marginTop:30,marginRight:"auto", marginLeft:"auto"}}>
        <Grid item xs = {12} md={4} >
        <Typography>Details</Typography>
        </Grid>
        <Grid item xs = {12} md={8} >
        <Typography>{title}</Typography>
        <Typography>{location}</Typography>
        <Typography>{description}</Typography>
        
        </Grid>
        <Grid container spacing = {3} >
          <Grid item xs = {12} md={3} >
             <TextField id="outlined-search" label="Token" type="number" variant="outlined" onChange = {handleToken} />
          </Grid>
          <Grid item xs = {12} md={6} >
             <TextField id="outlined-search" label="Location" type="text" variant="outlined" onChange = {handleLocation} style = {{width:"100%"}} />
          </Grid>
        </Grid>

        <Grid container spacing = {3} style = {{marginTop:20}}>
          <Grid item xs = {12} md = {12}>
              <Grid container >
              {file.length > 0 &&
                file.map((item, index) => {
                  return (
                    <Grid key = {item} xs = {12} md = {3} style = {styles.imageBody}>
                      <img src={item} alt="" style = {styles.images} />
                      <CancelIcon onClick={() => deleteFile(index)} style = {styles.canelIcon}/>
                    </Grid>
                  );
                })}
                <Grid  xs = {12} md = {3} className={classes[plusFade]}>
                  <div style = {styles.imageBody}>
                    <img alt="+" src = "/images/image-plus.png" style = {styles.imagePlus} onClick = {handlePlusImage}/>
                  </div>
                </Grid>
                
              </Grid>
              

            <div className="form-group">
              <input 
                id = "fileForm"
                type="file"
                disabled={file.length === 8}
                className="form-control"
                style = {{display:"none"}}
                onChange={uploadSingleFile}
              />
            </div>
              {/* <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={upload}
              >
                Upload
              </button> */}
          </Grid>
        </Grid>
        <Typography variant="h3" align="center" >
          
        </Typography>
        <div style = {{width:"100%"}}>
          <TextField
              onChange={descriptionSet}
              id="filled-full-width"
              label="Describe your proposal"
              style={{ margin: 8 }}
              fullWidth
              multiline
              rows = {4}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
        </div>
        <div style = {{width:"100%", }}>
          <Button variant="contained" color="secondary" disabled={isLoading} style = {{float:"right"}} onClick = {upload}>
            Place bid {isLoading && <ButtonCircularProgress />}
          </Button>
        </div>
        
      </Grid>
      
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
