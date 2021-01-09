import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import HeadSection from "./HeadSection";
import FeatureSection from "./FeatureSection";
import PricingSection from "./PricingSection";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTodoAction } from '../../../actions/addTodoAction';
function Home(props) {
  const { selectHome } = props;
  useEffect(() => {
    selectHome();
    
    
  }, [selectHome]);
  return (
    <Fragment>
      
      <HeadSection />
      <FeatureSection />
      <PricingSection />
    </Fragment>
  );
}

Home.propTypes = {
  selectHome: PropTypes.func.isRequired
};
const mapStateToProps = () => state => {
  return {
      items: state.todoList
  };
};
const mapDistachToProps = () => dispatch => {
  return bindActionCreators({ addTodo: addTodoAction }, dispatch);
};
export default connect(mapStateToProps,mapDistachToProps)(Home);
