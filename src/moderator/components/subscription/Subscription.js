import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { List, Divider, Paper, withStyles } from "@material-ui/core";
import SubscriptionTable from "./SubscriptionTable";
import SubscriptionInfo from "./SubscriptionInfo";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
const styles = {
  divider: {
    backgroundColor: "rgba(0, 0, 0, 0.26)"
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
};

function Subscription(props) {
  const {
    transactions,
    classes,
    openAddBalanceDialog,
    selectSubscription
  } = props;

  useEffect(selectSubscription, [selectSubscription]);

  return (
    <Paper style = {{marginTop:130}}>
      
      <List disablePadding><Fab color="secondary" aria-label="add" className={classes.fabButton}>
        <AddIcon/>
      </Fab>
        <SubscriptionInfo openAddBalanceDialog={openAddBalanceDialog} />
        {/* <Divider className={classes.divider} /> */}
        {/* <SubscriptionTable transactions={transactions} /> */}
      </List>
    </Paper>
  );
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectSubscription: PropTypes.func.isRequired,
  openAddBalanceDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(Subscription);
