import React from 'react';
import Main from './General/main';
import {
    Hidden,
    Drawer,
    makeStyles,
    useTheme,
    Divider,
    List,
} from '@material-ui/core';
import CategoryIcon from '@material-ui/icons/Category';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NavItem from './NavItem';

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        height: "100%vh",
        whiteSpace: "nowrap",
        border: 0,
        borderRight:"1px solid rgba(20, 20, 20, 0.5)",
        overflowX: "hidden",
        marginTop: theme.spacing(8),
        width: drawerWidth,
    },

    drawerPaper1:{
        paddingTop: theme.spacing(7),
        width:drawerWidth,
    },
    
}));

const items = [
    {
      href: '/m/editprofile',
      icon: CategoryIcon,
      title: 'Your profile'
    },
  ];
export default function Profile() {
    const classes = useStyles();
    const theme = useTheme();
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
        <div>
            
            <Hidden smUp implementation="css">
                <Drawer
                    // container={container}
                    variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={false}
                    // onClose={handleDrawerToggle}
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
        </div>
    );
}