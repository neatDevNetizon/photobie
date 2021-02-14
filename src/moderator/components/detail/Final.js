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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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
};

function PostContent(props) {
  const [imageSrc, setImageSrc] = useState("")
  const [user, setUser] = useState("");
  const history = useHistory();
  const handle  = props.location.search;
  const id = new URLSearchParams(handle).get('event');
  const provider = new URLSearchParams(handle).get('provider');
  const proEmail = new URLSearchParams(handle).get("e");
  const [event, setEvent] = useState(id);
  const [providerId, setProviderId] = useState(provider);
  const [images, setImages] = useState([])
  const [ranking, setRanking]= useState([]);
  const [uptick, setUptick] = useState([]);
  const [final, setFinal] = useState("");
  const [totalToken, setTotalToken] = useState(0);
  const [userBsId, setUserBsId] = useState("")
  const [userCsToken,setUserCsToken] = useState(0);
  const [userBsToken,setUserBsToken] = useState(0);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 ,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 
    }
  };
  useEffect(() => {
    async function fetchUser() {
      const user =await Auth.currentUserInfo();
      if(!user){
        window.location.href = "/"
      } else if (user.attributes["custom:type"]){
      //  setUser(user.attributes.email);
       const cId = await API.graphql(graphqlOperation(queries.listUserCs, {filter:{email:{eq:user.attributes.email}}})).then((res)=>{
         setUser(res.data.listUserCs.items[0].id)
         setUserCsToken(res?.data?.listUserCs?.items[0]?.token)
       })
      }
      
      const eventlist = await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq:event}}}));
      const selEvent = eventlist.data.listEventss.items[0];
      setTotalToken(selEvent.upticktoken);
      await Storage.get(selEvent.image, { expires: 300 }).then(res=>{
        setImageSrc(res)
      })
     
      
    }
    async function fetchBids(){
      await API.graphql(graphqlOperation(queries.listProviderss, { filter: {id:{eq:providerId}}})).then(async(respnse)=>{
        const providers = respnse.data.listProviderss.items[0];

        var upticks = [];
        var clientsList = providers.clients;
        if(clientsList){
          upticks.push({"capacity":providers.capacity, "upticks":JSON.parse(clientsList).length});
        } else { upticks.push({"capacity":providers.capacity, "upticks": 0 })}

        setUptick(upticks)
        setFinal('"'+ providerId +'&' + proEmail + '"^_^'+ clientsList)
          
        var rankingArr = [];
        const ranking = await API
            .graphql(graphqlOperation(queries.listUserBs, { filter: {
              email: {eq:providers.provider} 
            }})).then((res)=>{
                var rankingStarNum = 0;
                const rankingNum = res.data.listUserBs.items[0].token*1;
                if(rankingNum==0) rankingStarNum = 0;
                else if(0<rankingNum&&rankingNum<100)rankingStarNum = 1;
                else if(100<=rankingNum&&rankingNum<1000)rankingStarNum = 2;
                else if(1000<=rankingNum&&rankingNum<3000)rankingStarNum = 3;
                else if(3000<=rankingNum&&rankingNum<10000)rankingStarNum = 4;
                else if(10000<=rankingNum)rankingStarNum = 5;
                rankingArr.push([rankingStarNum])
                setUserBsId(res.data.listUserBs.items[0].id)
                setUserBsToken(res.data.listUserBs.items[0].token)
            });
            setRanking(rankingArr)
            var imageObject = []
            var imageArray = providers.images.split(",");

            for(let j = 0; j<imageArray.length-1; j++){
            await Storage.get(imageArray[j], { expires: 300 }).then(res=>{
                imageObject.push(res);
            })
          }
          setImages(imageObject)
      })
    }
    fetchUser();
    fetchBids();
  }, []);
  

  async function handleFinish(){
    
    if(window.confirm("Will you finish this event?")){
      const tokenB = Math.floor(totalToken*0.8)+userBsToken*1;
      const tokenC = Math.floor(totalToken*0.2)+userCsToken*1;
      const updateEvent = await API.graphql(graphqlOperation(mutations.updateEvents, {input:{id:event, status:3, final:final}}));
      const updateProv = await API.graphql(graphqlOperation(mutations.updateProviders, {input:{id:providerId, status:3}}));

      const updateB = await API.graphql(graphqlOperation(mutations.updateUserB, {input:{id:userBsId, token : tokenB}}));
      const updateC = await API.graphql(graphqlOperation(mutations.updateUserC, {input:{id:user, token : tokenC}}));
      if(updateEvent && updateProv && updateB && updateC){
        history.push("/m/detail?id="+event);
      }

    }
  }
  const handleBack = async()=>{
    history.push("/m/detail?id="+event);
  }
  return (
    <div>
        
        <Paper  style = {{marginRight:"10vw", marginLeft:"10vw",marginTop:20,}}>
            
            <Typography variant="h5" align="center" >
                Finalizing Event With Provider
            </Typography>
            <div style = {{marginTop:-40}}>
                <IconButton color="secondary" aria-label="add an alarm" onClick = {handleBack}>
                    <ArrowBackIcon/>
                </IconButton>
            </div>
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
                {images.map((imageUrl, i)=>{
                    return <div key = {i}>
                        <img src={imageUrl}  style = {{width:"100%", height:500, objectFit:"cover"}} />
                    </div>
                    }
                )}
            </Carousel>
            <Grid container spacing={3} style = {{marginTop:10, padding:10,}}>
                <Grid item xs={12} md = {9}>
                    <div style = {{display:"flex", flexDirection:"row",}}>
                        <Avatar alt="Remy Sharp" src="/images/logged_in/image4.jpg" style = {styles.avatar}/>
                        <div style = {{flexDirection:"column", display:"flex", marginTop:5,marginLeft:10}}>
                            <Typography variant="body2">
                                {proEmail}
                            </Typography> 
                            {ranking.map((item, index)=>{
                                return <Rating
                                name="customized-empty"
                                defaultValue={item}
                                precision={0.1}
                                key = {index}
                                size="large"
                                readOnly 
                                // style = {{marginTop:30,marginLeft:20}}
                                />
                            })}
                            
                        </div>
                    
                  </div>
                </Grid>
                <Grid item xs = {12} md = {3}>
                  {uptick.map((item, index)=>{
                    return <div>
                      <Typography variant="body2" >
                      Upticks : {item.upticks}
                    </Typography>
                    <Box display="flex" alignItem="center" marginLeft = {1}>
                      <Box width="90%" mr={1}>
                        <LinearProgress variant="determinate" value = {item.upticks/item.capacity*100} />
                      </Box>
                      <Box minWidth={35}>
                        <Typography variant="body2" color="textSecondary">{Number(item.upticks/item.capacity*100).toFixed(2)}%</Typography>
                      </Box>
                    </Box>
                    </div>
                  })}
                  
                </Grid>
            </Grid>
            <div style = {{display:"flex", justifyContent:"flex-end", paddingBottom:10, marginRight:10}}>
                <Button variant="contained" color="secondary" onClick = {handleFinish}>
                Finish with &nbsp;<span style = {{color:"#15d635",textTransform: "initial"}}> {proEmail}</span>
                </Button>
            </div>

        </Paper>
        
      
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
