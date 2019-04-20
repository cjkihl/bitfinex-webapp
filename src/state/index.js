import { combineReducers } from 'redux';
import data from './data';
import socket from './socket';

export default combineReducers({ data, socket });
