import React, { Fragment, useEffect , useState} from "react";
import PropTypes from "prop-types";
import StatisticsArea from "./StatisticsArea";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
function Dashboard(props) {
  const {
    selectDashboard,
    CardChart,
    statistics,
    toggleAccountActivation,
    pushMessageToSnackbar,
    targets,
    setTargets,
    isAccountActivated,
  } = props;
  const[targetValue, setTargetValue]=useState("left")
  useEffect(selectDashboard, [selectDashboard]);
  function changeMode(e){

    if(targetValue == "left"){
      setTargetValue("right")
    }else {
      setTargetValue("left")
    }
    
  }
  return (
    <Fragment>
       <FormControl component="fieldset" >

        <FormControlLabel
            value={targetValue}
            label="Change Mode"
            control={<Switch color="primary" onChange = {changeMode} />}
            labelPlacement="start"
          />
          {/* <Typography style = {{marginTop:7,marginLeft:10}}>Grid Mode</Typography> */}
       </FormControl>
      <StatisticsArea CardChart={CardChart} data={statistics} viewMode = {targetValue}/>
  
    </Fragment>
  );
}

Dashboard.propTypes = {
  CardChart: PropTypes.elementType,
  statistics: PropTypes.object.isRequired,
  toggleAccountActivation: PropTypes.func,
  pushMessageToSnackbar: PropTypes.func,
  targets: PropTypes.arrayOf(PropTypes.object).isRequired,
  setTargets: PropTypes.func.isRequired,
  isAccountActivated: PropTypes.bool.isRequired,
  selectDashboard: PropTypes.func.isRequired,
};

export default Dashboard;
