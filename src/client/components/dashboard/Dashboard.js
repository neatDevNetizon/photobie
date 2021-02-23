import React, { Fragment, useEffect , useState, useLayoutEffect} from "react";
import PropTypes from "prop-types";
import StatisticsArea from "./StatisticsArea";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AppsIcon from '@material-ui/icons/Apps';
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

  // useLayoutEffect(()=>{
  //   changeModeList();
  // },[])
  useEffect(()=>{
    changeModeList();
  },[])
  function changeModeList(){
    if(window.innerWidth<700){
      setTargetValue("middle")
    }
    else {
      setTargetValue("left")
    }
  }
  function changeModeGrid(){
    setTargetValue("right")
  }
  return (
    <Fragment>
       
       <ButtonGroup size="large" color="secondary" aria-label="large outlined primary button group" style = {{marginLeft:"5%",marginTop:30, marginBottom:30,}}>
        <Button onClick = {changeModeList}><FormatListBulletedIcon/></Button>
        <Button onClick = {changeModeGrid}><AppsIcon/></Button>
      </ButtonGroup>
       
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
