import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './App.css';
import WebsocketConnection from './components/WebsocketConnetion';
import rootReducer from './state';
import Book from './components/Book';
import Ticker from './components/Ticker';
import Trades from './components/Trades';
import StatusBar from './components/StatusBar';

class App extends Component {
  render() {
    return (
      <Provider
        store={createStore(
          rootReducer,
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__(),
        )}
      >
        <div className="App">
          <WebsocketConnection>
            {({ connect, disconnect, status }) => (
              <StatusBar
                connect={connect}
                disconnect={disconnect}
                status={status}
              />
            )}
          </WebsocketConnection>
          <Book />
          <Ticker />
          <Trades />
        </div>
      </Provider>
    );
  }
}

export default App;
