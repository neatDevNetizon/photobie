import React, { Component } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import IconButton from '@material-ui/core/IconButton';
import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
  
const data = [{
  title:"Meet Philip",
  content:"Eccentric Artists LoftAn NYC eccentric artist loft owner is sharing her live-in cabinet of curiosities",
  url:"/images/logged_out/clients1 (1).jpg"
},
  {title:"Meet Joey",
  content:"Home of Underground BoxingOwner of a trendy underground boxing clubthat hosts fashion, film and photo-shoots",
  url:"/images/logged_out/clients1 (2).jpg"
},
  {title:"Meet Robby",
  content:"Eccentric Artists LoftAn NYC eccentric artist loft owner is sharing her live-in cabinet of curiosities",
  url:"/images/logged_out/clients1 (3).jpg"},
  {
    title:"Meet Susan",
  content:"Eccentric Artists LoftAn NYC eccentric artist loft owner is sharing her live-in cabinet of curiosities",
  url:"/images/logged_out/clients1 (4).jpg"
  },
  {
    title:"Meet Irina",
  content:"Eccentric Artists LoftAn NYC eccentric artist loft owner is sharing her live-in cabinet of curiosities",
  url:"/images/logged_out/clients1 (5).jpg"
  },
  {
    title:"Meet Allena",
  content:"Eccentric Artists LoftAn NYC eccentric artist loft owner is sharing her live-in cabinet of curiosities",
  url:"/images/logged_out/clients1 (6).jpg"
  }
]
export default class ClientOpi extends Component {
  constructor(){
    super();
  }
    render() {
      const responsive = {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3,
          slidesToSlide: 3 ,
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
          <Carousel
           
          swipeable={false}
          draggable={false}
          showDots={true}
          responsive={responsive}
          ssr={true} 
          infinite={true}
          // autoPlay={this.props.deviceType !== "mobile" ? true : false}
          // autoPlaySpeed={10000}
          keyBoardControl={true}
          
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          deviceType={this.props.deviceType}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          {data.map((item,i)=>{
            return <div style = {styles.cardbody} key = {i}>
              <Card style = {styles.cardbody}>
                <CardActionArea>
                  <CardMedia 

                  /> 
                  <img src = {item.url} style = {styles.images}></img>
                  <IconButton aria-label="add to favorites" style = {styles.iconBody}>
                    <OndemandVideoIcon  style = {styles.videoplay}/>
                  </IconButton>

                  <CardContent>
                    <Typography gutterBottom variant="h5" >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                  {item.content}
                 </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  {/* <Button size="small" color="primary">
                    Learn More
                  </Button> */}
                </CardActions>
              </Card>
            </div>
          })}
        </Carousel>
        );
    }
}
const styles = {
  iconBody:{
    borderWidth:1,
    borderStyle:"solid",
    borderColor:"white",
    borderRadius:30,
    display:"contents"
  },
  images:{
    objectFit:"cover",
    width:"100%",
    height:200,
    // backgroundColor:"#212121"
  },
  cardbody:{
    margin:20,
    height:380,
    borderRadius:30,
  },
  videoplay:{
    textAlign:"center",
    justifyContent:"center",
    position:"relative",
    marginTop:-190,
    color:"white",
    fontSize:"2em",
    
  }
}




