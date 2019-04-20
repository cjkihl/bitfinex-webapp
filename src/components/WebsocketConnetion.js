import React from 'react';
import { connect } from 'react-redux';
import {
  setBookChannel,
  setTickerChannel,
  setTradesChannel,
  updateBookData,
  replaceBookData,
  setTickerData,
  updateTradesData,
  replaceTradesData,
} from '../state/data';
import { setWebsocketStatus } from '../state/socket';

const channels = {};

export class WebsocketConnection extends React.Component {
  componentDidMount() {
    this.connect();
  }

  connect = () => {
    if (this.props.isConnected) {
      console.warn('Already connected');
      return;
    }
    console.log('Connecting to Websocket');
    this.props.setStatus('loading');
    // Connect to websocket
    // Create WebSocket connection.
    this.socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    this.socket.addEventListener('open', event => {
      // Dispatch Connection opened
      console.log('OPEN', event);
      this.props.setStatus('online');

      this.socket.send(
        JSON.stringify({
          event: 'subscribe',
          channel: 'ticker',
          symbol: 'tBTCUSD',
        }),
      );

      this.socket.send(
        JSON.stringify({
          event: 'subscribe',
          channel: 'book',
          symbol: 'tBTCUSD',
        }),
      );

      this.socket.send(
        JSON.stringify({
          event: 'subscribe',
          channel: 'trades',
          symbol: 'tBTCUSD',
        }),
      );
    });

    this.socket.onerror = event => {
      console.error('WebSocket error observed:', event);
      this.props.setStatus('offline');
    };

    this.socket.onclose = event => {
      console.log('Websocket is closed');
      this.props.setStatus('offline');
    };

    // Listen for messages
    this.socket.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.event) {
        if (msg.event === 'subscribed') {
          channels[msg.chanId] = msg.channel;
          this.onChannelSubscribed(msg);
        }
        return;
      }

      if (Array.isArray(msg)) {
        this.onDataReceived(msg);
      } else {
        console.log('Not array', msg);
      }
    });
  };

  disconnect = () => {
    if (this.socket) {
      this.props.setStatus('loading');
      this.socket.close();
    }
  };

  onChannelSubscribed = data => {
    switch (data.channel) {
      case 'book': {
        this.props.setBookChannel(data);
        break;
      }
      case 'ticker': {
        this.props.setTickerChannel(data);
        break;
      }
      case 'trades': {
        this.props.setTradesChannel(data);
        break;
      }
      default:
        console.warn('Unknown channel', data.channel);
    }
  };

  onDataReceived = msg => {
    const { ticker, book, trades } = this.props;
    const [chanId, data] = msg;
    switch (chanId) {
      case book.channel.chanId:
        if (Array.isArray(data) && data.length > 0) {
          if (Array.isArray(data[0])) {
            this.props.replaceBookData(data);
          } else {
            this.props.updateBookData(data);
          }
        }
        break;
      case ticker.channel.chanId:
        if (Array.isArray(data)) {
          // Todo support for more symbols
          this.props.setTickerData('tBTCUSD', data);
        }
        break;
      case trades.channel.chanId:
        if (Array.isArray(data) && data.length > 0) {
          if (Array.isArray(data[0])) {
            console.log('Replace trades', data);
            // Todo support for more symbols
            this.props.replaceTradesData('tBTCUSD', data);
          } else {
            console.log('Update trade', data);
            // Todo support for more symbols
            this.props.updateTradesData('tBTCUSD', data);
          }
        }
        break;
      default:
        console.warn('Message for unknown channel received', chanId);
    }
  };
  render = () =>
    this.props.children &&
    this.props.children({
      connect: this.connect,
      disconnect: this.disconnect,
      status: this.props.status,
    });
}

export default connect(
  state => ({
    ticker: state.data.ticker,
    book: state.data.book,
    trades: state.data.trades,
    status: state.socket.status,
  }),
  dispatch => ({
    setBookChannel: data => dispatch(setBookChannel(data)),
    setTickerChannel: data => dispatch(setTickerChannel(data)),
    setTradesChannel: data => dispatch(setTradesChannel(data)),
    updateBookData: data => dispatch(updateBookData(data)),
    replaceBookData: data => dispatch(replaceBookData(data)),
    updateTradesData: (symbol, data) =>
      dispatch(updateTradesData(symbol, data)),
    replaceTradesData: (symbol, data) =>
      dispatch(replaceTradesData(symbol, data)),
    setTickerData: (symbol, data) => dispatch(setTickerData(symbol, data)),
    setStatus: status => dispatch(setWebsocketStatus(status)),
  }),
)(WebsocketConnection);
