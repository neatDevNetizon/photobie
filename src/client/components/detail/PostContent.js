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
import {useHistory} from "react-router-dom"

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
      await Storage.get(selEvent.image, { expires: 300 }).then(res=>{
        setImageSrc(res)
        setTitle(selEvent.title);
        setLocation(selEvent.location);
        setDescription(selEvent.description);
      })
      if(a==1)fetchBids(userEmail);
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
            await Storage.get(imageArray[j], { expires: 300 }).then(res=>{
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
          const finalData = eFinal?.slice(1,eFinal.indexOf("&"))
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
  async function handleUptick(e, id, ios){
    if(userToken<e){
      alert("You have no token enough to uptick. ")
      history.push("/c/getoken")
    } else {
      const upToken = userToken - e;
      const totalToken = e + uptickedToken*1;
      console.log(totalToken)
      await API.graphql(graphqlOperation(queries.listProviderss,{filter:{id:{eq:id}}})).then(async(response)=>{
        const clientsList = response.data.listProviderss.items[0].clients;
        
        if(!clientsList){
          var clientsData = [{"email":user}];
          clientsData = JSON.stringify(clientsData)
        } else {
          var list = JSON.parse(clientsList);

          await list.map((item, index) => {
            if(item.email === user) {
              console.log(user)
              alert("Upticked already.");
              return false;
            }
          });
          list.push({"email":user});
          clientsData = JSON.stringify(list);
        }
        await API.graphql(graphqlOperation(mutations.updateProviders,{input: {id:id, clients:clientsData}}));
        await API.graphql(graphqlOperation(mutations.updateUserA, {input:{id:userId, token : upToken}}));
        await API.graphql(graphqlOperation(mutations.updateEvents, {input:{id:props.id, upticktoken : totalToken}}));
        const transData = {
          userid:userId,
          eventid:props.id,
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
        setProviders(newProv)
      })
      
    }
    
  }
  return (
    <div>
      <Paper>
        <img src = {imageSrc} style = {{width:"100%", marginTop:-50, height:500,objectFit:"cover"}} alt = "Loading"></img>
      </Paper>
      <Grid container spacing={3} style = {{width:"80%",marginTop:30,marginRight:"auto", marginLeft:"auto"}}>
        <Grid item xs = {12} md={4} >
        <Typography>Details</Typography>
        </Grid>
        <Grid item xs = {12} md={8} >
        <Typography>Title : {title}</Typography>
        <Typography>Location : {location}</Typography>
        <Typography>{description}</Typography>
        
        </Grid>
        <Typography variant="h4" align="center" >
          {awardFlag===1?"Provider's bid":awardFlag===2?"Awarded Provider":""}
        </Typography>
        {awardFlag === 1?<Grid item xs = {12} md = {12}>
          
          {providers.map((items, index)=>{
            return <Card key = {index} style = {{marginTop:20,}}>
              <Grid container spacing = {5}>
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
                <Grid item xs = {12} md = {8}>
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
                    <Box  display="flex" justifyContent="flex-end" width = "80%">
                      <IconButton
                        aria-label="More"
                        aria-haspopup="true"
                        disabled = {items.uptick === 1?false:true}
                        aria-label = "add to shopping cart"
                        onClick={() => handleUptick(items.token, items.providerId, index)}
                      >
                        <CheckIcon  color = {items.uptick===1?"primary":"secondary"}/>
                        <Typography variant = "body1">{items.uptick===1?"Uptick":items.uptick === 2?"Upticked":"Capacity is Full"}</Typography>
                        
                      </IconButton>
                    </Box>
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

export default withStyles(styles)(PostContent);
