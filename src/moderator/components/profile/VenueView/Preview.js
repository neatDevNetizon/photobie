import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {Storage} from 'aws-amplify';

const useStyles = makeStyles((theme)=>({
  root: {
    
  }
}))
export default function Preview({detail, media}){
  const classes = useStyles();
  const [imageUrl, setImageUrl] = useState('');
  useEffect(()=>{
    async function fetchImage(){
      await Storage.get(media, { expires: 300 }).then(res=>{
				setImageUrl(res);
        console.log(res)
			});
    }
    fetchImage()
  })
  return (
    <div>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            component="img"
            alt="Preview"
            height="140"
            image={imageUrl}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2">
              {detail}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
Preview.propTypes = {
  detail: PropTypes.string,
  media: PropTypes.string
}