import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import logo from './logo.svg';
import './App.css';
import WebsocketConnection from './components/WebsocketConnetion';
import rootReducer from './state';

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
          <WebsocketConnection />
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </Provider>
    );
  }
}

export default App;
