import React, { Fragment, useRef, useCallback, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes, { resetWarningCache } from "prop-types";
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
  Hidden,
  Box,
  withStyles,
  withWidth,
  Menu,
  MenuItem,
  makeStyles,
  useTheme,
  Divider,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MessageIcon from "@material-ui/icons/Message";
import CategoryIcon from '@material-ui/icons/Category';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import Amplify, {API,graphqlOperation, Auth,Storage} from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.css';
import * as queries from '../../../graphql/queries';
import NavItem from './NavItem';


const drawerWidth = 200;
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
    height: 24,
    width: 24,
    cursor:"pointer",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(1.5),
      marginRight: theme.spacing(1.5),
    },
    marginTop:5,
  },
  messageIcon:{
    width:24,
    height:24,
    cursor:"pointer",
    marginLeft: 10,
    marginRight: 10,

  },
  drawerPaper: {
    height: "100%vh",
    whiteSpace: "nowrap",
    border: 0,
    borderRight:"1px solid rgba(20, 20, 20, 0.5)",
    overflowX: "hidden",
    marginTop: theme.spacing(8),
   
    // backgroundColor: theme.palette.common.black,
    
    width: drawerWidth,
  },

  drawerPaper1:{
    paddingTop: theme.spacing(7),
    width:drawerWidth,
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

  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,

  // drawerPaper: {
  //   width: drawerWidth,
  // },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});
function NavBar(props) {
  const { selectedTab, messages, classes, width, openAddBalanceDialog } = props;
  // Will be use to make website more accessible by screen readers
  const links = useRef([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [rankingImage, setRankingImage] = useState("")
  const [showAndHide, setShowAndHide] = useState("classes.hideImage")
  const openMobileDrawer = useCallback(() => {
    setIsMobileOpen(true);
    setMobileOpen(!mobileOpen);
  }, [setIsMobileOpen]);

  async function logOut(){
    try {
        await Auth.signOut();
        window.location.href = "/"
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }
  
  const items = [
    {
      href: '/a/types',
      icon: CategoryIcon,
      title: 'Event type setting'
    },
    {
      href: '/a/users',
      icon: AccountBoxIcon,
      title: 'User management'
    }
  ];
  const history = useHistory();
  const goListPage = () => history.push('/a/dashboard')
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

  useEffect(()=>{
    
  },[]);

  async function handleMessage(){
    history.push("/a/message");
  }
  async function goGetToken(){
    history.push("/a/getoken");
  }



  const { window } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <div>
      {/* <div className={classes.toolbar} style = {{borderRight:"none",alignItems:"center"}}>photobie</div> */}
      <Divider />
      <List>
        
      </List>
      <Divider />
      <List>
        {items.map((item) => (
          <NavItem
            href={item.href}
            key={item.title}
            title={item.title}
            icon={item.icon}
          />
        ))}
      </List>
    </div>
  );
  return (
    <Fragment>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar className={classes.appBarToolbar}>
          <Box display="flex" alignItems="center">
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
                onClick = {goLandingPage}
              >
                Photobie
                {/* <Button
                  color="secondary"
                  size="large"
                  onClick={goListPage}
                >
                  View List
                </Button> */}
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
            {/* <img src = {rankingImage} className = {showAndHide} style = {{width:40,height:40}}/> */}
            {/* <Button
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
            </Button> */}
            <MessageIcon onClick = {handleMessage} color=  "primary" style = {{marginRight:10,marginLeft:10}}/>
            {/* <MessagePopperButton messages={messages} /> */}
            <ListItem
              disableGutters
              className={classNames(classes.iconListItem, classes.smBordered)}
            >
              
              <Avatar
                alt="profile picture"
                src={`${process.env.PUBLIC_URL}/images/logged_in/profilePicture.jpg`}
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
                style = {{marginTop:30,width:300}}
              >
                <MenuItem onClick={handleClose}>Setting</MenuItem>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={logOut}>Logout</MenuItem>
              </Menu>
          </Box>
          
        </Toolbar>
      </AppBar>
      <Hidden smUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper1,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
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

export default withWidth()(withStyles(styles, { withTheme: true })(NavBar));
