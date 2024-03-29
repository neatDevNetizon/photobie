import React, { useState, useCallback,useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
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
  IconButton,
  Card,
} from "@material-ui/core";
import * as queries from '../../../graphql/queries';
import * as mutations from '../../../graphql/mutations';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
// import Carousels from "./Carousel"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import CheckIcon from '@material-ui/icons/Check';
import LinearProgress from '@material-ui/core/LinearProgress';


const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between",
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
    paddingLeft:20
  }
};
const useStyles = makeStyles((theme) => ({
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
function PostContent(props) {
  const history = useHistory();
  const classes = useStyles();
  const [imageSrc, setImageSrc] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("");
  const [providers, setProviders] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [user, setUser] = useState("");
  const [awardFlag, setAwardFlag] = useState(null)
  const [images, setImages] = useState([])
  const [ranking, setRanking]= useState([]);
  const [uptick, setUptick] = useState([]);
  const [proEmail,setProEmail] = useState("");
  const [proId, setProId] = useState("");
  const [duration, setDuration] = useState("");
  useEffect(() => {
    
    async function fetchUser() {
      const user =await Auth.currentUserInfo();
      if(!user){
        window.location.href = "/"
      } else if (user.attributes["custom:type"]){
       setUser(user.attributes.email)
      }
      
      const eventlist = await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq:props.id}}}));
      const selEvent = eventlist.data.listEventss.items[0];
      await Storage.get(selEvent.image, { expires: 300 }).then(res=>{
        setImageSrc(res)
        setTitle(selEvent.title);
        setLocation(selEvent.location);
        setDescription(selEvent.description);
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
        setDuration(fromDate + " ~ " + toDates)
      })
     
      
    }
    async function fetchBids(){
      await API.graphql(graphqlOperation(queries.listProviderss, { filter: {eventid:{eq:props.id}}})).then(async(respnse)=>{
        const providers = respnse.data.listProviderss.items;

        var providerArray = [];
        for(let i = 0; i<providers.length;i++){
          var upticks = null;
          var clientsList = providers[i].clients;
          
          if(clientsList){
            upticks = JSON.parse(clientsList).length;
          } else { upticks = 0;}

          const ranking = await API
            .graphql(graphqlOperation(queries.listUserBs, { filter: {
              email: {eq:providers[i].provider} 
            }}));
          var rankingStarNum = 0;
          if(ranking.data.listUserBs.items.length){
            const rankingNum = ranking.data.listUserBs.items[0].token*1;
            if(rankingNum==0) rankingStarNum = 0;
            else if(0<rankingNum&&rankingNum<100)rankingStarNum = 1;
            else if(100<=rankingNum&&rankingNum<1000)rankingStarNum = 2;
            else if(1000<=rankingNum&&rankingNum<3000)rankingStarNum = 3;
            else if(3000<=rankingNum&&rankingNum<10000)rankingStarNum = 4;
            else if(10000<=rankingNum)rankingStarNum = 5;
          }

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
            ranking:rankingStarNum,
            providerId:providers[i].id,
            upticks: upticks,
            provEmail:providers[i].provider,
          })
          
        }
        setProviders(providerArray)
      })
    }
    fetchEvent();
    async function fetchEvent(){
      await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq:props.id}}})).then(async(response)=>{
        const eStatus = response.data.listEventss.items[0].status;
        if(eStatus == 1){
          fetchUser();
          fetchBids();
          setAwardFlag(1)
        } 
        else if(eStatus == 2) {
          setAwardFlag(2)
          fetchUser();
          const eFinal = response.data.listEventss.items[0].final;
          const finalData = eFinal.slice(1,eFinal.indexOf("&"))
          fetchFinal(finalData);
        }
        else {
          setAwardFlag(3)
          fetchUser();
          const eFinal = response.data.listEventss.items[0].final;
          const finalData = eFinal.slice(1,eFinal.indexOf("&"))
          fetchFinal(finalData);
        }
      })
    }
    async function fetchFinal(finalData){
      await API.graphql(graphqlOperation(queries.listProviderss, { filter: {id:{eq:finalData}}})).then(async(respnse)=>{
        const providers = respnse.data.listProviderss.items;
        var providerArray = [];
        for(let i = 0; i<providers.length;i++){
          var upticks = null;
          var clientsList = providers[i].clients;
          
          if(clientsList){
            upticks = JSON.parse(clientsList).length;
          } else { upticks = 0;}

          const ranking = await API
            .graphql(graphqlOperation(queries.listUserBs, { filter: {
              email: {eq:providers[i].provider} 
            }}));
          var rankingStarNum = 0;
          if(ranking.data.listUserBs.items.length){
            const rankingNum = ranking.data.listUserBs.items[0].token*1;
            if(rankingNum==0) rankingStarNum = 0;
            else if(0<rankingNum&&rankingNum<100)rankingStarNum = 1;
            else if(100<=rankingNum&&rankingNum<1000)rankingStarNum = 2;
            else if(1000<=rankingNum&&rankingNum<3000)rankingStarNum = 3;
            else if(3000<=rankingNum&&rankingNum<10000)rankingStarNum = 4;
            else if(10000<=rankingNum)rankingStarNum = 5;
          }

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
            ranking:rankingStarNum,
            providerId:providers[i].id,
            upticks: upticks,
            provEmail:providers[i].provider,
          })
          
        }
        setProviders(providerArray)
      })
    }
    
  }, []);
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

  async function preFinish(provider, pEmail){
    console.log(props.id, provider, pEmail)
    history.push("/m/finalize?event="+props.id+"&provider="+provider+"&e="+pEmail)
  }
  return (
    <div>
      <Paper>
        <img src = {imageSrc} style = {{width:"100%", marginTop:-30, height:500,objectFit:"cover"}} alt = ""></img>
      </Paper>
      <Grid container spacing={1} style = {{width:"80%",marginTop:30,marginRight:"auto", marginLeft:"auto"}}>
        {/* <Grid item xs = {12} md={3} >
          <Typography>Details</Typography>
        </Grid> */}
        <Grid item xs = {12} md={9} >
          <Typography>{title}</Typography>
          <Typography>{location}</Typography>
          <Typography>Duration : {duration}</Typography>
          <Typography>{description}</Typography>
        </Grid>
        <Grid item xs={12} >
          <Typography variant="h4" align="center" >
            {awardFlag==1?"Provider's bid":awardFlag==2?"Awarded Provider":""}
          </Typography>
        </Grid>
        {awardFlag === 1?<Grid item xs = {12} md = {12}>
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
                <Grid item xs = {12} md = {6}  onClick = {()=>preFinish(items.providerId, items.provEmail)}>
                  <div style = {styles.avatarDiv}>
                    <Avatar alt="Remy Sharp" src="/images/logged_in/image4.jpg" style = {styles.avatar}/>
                    <Rating
                      name="customized-empty"
                      defaultValue={items.ranking}
                      precision={0.1}
                      size="large"
                      readOnly 
                      style = {{marginTop:30,marginLeft:20}}
                    />
                  </div>
                  <Grid container spacing = {3} style = {styles.otherPadding}>
                    
                    <Grid item xs = {12} md = {4}>
                      <Typography variant="body2" >
                        Capacity : {items.capacity}
                      </Typography>
                    </Grid>
                  </Grid>
                   {items.description.length > 300 ? <Typography variant="body2" style ={{paddingLeft:20}}>{items.description.slice(0, 400)+"..."}<ExpandMoreIcon style = {{float:"right", marginRight:20}}/></Typography>:<Typography variant="body2" style ={{paddingLeft:20}}>{items.description}</Typography>}
                </Grid>
                <Grid item xs = {12} md = {3} style = {styles.uptickPadding}>
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
              
            </Card>
          })}
        </Grid>:awardFlag==2?<Grid item xs = {12} md = {12}>
          {providers.map((items, index)=>{
            return <Card key = {index} className = {classes.cardGrid}>
              <Grid container spacing = {1}>
                <Grid item xs = {12} md = {4}>
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
                <Grid item xs = {12} md = {6}  onClick = {()=>preFinish(items.providerId, items.provEmail)}>
                  <div style = {styles.avatarDiv}>
                    <Avatar alt="Remy Sharp" src="/images/logged_in/image4.jpg" style = {styles.avatar}/>
                    <Rating
                      name="customized-empty"
                      defaultValue={items.ranking}
                      precision={0.1}
                      size="large"
                      readOnly 
                      style = {{marginTop:30,marginLeft:20}}
                    />
                  </div>
                  <Grid container spacing = {3} style = {styles.otherPadding}>
                    
                    <Grid item xs = {12} md = {4}>
                      <Typography variant="body2" >
                        Capacity : {items.capacity}
                      </Typography>
                    </Grid>
                  </Grid>
                   {items.description.length > 300 ? <Typography variant="body2" style ={{paddingLeft:20}}>{items.description.slice(0, 400)+"..."}<ExpandMoreIcon style = {{float:"right", marginRight:20}}/></Typography>:<Typography variant="body2" style ={{paddingLeft:20}}>{items.description}</Typography>}
                </Grid>
                <Grid item xs = {12} md = {2} style = {styles.uptickPadding}>
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
              
            </Card>
          })}
        </Grid>:awardFlag==3?<Grid item xs = {12} md = {12}>
          {providers.map((items, index)=>{
            return <Card key = {index} style = {{marginTop:20}}>
              <Grid container spacing = {1}>
                <Grid item xs = {12} md = {4}>
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
                <Grid item xs = {12} md = {6}>
                  <div style = {styles.avatarDiv}>
                    <Avatar alt="Remy Sharp" src="/images/logged_in/image4.jpg" style = {styles.avatar}/>
                    <Rating
                      name="customized-empty"
                      defaultValue={items.ranking}
                      precision={0.1}
                      size="large"
                      readOnly 
                      style = {{marginTop:30,marginLeft:20}}
                    />
                  </div>
                  <Grid container spacing = {3} style = {styles.otherPadding}>
                    
                    <Grid item xs = {12} md = {4}>
                      <Typography variant="body2" >
                        Capacity : {items.capacity}
                      </Typography>
                    </Grid>
                  </Grid>
                   {items.description.length > 300 ? <Typography variant="body2" style ={{paddingLeft:20}}>{items.description.slice(0, 400)+"..."}<ExpandMoreIcon style = {{float:"right", marginRight:20}}/></Typography>:<Typography variant="body2" style ={{paddingLeft:20}}>{items.description}</Typography>}
                </Grid>
                <Grid item xs = {12} md = {2} style = {styles.uptickPadding}>
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
              
            </Card>
          })}
        </Grid>:null}
        
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
