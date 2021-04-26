import React, { useState, useCallback,useEffect } from "react";
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
import {useHistory} from "react-router-dom";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import { CellWifi } from "@material-ui/icons";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

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
  // buttonSec: {
  //   display: 'flex',
  //   padding: 20,
  //   justifyContent: 'flex-end'
  // }
};

function PostContent(props) {
  const [imageSrc, setImageSrc] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("");
  const [providers, setProviders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [rankingStar, setRankingStar] = useState(0);
  const [userToken, setUserToken] = useState("");
  const [onDisable, setOnDisable] = useState(false);
  const [checked, setChecked] = useState("primary");
  const [uptickState, setUptickStatus] = useState("Uptick");
  const [user, setUser] = useState("");
  const [eventCapacity, setEventCapacity] = useState(null);
  const [userId, setUserId] = useState("");
  const [uptickedToken, setUptickedToken] = useState(0)
  const [awardFlag, setAwardFlag] = useState(null)
  const [images, setImages] = useState([])
  const [ranking, setRanking]= useState([]);
  const [uptick, setUptick] = useState([]);
  const [proEmail,setProEmail] = useState("");
  const [eventTitle, setEventTitle] = useState('');
  const [upticking, setUpticking] = useState([]);
  const [canceling, setCanceling] = useState([]);
  const [duration, setDuration] = useState('');
  const [eventStart, setEventStart] = useState(0);
  const [mapCenter, setMapCenter] = useState([]);
  const [mapZoom, setMapZoom] = useState(5)


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    
  };
  const history = useHistory();
  useEffect(() => {
    async function fetchUser(a,b) {
      const user =await Auth.currentUserInfo();
      if(!user){
        window.location.href = "/"
      } else if (user.attributes["custom:type"]){
       var userEmail = user.attributes.email;
       setUser(userEmail)
      }
      // setUser(user.data.listUserAs.items[0].email);

      const userToken = await API.graphql(graphqlOperation(queries.listUserAs, { filter: {email:{eq:user.attributes.email}}}));
      setUserToken(userToken.data.listUserAs.items[0].token);
      setUserId(userToken.data.listUserAs.items[0].id)
      
      const eventlist = await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq:props.id}}}));
      const selEvent = eventlist.data.listEventss.items[0];

      const encodedAddress = encodeURI(selEvent.location)
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyCej2vLb-XXyKoWeMzdAUynqZbq0YVmWi0`, {
          "method": "GET"
      })
      .then(response => response.json())
      .then(response => {
        console.log(response.results[0].geometry.location.lat)
          setMapCenter({
          lat: response.results[0].geometry.location.lat,
          lng: response.results[0].geometry.location.lng
          });
          setMapZoom(12);
      })
      .catch(err => console.log(err));

      await Storage.get(selEvent.image, { expires: 300 }).then(res=>{
        setImageSrc(res)
        setTitle(selEvent.title);
        setLocation(selEvent.location);
        setDescription(selEvent.description);
      });
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
      if(a===1)fetchBids(userEmail);
      else fetchFinal(b);
    }
    async function fetchBids(userEmail){
      await API.graphql(graphqlOperation(queries.listProviderss, { filter: {eventid:{eq:props.id}}})).then(async(respnse)=>{
        const providers = respnse.data.listProviderss.items;
        
        var providerArray = [];
        for(let i = 0; i<providers.length;i++){
          var uptickStatus = null;
          var clientsList = providers[i].clients;
          
          if(clientsList){
            if(JSON.parse(clientsList).length>=providers[i].capacity && clientsList.indexOf(userEmail)<0){
              uptickStatus = 3;
            }
            else if(clientsList.indexOf(userEmail)>=0){
              uptickStatus = 2;
            }
            else uptickStatus = 1;
          } else { uptickStatus = 1;}
          const ranking = await API
            .graphql(graphqlOperation(queries.listUserBs, { filter: {
              email: {eq:providers[i].provider} 
            }}));
          var rankingStarNum = 0;
          if(ranking.data.listUserBs.items.length){
            const rankingNum = ranking.data?.listUserBs?.items[0]?.token*1;
            if(rankingNum === 0 || rankingNum === null) rankingStarNum = 0;
            else if(0<rankingNum&&rankingNum<100)rankingStarNum = 1;
            else if(100<=rankingNum&&rankingNum<1000)rankingStarNum = 2;
            else if(1000<=rankingNum&&rankingNum<3000)rankingStarNum = 3;
            else if(3000<=rankingNum&&rankingNum<10000)rankingStarNum = 4;
            else if(10000<=rankingNum)rankingStarNum = 5;
          }

          var imageObject = []
          var imageArray = providers[i].images.split(",");

          for(let j = 0; j<imageArray.length-1; j++){
            await Storage.get(imageArray[j], { expires: 300 }).then(res => {
              imageObject.push(res);
            })
          }
          providerArray.push({
            capacity:providers[i].capacity,
            token:providers[i].token,
            description:providers[i].description,
            // location:providers[i].location,
            images: imageObject,
            ranking:rankingStarNum,
            providerId:providers[i].id,
            uptick:uptickStatus,
          })
          
        }
        setProviders(providerArray)
      })
    }
    fetchEvent();
    async function fetchEvent(){
      await API.graphql(graphqlOperation(queries.listEventss, { filter: {id:{eq:props.id}}})).then(async(response)=>{
        const eStatus = response.data.listEventss.items[0].status;
        const upticked = response.data.listEventss.items[0].upticktoken;
        setEventTitle(response.data.listEventss.items[0].title)
        console.log(upticked)
        setUptickedToken(upticked);
        if(eStatus === 1){
          fetchUser(1);
          fetchBids();
          setAwardFlag(1)
        } else if(eStatus === 2) {
          setAwardFlag(2)
          const eFinal = response.data.listEventss.items[0].final;
          const finalData = eFinal?.slice(1,eFinal.indexOf("&"));
          fetchUser(2,finalData);
        } else {
          setAwardFlag(2);
          const eFinal = response.data.listEventss.items[0].final;
          const finalData = eFinal?.slice(1,eFinal.indexOf("&"))
          fetchUser(2,finalData);
        }
      })
    }
    async function fetchFinal(finalData){
      await API.graphql(graphqlOperation(queries.listProviderss, { filter: {id:{eq:finalData}}})).then(async(respnse)=>{
        const providers = respnse.data.listProviderss.items[0];
        setProEmail(providers.provider);
        var upticks = [];
        var clientsList = providers.clients;
        if(clientsList){
          upticks.push({"capacity":providers.capacity, "upticks":JSON.parse(clientsList).length});
        } else { upticks.push({"capacity":providers.capacity, "upticks": 0 })}

        setUptick(upticks)
          
        var rankingArr = [];
        const ranking = await API
            .graphql(graphqlOperation(queries.listUserBs, { filter: {
              email: {eq:providers.provider} 
            }})).then((res)=>{
                var rankingStarNum = 0;
                const rankingNum = res.data?.listUserBs?.items[0]?.token*1;
                if(rankingNum === 0 || rankingNum === null) rankingStarNum = 0;
                else if(0<rankingNum&&rankingNum<100)rankingStarNum = 1;
                else if(100<=rankingNum&&rankingNum<1000)rankingStarNum = 2;
                else if(1000<=rankingNum&&rankingNum<3000)rankingStarNum = 3;
                else if(3000<=rankingNum&&rankingNum<10000)rankingStarNum = 4;
                else if(10000<=rankingNum)rankingStarNum = 5;
                rankingArr.push([rankingStarNum])
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
  async function handleCancel(tokens, provider, ios){
    const now = new Date().getTime();
    const start = new Date(eventStart).getTime();
    const eightHours = 1000*60*60*8;
    console.log(start-now, eightHours);
    if(start-now < eightHours){
      alert("You cannot cancel cause you are too late.");
      return false;
    }
    setCanceling([ios]);
    console.log(tokens, provider);
    const transList = await API.graphql(graphqlOperation(queries.listTransactions, {filter: {
      userid: {eq: userId},
      eventid: {eq: provider},
      status: {eq: 1}
    }}));
    const transId = transList.data.listTransactions.items[0].id;
    const proList = await API.graphql(graphqlOperation(queries.listProviderss, {filter:{id: {eq: provider}}}));
    const event = await API.graphql(graphqlOperation(queries.listEventss, {filter: {id: {eq: props.id}}}));
    const total = event.data.listEventss.items[0].upticktoken*1;
    const updateToken = total-tokens;
    const clientsList = JSON.parse(proList.data.listProviderss.items[0].clients);
    let newClient = clientsList.filter(function (e) {
      return e.email !== user;
    });
    console.log(clientsList, updateToken, newClient);
    await API.graphql(graphqlOperation(mutations.updateProviders, {input: {id:provider, clients: JSON.stringify(newClient) }}));
    await API.graphql(graphqlOperation(mutations.updateEvents, {input: {id: props.id, upticktoken: updateToken}}));
    await API.graphql(graphqlOperation(mutations.updateTransaction, {input: {id: transId, status:3}}));
    await API.graphql(graphqlOperation(mutations.updateUserA, {input: {id: userId, token: userToken+tokens}}))
    const transData = {
      userid:userId,
      eventid: provider,
      detail:`Refund from your cancellation about "${eventTitle}"`,
      amount: tokens,
      date:new Date(),
      status:3
    }
    await API.graphql(graphqlOperation(mutations.createTransaction,{input:transData}));
    setCanceling([]);
    const newProv = [...providers];
    const providerArray = {
      capacity:providers[ios].capacity,
      token:providers[ios].token,
      description:providers[ios].description,
      // location:providers[ios].location,
      images: providers[ios].images,
      ranking:providers[ios].ranking,
      providerId:providers[ios].providerId,
      uptick:1,
    }
    newProv[ios] = providerArray;
    setProviders(newProv);
  }
  async function handleUptick(e, id, ios){
    if(userToken<e){
      alert("You have no token enough to uptick. ")
      history.push("/c/getoken")
    } else {
      setUpticking([ios]);
      const upToken = userToken - e;
      const event = await API.graphql(graphqlOperation(queries.listEventss, {filter: {id: {eq: props.id}}}));
      const total = event.data.listEventss.items[0].upticktoken*1;
      const totalToken = e + total;
      console.log(totalToken)
      await API.graphql(graphqlOperation(queries.listProviderss,{filter:{id:{eq:id}}})).then(async(response)=>{
        const clientsList = response.data.listProviderss.items[0].clients;
        var existingClient = 1;
        if(!clientsList){
          var clientsData = [{"email":user}];
          clientsData = JSON.stringify(clientsData)
        } else {
          var list = JSON.parse(clientsList);
          await list.map((item, index) => {
            if(item.email === user) {
              existingClient = 2;
              alert("Upticked already.");
              return false;
            }
          });
          list.push({"email":user});
          clientsData = JSON.stringify(list);
        }
        if(existingClient === 2) return false;
        await API.graphql(graphqlOperation(mutations.updateProviders,{input: {id:id, clients:clientsData}}));
        await API.graphql(graphqlOperation(mutations.updateUserA, {input:{id:userId, token : upToken}}));
        await API.graphql(graphqlOperation(mutations.updateEvents, {input:{id:props.id, upticktoken : totalToken}}));
        const transData = {
          userid:userId,
          eventid:id,
          detail:`Upticked in '${eventTitle}'`,
          amount:-e*1,
          date:new Date(),
          status:1
        }
        await API.graphql(graphqlOperation(mutations.createTransaction,{input:transData}))
        const newProv = [...providers];
        const providerArray = {
          capacity:providers[ios].capacity,
          token:providers[ios].token,
          description:providers[ios].description,
          // location:providers[ios].location,
          images: providers[ios].images,
          ranking:providers[ios].ranking,
          providerId:providers[ios].providerId,
          uptick:2,
        }
        newProv[ios] = providerArray;
        setProviders(newProv);
        setUpticking([]);
      })
      
    }
    
  }
  return (
    <div>
      <Paper>
        <img src = {imageSrc} style = {{width:"100%", marginTop:-50, height:500,objectFit:"cover"}} alt = "Loading"></img>
      </Paper>
      <div style={{ height: 250, width: '100%', zIndex:-1}} className="MapSectionDiv">
        <Map
          google={props.google}
          zoom={mapZoom}
          style={{width: '100%', height: 250, position: 'relative'}}
          initialCenter={{lat: 40, lng: -120}}
          center = {mapCenter}
          containerStyle={{position: 'initial'}}
        >
          <Marker position={mapCenter}/>
        </Map>
      </div>
      <Grid container spacing={3} style = {{width:"80%",marginTop:30,marginRight:"auto", marginLeft:"auto"}}>
        <Grid item xs = {12} md={4} >
        <Typography>Details</Typography>
        </Grid>
        <Grid item xs = {12} md={8} >
        <Typography>Title : {title}</Typography>
        <Typography>Location : {location}</Typography>
        <Typography >Date: {duration}</Typography>
        <Typography>{description}</Typography>
        
        </Grid>
        <Typography variant="h4" align="center" >
          {awardFlag===1?"Provider's bid":awardFlag===2?"Awarded Provider":""}
        </Typography>
        {awardFlag === 1?<Grid item xs = {12} md = {12}>
          
          {providers.map((items, index)=>{
            return <Card key = {index} style = {{marginTop:20,}}>
              <Grid container spacing = {3}>
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
                  <div style = {{display:"flex", flexDirection:"row"}}>
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
                  <Grid container spacing = {3} style = {{margin:3}}>
                    
                
                    <Grid item xs = {12} md = {4}>
                      <Typography variant="body2" >
                        Suggested Token : {items.token}
                      </Typography>
                    </Grid>
                  </Grid>
                   {items.description.length > 300 ? <Typography variant="body2" >{items.description.slice(0, 400)+"..."}<ExpandMoreIcon style = {{float:"right", marginRight:20}}/></Typography>:<Typography variant="body2" >{items.description}</Typography>}
                  
                </Grid>
                <Grid item xs = {12} md = {2} style={{display:'flex', justifyContent:'flex-end'}}>
                  <div style={{ padding: 10}}>
                    {items.uptick===1?<Button 
                      variant = "contained" 
                      color="secondary"
                      disabled = {upticking[0]===index}
                      onClick={() => handleUptick(items.token, items.providerId, index)}>
                        Uptick{" "}{upticking[0]===index && <ButtonCircularProgress/>}
                    </Button>:items.uptick===2?<Button 
                      variant = "contained"
                      color="primary"
                      disabled = {canceling[0]===index}
                      onClick={() => handleCancel(items.token, items.providerId, index)}>
                        Cancel{' '}{canceling[0]===index && <ButtonCircularProgress />}
                    </Button>:null}
                  </div>
                </Grid>
              </Grid>
              
            </Card>
          })}
        </Grid>:<Grid item xs= {12} md = {12}>
        <Grid container spacing={3} style = {{marginTop:10, padding:10,}}>
                <Grid item xs={12} md = {9}>
                  <div style = {{display:"flex", flexDirection:"row",}}>
                  {awardFlag===1?"Provider's bid":awardFlag===2?<Avatar alt="Remy Sharp" src="/images/logged_in/image4.jpg" style = {styles.avatar}/>:""}
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
                        <Typography variant="body2" color="textSecondary">{item.upticks/item.capacity*100}%</Typography>
                      </Box>
                    </Box>
                    </div>
                  })}
                  
                </Grid>
            </Grid>
          </Grid>}
        
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

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCCynf5qQzLMr2CLR0sWWLgsq6vT8ad4M0'
})(PostContent);
