import { combineReducers } from 'redux';
import data from './data';
import socket from './socket';
import settings from './settings';

export default combineReducers({ data, socket, settings });
