import React, { useState, useCallback } from "react";
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
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between",
  },
};
const useStyles = makeStyles((theme) => ({
  root: {
    margin:"0 auto",
    '& .MuiTextField-root': {
      // margin: theme.spacing(3),
      position:'flex',
      width: '50vw',
      height:"13vh",
      justifyContent: "space-between"
    },
  },
}));
function PostContent(props) {
  const { classes, openAddBalanceDialog } = props;
  const[description, setDescription] = useState(['']);
  const [textrequired, setTextrequired] = useState(['txtrequiredHidden']);
  // const classes = useStyles();\
  const descriptionSet = (e) =>{
    setDescription(e.target.value);
  }
  return (
    <div>
      <Paper>
        <img src = "/images/logged_out/blogPost1.jpg" style = {{width:"100%", marginTop:-50, height:400,objectFit:"cover"}}></img>
      </Paper>
      <Grid container spacing={3} style = {{width:"70%",marginTop:30,marginRight:"auto", marginLeft:"auto"}}>
        <Grid item xs = {12} md={4} >
        <Typography>Details</Typography>
        </Grid>
        <Grid item xs = {12} md={8} >
        <Typography>Valentine Holiday</Typography>
        <Typography>Moscow</Typography>
        <Typography>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et.</Typography>
        
        </Grid>
        <Typography variant="h3" align="center" >
          
        </Typography>
        <div style = {{width:"100%"}}>
          <TextField
              onChange={descriptionSet}
              id="filled-full-width"
              label="Describe your proposal"
              style={{ margin: 8 }}
              fullWidth
              multiline
              rows = {4}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
        </div>
        <div style = {{width:"100%", }}>
          <Button variant="contained" color="secondary" style = {{float:"right"}}>
            Place bid
          </Button>
        </div>
        
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
