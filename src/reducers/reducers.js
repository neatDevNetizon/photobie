import { combineReducers } from 'redux';
import todoListReducer from './todoListReducer';

const rootReducer = combineReducers({
    userEmail: todoListReducer
});

export default rootReducer;