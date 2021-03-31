import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  withStyles
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

  const handleChangePage = useCallback(
    (_, page) => {
      setPage(page);
    },
    [setPage]
  );
  async function handleVerify(reqId, indexId, userId, status){
    console.log(reqId, indexId, status);
    await API.graphql(graphqlOperation(mutations.updateRequestToAdmin, {input: {
      id: reqId,
      status: status===1?2:1,
      read: 2
    }}));
    await API.graphql(graphqlOperation(queries.listUserss, {filter: {
      id: {eq: userId}
    }})).then(async(res) => {
      const venue = JSON.parse(res.data.listUserss.items[0].venues);
      let newVenueList = [];
      for(let i=0; i<venue.length;i++){
        if(i===indexId){
          newVenueList.push({
            address: venue[i].address,
            detail: venue[i].detail,
            status: status===1?2:1
          })
        } else {
          newVenueList.push({
            address: venue[i].address,
            detail: venue[i].detail,
            status: venue[i].status,
          })
        }
      }
      await API.graphql(graphqlOperation(mutations.updateUsers, {input: {
        id: userId,
        venues: JSON.stringify(newVenueList)
      }}));
    })
    
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
                    ) : (
                      <ColorfulChip
                        label='Verified'
                        color={theme.palette.secondary.main}
                      />
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {awsToDateString(transaction.updatedAt)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <SettingsApplicationsIcon onClick = {()=>{
                      handleVerify(transaction.id, transaction.indexid, transaction.user, transaction.status);
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
