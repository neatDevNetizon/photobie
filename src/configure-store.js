import { createStore } from 'redux';
import { countReducer } from './redux/reducer';

export const store = createStore(countReducer);