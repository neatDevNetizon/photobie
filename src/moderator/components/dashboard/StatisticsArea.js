import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, withTheme } from "@material-ui/core";

import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
  const { theme, CardChart, data,classes } = props;
  
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  
  const isOpen = Boolean(anchorEl);
  return (
    events.map((item, index)=>{
      return <Grid container spacing={3}>
        
      <Grid item xs={12} md={12}>
      <Card>
      <Box pt={2} px={2} pb={4}>
        <Box display="flex" justifyContent="space-between">
          <div>
            <Typography variant="subtitle1">{item.title}</Typography>
            <Typography variant="body2" color="textSecondary">
              {item.location}
            </Typography>
          </div>
          <div>
            {/* <IconButton
              aria-label="More"
              aria-owns={isOpen ? "long-menu" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton> */}
          
          </div>
        </Box>
      </Box>
      <CardContent>
      <Box  boxShadow={0.2} >
        {item.description}
      </Box>
    </CardContent>
  </Card>
        </Grid>
    </Grid>
    })
  )
    
      
}

StatisticsArea.propTypes = {
  theme: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  CardChart: PropTypes.elementType
};

export default withTheme(StatisticsArea);
