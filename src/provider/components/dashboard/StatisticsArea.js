import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Grid, 
  withTheme,
  isWidthUp
} from "@material-ui/core";
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';


const events = [{
  capacity: 23,
  id: "fcaf11b9-88a1-4c8d-a406-eed4f8afccd9",
  location: "Moscow",
  secure: 2,
  title: "Math events",
  token: 2,
  imageSrc:"/images/logged_out/blogPost1.jpg",
  description:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et."
},
{
  capacity: 34,
  id: "da16da06-61d4-41f9-a86b-32ce35c70334",
  location: "London",
  secure: 2,
  title: "POPULATION",
  token: 232,
  imageSrc:"/images/logged_out/blogPost2.jpg",
  description:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et."
},
{
  capacity: 23,
  id: "0c5722e3-9561-4de7-850a-1c404a79bbc5",
  location: "London",
  secure: 1,
  title: "12-22",
  token: 2,
  imageSrc:"/images/logged_out/blogPost3.jpg",
  description:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et."
},
  {
  capacity: 23,
  id: "fcaf11b9-88a1-4c8d-a406-eed4f8afccd9",
  location: "New York",
  secure: 2,
  title: "Holly Wood",
  token: 2,
  imageSrc:"/images/logged_out/blogPost4.jpg",
  description:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et."
  },
  {
  capacity: 34,
  id: "da16da06-61d4-41f9-a86b-32ce35c70334",
  location: "Califonia",
  secure: 2,
  title: "Happy Birthday",
  token: 232,
  imageSrc:"/images/logged_out/blogPost5.jpg",
  description:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et."
  },
  {
  capacity: 23,
  id: "0c5722e3-9561-4de7-850a-1c404a79bbc5",
  location: "Singapore",
  secure: 1,
  title: "January 1",
  token: 2,
  imageSrc:"/images/logged_out/blogPost6.jpg",
  description:"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et."
  },
]
function StatisticsArea(props) {
  const { theme, CardChart, data,classes, viewMode, width} = props;
  const[pageNum, setPageNum] = useState(1)
  function handleClick(){
    setPageNum(2)
  }
  const history = useHistory();
  const viewEvent = async(event)=>{
    history.push("/p/detail");
  }
  return (
    <Grid container spacing={3} style = {{width:"80%",marginRight:"auto", marginLeft:"auto",cursor:"pointer"}}>
    {events.map((item,i)=>{
      return viewMode=="left"?<Grid item xs={12} md={12}>
        <Card onClick = {viewEvent}>
          <div style = {{display:"flex", flexDirection:"row",}}>
          <Box style = {{display:"inline-block"}}>
            <img src = {item.imageSrc} style = {{width:300, height:"100%",objectFit:"cover"}}></img>
          </Box>
            <div style = {{display:"flex", flexDirection:"column",}}>
              <Box pt={2} px={2} pb={4} style = {{display:"block"}}>
                <Box display="flex" justifyContent="space-between">
                  <div>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.location}
                    </Typography>
                  </div>
                </Box>
              </Box >
              <CardContent style = {{display:"block"}}>
                <Box  boxShadow={0.2} height="300">
                  {item.description}
                </Box>
              </CardContent>
            </div>
          </div>
        </Card>
    </Grid>:<Grid item xs = {12} md={4} >
      <Card style = {cardstyles.cardbody} onClick = {viewEvent}>
          <CardActionArea>
            <img src = {item.imageSrc} style = {cardstyles.images}></img>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {item.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              <LocationOnIcon/>{item.location}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        </Grid>
    })}
    </Grid>
  )
}
const cardstyles = {
 
  cardbody:{
    marginLeft:10,
    marginRight:20,
    borderRadius:15,

  },
  images:{
    width:"100%",
    height:"100%",
    minHeight:250,
    maxHeight:250,
    shadowColor: "#000",
    objectFit:"cover",
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 1.2,
    shadowRadius: 3.30,
    elevation: 3,
  }
};
StatisticsArea.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  CardChart: PropTypes.elementType
};

export default withTheme(StatisticsArea);
