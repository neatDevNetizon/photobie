import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  withStyles,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Button,
  Divider
} from "@material-ui/core";
import EnhancedTableHead from "../../../shared/components/EnhancedTableHead";
import ColorfulChip from "../../../shared/components/ColorfulChip";
import awsToDateString from "../../../shared/functions/awsToDateString";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import currencyPrettyPrint from "../../../shared/functions/currencyPrettyPrint";
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import * as mutations from '../../../graphql/mutations';
import * as queries from '../../../graphql/queries';
import * as subscriptions from '../../../graphql/subscriptions';
import {API, graphqlOperation} from 'aws-amplify';
import { NonceProvider } from "react-select";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";

const styles = theme => ({
  tableWrapper: {
    overflowX: "auto",
    width: "100%"
  },
  blackBackground: {
    backgroundColor: theme.palette.primary.main
  },
  contentWrapper: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("xs")]: {
      padding: theme.spacing(2)
    },
    width: "100%"
  },
  dBlock: {
    display: "block !important"
  },
  dNone: {
    display: "none !important"
  },
  firstData: {
    paddingLeft: theme.spacing(3)
  },
  menuStyle: {
    boxShadow: 'none'
  },
  hidden: {
    display: 'none'
  },
  reasonShow: {
    justifyContent: "space-between",
    color: 'firebrick',
    fontSize: '13px',
    marginTop:'0px',
    display: 'block'
  }
});

const rows = [
  {
    id: "description",
    numeric: false,
    label: "Address"
  },
  {
    id: "balanceChange",
    numeric: false,
    label: "Status"
  },
  {
    id: "date",
    numeric: false,
    label: "Date"
  },
  {
    id: "date",
    numeric: false,
    label: ""
  },
];

const rowsPerPage = 25;

function SubscriptionTable(props) {
  const { transactions, theme, classes } = props;
  const [page, setPage] = useState(0);
  const [menuOpen,setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [requestId, setRequestId] = useState('');
  const [reqIndexId, setReqIndexId] = useState();
  const [reqUserId, setReqUserId] = useState('');
  const [reqStatus, setReqStatus] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [titleRequired, setTitleRequired] = useState('hidden');

  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );
  async function handleVerify(reqId, indexId, userId, status, event){
    setRequestId(reqId);
    setReqIndexId(indexId);
    setReqUserId(userId);
    setReqStatus(status);
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    return 0;
  }
  const handleClose = () => {
    setMenuOpen(false);
  }
  async function handleApprove() {
    if(reqStatus === 2) {
      setMenuOpen(false);
      return false;
    }
    console.log(requestId, reqIndexId, reqUserId, reqStatus);
    await API.graphql(graphqlOperation(mutations.updateRequestToAdmin, {input: {
      id: requestId,
      status: 2,
      read: 2,
      reason:''
    }}));
    setMenuOpen(false);
    await API.graphql(graphqlOperation(queries.listUserss, {filter: {
      id: {eq: reqUserId}
    }})).then(async(res) => {
      const venue = JSON.parse(res.data.listUserss.items[0].venues);
      let newVenueList = [];
      for(let i=0; i<venue.length;i++){
        if(i===reqIndexId){
          newVenueList.push({
            address: venue[i].address,
            detail: venue[i].detail,
            phone:venue[i].phone,
            eventype: venue[i].eventype,
            status: 2,
            reason:''
          })
        } else {
          newVenueList.push({
            address: venue[i].address,
            detail: venue[i].detail,
            phone:venue[i].phone,
            eventype: venue[i].eventype,
            status: venue[i].status,
            reason:''
          })
        }
      }
      await API.graphql(graphqlOperation(mutations.updateUsers, {input: {
        id: reqUserId,
        venues: JSON.stringify(newVenueList)
      }}));
    });
    
  }
  async function handleDecline() {
    if(reqStatus === 3) {
      setMenuOpen(false);
      return false;
    }
    setDialogOpen(true);
    setMenuOpen(false);
  }
  async function declineChange() {
    if(declineReason.length<5){
      setTitleRequired('reasonShow');
      return false;
    }
    setIsLoading(true);
    await API.graphql(graphqlOperation(mutations.updateRequestToAdmin, {input: {
      id: requestId,
      status: 3,
      read: 2,
      reason: declineReason,
    }}));
    await API.graphql(graphqlOperation(queries.listUserss, {filter: {
      id: {eq: reqUserId}
    }})).then(async(res) => {
      const venue = JSON.parse(res.data.listUserss.items[0].venues);
      let newVenueList = [];
      for(let i=0; i<venue.length;i++){
        if(i===reqIndexId){
          newVenueList.push({
            address: venue[i].address,
            detail: venue[i].detail,
            phone:venue[i].phone,
            eventype: venue[i].eventype,
            status: 3,
            reason: declineReason,
          })
        } else {
          newVenueList.push({
            address: venue[i].address,
            detail: venue[i].detail,
            phone:venue[i].phone,
            eventype: venue[i].eventype,
            status: venue[i].status,
            reason: venue[i].reason,
          })
        }
      }
      await API.graphql(graphqlOperation(mutations.updateUsers, {input: {
        id: reqUserId,
        venues: JSON.stringify(newVenueList)
      }}));
    });
    setTitleRequired('hidden');
    setDeclineReason('');
    setIsLoading(false);
    setDialogOpen(false);
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  }
  const closeListener = () => {
    setDialogOpen(false)
  }
  if (transactions.length > 0) {
    return (
      <div className={classes.tableWrapper}>
        <Table aria-labelledby="tableTitle">
          <EnhancedTableHead rowCount={transactions.length} rows={rows} />
          <TableBody>
            {transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction, index) => (
                <TableRow hover tabIndex={-1} key={index}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.firstData}
                  >
                    {transaction.addname}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {transaction.status === 1 ? (
                      <ColorfulChip
                        label='Pending'
                        color={theme.palette.error.dark}
                      />
                    ) :transaction.status === 2 ? (
                      <ColorfulChip
                        label='Verified'
                        color={theme.palette.secondary.main}
                      />
                    ):(
                      <ColorfulChip
                        label='Declined'
                        color={theme.palette.common.darkBlack}
                      />
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {awsToDateString(transaction.updatedAt)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <SettingsApplicationsIcon onClick = {(event)=>{
                      handleVerify(transaction.id, transaction.indexid, transaction.user, transaction.status, event);
                    }} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={handleChangePage}
          classes={{
            select: classes.dNone,
            selectIcon: classes.dNone,
            actions: transactions.length > 0 ? classes.dBlock : classes.dNone,
            caption: transactions.length > 0 ? classes.dBlock : classes.dNone
          }}
          labelRowsPerPage=""
        />
        <Menu
          open={menuOpen}
          id="fade-menu"
          anchorEl={anchorEl}
          onClose={handleClose}
          PaperProps={{
            style: {
            },
          }}
        >
          <MenuItem
            onClick = {()=>{
              handleApprove();
            }}
          >Approve</MenuItem>
          <Divider />
          <MenuItem
            onClick = {()=>{
              handleDecline();
            }}
          >Decline</MenuItem>
        </Menu>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          disableBackdropClick
          disableEscapeKeyDown
          className={classes.venueDialog}
        >
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h5">Reason of decline</Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              variant="outlined"
              fullWidth
              label="Enter the reason"
              value={declineReason}
              id="outlined-basic"
              autoFocus
              onChange={(event) => {
                setDeclineReason(event.target.value);
              }}
            />
            <div className={classes[titleRequired]}>
            * Please enter at least 5 characters
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeListener} variant="contained" disabled={isLoading} color="primary">
              Cancel
            </Button>
            <Button variant="contained" onClick={declineChange} disabled={isLoading} color="secondary" autoFocus>
              Save
              {' '}
              {isLoading && <ButtonCircularProgress color="nice" />}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return (
    <div className={classes.contentWrapper}>
      <HighlightedInformation>
        No transactions received yet.
      </HighlightedInformation>
    </div>
  );
}

SubscriptionTable.propTypes = {
  theme: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withStyles(styles, { withTheme: true })(SubscriptionTable);
