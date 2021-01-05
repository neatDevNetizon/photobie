import React, { useState } from "react";
import PropTypes from "prop-types";
import { ListItemText, Toolbar, withStyles } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { flexbox, spacing } from '@material-ui/system';
import { useHistory } from "react-router-dom";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SecurityIcon from '@material-ui/icons/Security';
import PublicIcon from '@material-ui/icons/Public';
// import Button from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
const styles = {
  toolbar: {
    justifyContent: "space-between"
  },
  txtFiled: {
    justifyContent: "space-between",
    width:"50vw",
    fontSize:'1.5em'
  },
  txtrequired: {
    justifyContent: "space-between",
    color: 'firebrick',
    fontSize: '13px',
    marginTop:'15px',
  },
  txtrequiredHidden: {
    justifyContent: "space-between",
    color: 'firebrick',
    fontSize: '13px',
    display:'none',
    marginTop:'15px',
  },
  txtFiled1: {
    justifyContent: "space-between",
    marginTop: "10px",
    display:'none',
    width:"50vw",
    fontSize:'1.5em'
  },
  txtFiled2: {
    display:'none',
  },
  txtFiled3: {
    justifyContent: "space-between",
    fontSize:'3em'
  },
  toppadding:{
    marginTop:'100px'
  },
  toppadding2:{
    marginTop:'60px'
  },
  bottompadding:{
    marginBottom:'5px'
  },
  button: {
    marginBottom:'30px'
    // margin: theme.spacing.unit,
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
function SubscriptionInfo(props) {
  const [value, setValue] = React.useState('private');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const descriptionSet = (e) =>{
    setDescription(e.target.value);
  }
  const titleSet = (e) =>{
    setTitle(e.target.value);
  }
  const locationSet = (e) =>{
    setLocation(e.target.value);
  }
  const capacitySet = (e) =>{
    setCapacity(e.target.value);
  }

  const { classes, openAddBalanceDialog } = props;
  const classess = useStyles();

  const[title, setTitle] = useState(['']);
  const[description, setDescription] = useState(['']);
  const[location, setLocation] = useState(['']);
  const[capacity, setCapacity] = useState(['']);
  const[postbtn, setPostbtn] = useState(['next']);

  
  const [locationrequired, setLocationrequired] = useState(['txtrequiredHidden']);
  const [textrequired, setTextrequired] = useState(['txtrequiredHidden']);
  const [cart, setCart] = useState(['txtFiled1']);
  const [security, setSecurity] = useState(['txtFiled2']);
  const [count, setCount] = useState(0);
  const history = useHistory();
  
  const test = () => {
    if(count == 0){
      if(description.length > 20 && title.length > 3){
        setTextrequired('txtrequiredHidden')
        setCart('txtFiled')
        setCount(count + 1);
      }
      else{
        setTextrequired('txtrequired')
        return;
      }
      return
    }
    else if(count == 1){
     
      if(location.length > 3 && capacity.length > 1){
        setLocationrequired('txtrequiredHidden')
        setSecurity('txtFiled3')
        setPostbtn('complete')
        setCount(count + 1);
      }
      else{
        setLocationrequired('txtrequired')
        return;
      }
      return
    }
    else
    {
      console.log("location:  "+location+"capacity: "+capacity+"security: "+value)
      history.push('/m/dashboard');
    }
  };
  return (
    
  <Toolbar className={classes.toolbar}>
    <form className={classess.root} noValidate autoComplete="off">
    <div className={classes.toppadding}></div> 
    <div className={classes.txtFiled}>
        <TextField
              onChange={titleSet}
              id="outlined-search"
              label="Event Title"
              variant="outlined"
            />
    </div>
    
    <div className={classes.txtFiled}>
      <TextField
          onChange={descriptionSet}
          id="outlined-search"
          label="Event Description"
          multiline
          rows={4}
          variant="outlined"
        />
    </div>
    <div className={classes[textrequired]}>
    * Please enter at least 20 characters
    </div>
    {/* hidden items */}
    <div className={classes.toppadding2}></div> 
    <div  className={classes[cart]}>
        <TextField
                  onChange={locationSet}
                  id="outlined-search"
                  label="Location"
                  variant="outlined"
            />
    </div>
    <div className={classes[locationrequired]}>
    * Please enter at least 5 characters
    </div>
    <div className={classes[cart]}>
          <TextField
                  onChange={capacitySet}
                  id="outlined-search"
                  label="Capacity"
                  variant="outlined"
                  type="number"
            />
        {/* <TextField id="standard-search" 
        onChange={capacitySet}
        label="Capacity" type="number" /> */}
    </div>
    <div className={classes[security]}>
    <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
      <BottomNavigationAction label="Private" value="private" icon={<SecurityIcon />} />
      <BottomNavigationAction label="Public" value="public" icon={<PublicIcon />} />
    </BottomNavigation>
    </div>
    <div className={classes.bottompadding}></div>
    <Button variant="contained"
    color="secondary"
    onClick={() => {
      test();
    }}
    className={classes.button}
    >
        {postbtn}
    </Button> 
    </form>
  </Toolbar>
  );
}

SubscriptionInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  openAddBalanceDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(SubscriptionInfo);
