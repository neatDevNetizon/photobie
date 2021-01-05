import React from "react";
import PropTypes from "prop-types";
import { Grid, Typography, isWidthUp, withWidth } from "@material-ui/core";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import calculateSpacing from "./calculateSpacing";
import FeatureCard from "./FeatureCard";

const past = [{
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
]
const future = [{
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

function FeatureSection(props) {
  const { width } = props;
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom">
          Past Events
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>
            {past.map(element => (
              <Grid
                item
                xs={12}
                md={4}
                data-aos="zoom-in-up"
                data-aos-delay={
                  isWidthUp("md", width) ? element.mdDelay : element.smDelay
                }
                key={element.id}
              >
                <FeatureCard
                  location={element.location}
                  title={element.title}
                  description={element.description}
                  imgSrc = {element.imageSrc}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        <div style = {styles.aBody}>
            <a  style = {styles.aLink}>See all </a><ArrowForwardIcon />
          </div>
      </div>
      
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom">
          Future Events
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>
            {future.map(element => (
              <Grid
                item
                xs={12}
                md={4}
                data-aos="zoom-in-up"
                data-aos-delay={
                  isWidthUp("md", width) ? element.mdDelay : element.smDelay
                }
                key={element.id}
              >
                <FeatureCard
                  location={element.location}
                  title={element.title}
                  description={element.description}
                  imgSrc = {element.imageSrc}
                />
              </Grid>
            ))}
          </Grid>
          <div style = {styles.aBody}>
            <a  style = {styles.aLink}>See all </a><ArrowForwardIcon />
          </div>
        </div>
      </div>
      
    </div>
  );
}

FeatureSection.propTypes = {
  width: PropTypes.string.isRequired
};
const styles = {
  aBody:{
    marginTop: 20, 
    display:"flex", 
    flexDirection:"row", 
    float:"right"
  },
  aLink:{
    float:"right",
    textDecoration:"none",
    fontSize:20,
  }
}
export default withWidth()(FeatureSection);
