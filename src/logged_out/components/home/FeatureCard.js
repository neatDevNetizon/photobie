import React, { Fragment } from "react";
import { Typography, withStyles } from "@material-ui/core";
import CardActionArea from '@material-ui/core/CardActionArea';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

const styles = theme => ({
  iconWrapper: {
    borderRadius: theme.shape.borderRadius,
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1) * 1.5
  }
});

function shadeColor(hex, percent) {
  const f = parseInt(hex.slice(1), 16);

  const t = percent < 0 ? 0 : 255;

  const p = percent < 0 ? percent * -1 : percent;

  const R = f >> 16;

  const G = (f >> 8) & 0x00ff;

  const B = f & 0x0000ff;
  return `#${(
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
    .toString(16)
    .slice(1)}`;
}

function FeatureCard(props) {
  const { location, title, description, imgSrc } = props;
  return (
    <Fragment>
      <Card style = {cardstyles.cardbody} >
        <CardActionArea>
          <img src = {imgSrc} style = {cardstyles.images}></img>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
            <LocationOnIcon/>{location}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Learn More
          </Button>
        </CardActions>
      </Card>
    </Fragment>
  );
}

FeatureCard.propTypes = {
  // classes: PropTypes.object.isRequired,
  // Icon: PropTypes.element.isRequired,
  // color: PropTypes.string.isRequired,
  // headline: PropTypes.string.isRequired,
};

const cardstyles = {
 
  cardbody:{
    marginLeft:10,
    marginRight:20,
    borderRadius:15,
    
  },
  images:{
    width:"100%",
    height:"100%",
    minHeight:280,
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
export default withStyles(styles, { withTheme: true })(FeatureCard);
