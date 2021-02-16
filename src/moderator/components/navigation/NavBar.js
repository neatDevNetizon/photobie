import React, { Fragment, useRef, useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Drawer,
  List,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Hidden,
  Tooltip,
  Box,
  withStyles,
  isWidthUp,
  withWidth,
  Popover,
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ImageIcon from "@material-ui/icons/Image";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import MenuIcon from "@material-ui/icons/Menu";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import MessagePopperButton from "./MessagePopperButton";
import SideDrawer from "./SideDrawer";
import Balance from "./Balance";
import NavigationDrawer from "../../../shared/components/NavigationDrawer";
import 'bootstrap/dist/css/bootstrap.css';
import MessageListItem from "./MessageListItem";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MessageIcon from "@material-ui/icons/Message";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTodoAction } from '../../../actions/addTodoAction';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import * as queries from '../../../graphql/queries';

const styles = (theme) => ({
  
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginLeft: 0,
    },
  },
  appBarToolbar: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up("md")]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  accountAvatar: {
    backgroundColor: theme.palette.secondary.main,
    height: 35,
    width: 35,
    cursor:"pointer",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
    },
  },
  drawerPaper: {
    height: "100%vh",
    whiteSpace: "nowrap",
    border: 0,
    width: theme.spacing(7),
    overflowX: "hidden",
    marginTop: theme.spacing(8),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
    backgroundColor: theme.palette.common.black,
  },
  smBordered: {
    [theme.breakpoints.down("xs")]: {
      borderRadius: "50% !important",
    },
  },
  menuLink: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  iconListItem: {
    width: "auto",
    borderRadius: theme.shape.borderRadius,
    paddingTop: 11,
    paddingBottom: 11,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },
  mobileItemSelected: {
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
  brandText: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400,
    cursor:"pointer"
  },
  username: {
    paddingLeft: 0,
    paddingRight: theme.spacing(2),
  },
  justifyCenter: {
    justifyContent: "center",
  },
  permanentDrawerListItem: {
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  dropdown:{
    position: "relative",
    display: "inline-block",
    
  },
  dropbtn:{
    backgroundColor: "#4CAF50",
    color: 'white',
    padding: "16",
    fontSize: "16",
    border: "none"
  },
  dropdownContent:{
    display: "none",
    position: "absolute",
    backgroundColor: "#f1f1f1",
    minWidth: "160",
    boxShadow: "0 8 16 0 rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  dropdown: {
    display: "block"
  }

});
function NavBar(props) {
  const { selectedTab, messages, classes, width, openAddBalanceDialog } = props;
  // Will be use to make website more accessible by screen readers
  const links = useRef([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState();
  const openMobileDrawer = useCallback(() => {
    setIsMobileOpen(true);
  }, [setIsMobileOpen]);

  const closeMobileDrawer = useCallback(() => {
    setIsMobileOpen(false);
  }, [setIsMobileOpen]);

  const openDrawer = useCallback(() => {
    setIsSideDrawerOpen(true);
  }, [setIsSideDrawerOpen]);

  const closeDrawer = useCallback(() => {
    setIsSideDrawerOpen(false);
  }, [setIsSideDrawerOpen]);

  useEffect(()=>{
    if(props.items){
      setUserAvatar(props.items);
    }
    
  })
  useEffect(()=>{
    async function fetchUser() {
      const user = await Auth.currentUserInfo()
      if(!user){
        window.location.href = "/"
      }
      else {
        const id = user.attributes.email;
        const userToken = await API.graphql(graphqlOperation(queries.listUserss, { filter: {email:{eq:id}}}));
        await Storage.get(userToken.data.listUserss.items[0].photo, { expires: 300 }).then(res=>{
          setUserAvatar(res)
        })
      }
    }
    
    fetchUser();
  },[]);
  async function logOut(){
    try {
        await Auth.signOut();
        window.location.href = "/"
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
 
  const history = useHistory();
  const navigateTo = () => history.push('/m/subscription');
  const goListPage = () => history.push('/m/dashboard')
  const goLandingPage = () => history.push("/");
  const viewList = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  async function handleMessage(){
    history.push("/m/message");
  }

  async function goGetToken(){
    history.push("/m/getoken");
  }
  async function editProfile(){
    history.push("/m/editprofile")
    handleClose();
  }
  return (
    <Fragment>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar className={classes.appBarToolbar}>
          <Box display="flex" alignItems="center" onClick = {goLandingPage} style = {{cursor:"hand"}}>
            <Hidden smUp>
              <Box mr={1}>
                <IconButton
                  aria-label="Open Navigation"
                  onClick={openMobileDrawer}
                  color="primary"
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Hidden>
            <Hidden xsDown>
              <Typography
                variant="h4"
                className={classes.brandText}
                display="inline"
                color="primary"
              >
                Photobie
              </Typography>
            </Hidden>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            width="100%"
            openAddBalanceDialog={openAddBalanceDialog}
          >
            <Button
              color="secondary"
              size="large"
              onClick={goGetToken}
            >
              Get token
            </Button>

            <Button
              color="secondary"
              size="large"
              onClick={goListPage}
            >
              View List
            </Button>
             <Button
               onClick={navigateTo}
              color="secondary"
              size="large"
            >
              Post Event 
            </Button>
            
            {/* <MessagePopperButton messages={messages} /> */}
            <MessageIcon onClick = {handleMessage} color=  "primary" style = {{marginRight:10,marginLeft:10}}/>
            <ListItem
              disableGutters
              className={classNames(classes.iconListItem, classes.smBordered)}
              
            >
              <Avatar
                src={userAvatar}
                className={classNames(classes.accountAvatar)}
                onClick = {viewList}
              />
            </ListItem>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                style = {{marginTop:30, width:300}}
              >
                <MenuItem onClick={handleClose}>Setting</MenuItem>
                <MenuItem onClick={editProfile}>Profile</MenuItem>
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </Menu>
          </Box>
          
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}

NavBar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTab: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  openAddBalanceDialog: PropTypes.func.isRequired,
};
const mapStateToProps = () => state => {
  return {
      items: state.userEmail
  };
};
const mapDistachToProps = () => dispatch => {
  return bindActionCreators({ addTodo: addTodoAction }, dispatch);
};

export default withWidth()(withStyles(styles, { withTheme: true })(connect(mapStateToProps,mapDistachToProps)(NavBar)));

