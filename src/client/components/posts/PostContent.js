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
  Card,
} from "@material-ui/core";
import * as queries from '../../../graphql/queries';
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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
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
    async function fetchBids(){
      await API.graphql(graphqlOperation(queries.listProviderss, { filter: {eventid:{eq:props.id}}})).then(async(respnse)=>{
        const providers = respnse.data.listProviderss.items;
        console.log(providers)
        var providerArray = [];
        for(let i = 0; i<providers.length;i++){
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
          })
          
        }
        setProviders(providerArray)
      })
    }
    fetchUser();
    fetchBids();
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
        <Typography>{title}</Typography>
        <Typography>{location}</Typography>
        <Typography>{description}</Typography>
        
        </Grid>
        <Typography variant="h3" align="center" >
          Provider's bid
        </Typography>
        <Grid item xs = {12} md = {12}>
          
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
                      defaultValue={2.7}
                      precision={0.1}
                      size="large"
                      readOnly 
                      style = {{marginTop:30,marginLeft:20}}
                    /><Box style = {{marginTop:35,marginLeft:5}}>2.7</Box>
                  </div>
                  <Grid container spacing = {3} style = {{margin:3}}>
                    <Grid item xs = {12} md = {4}>
                      <Typography variant="body2" >
                        Suggested capacity : {items.capacity}
                      </Typography>
                    </Grid>
                
                    <Grid item xs = {12} md = {4}>
                      <Typography variant="body2" >
                        Location : {items.location}
                      </Typography>
                    </Grid>
                
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
          


        </Grid>
        
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
