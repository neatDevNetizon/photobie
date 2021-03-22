import React, { Fragment, useEffect , useState} from "react";
import PropTypes from "prop-types";
import EventList from "./EventList";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AppsIcon from '@material-ui/icons/Apps';

function Dashboard(props) {
  const {
    selectDashboard,
    CardChart,
    statistics,
  } = props;
  const[targetValue, setTargetValue]=useState("left")
  useEffect(selectDashboard, [selectDashboard]);
  function changeModeList(){
    setTargetValue("left")
  }
  function changeModeGrid(){
    setTargetValue("right")
  }
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
  return (
    <Fragment>
       <ButtonGroup size="large" color="secondary" aria-label="large outlined primary button group" style = {{marginLeft:"5%",marginTop:30,marginBottom:30,position:"relative"}}>
        <Button onClick = {changeModeList}><FormatListBulletedIcon/></Button>
        <Button onClick = {changeModeGrid}><AppsIcon/></Button>
      </ButtonGroup>
      <EventList CardChart={CardChart} data={statistics} viewMode = {targetValue}/>
  
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
