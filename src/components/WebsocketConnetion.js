import React from 'react';
import { connect } from 'react-redux';
import {
  setBookChannel,
  setTickerChannel,
  setTradesChannel,
  updateBookData,
  replaceBookData,
} from '../state/data';

const channels = {};

export class WebsocketConnection extends React.Component {
  componentDidMount() {
    // Connect to websocket
    // Create WebSocket connection.
    const socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    socket.addEventListener('open', event => {
      // Dispatch Connection opened

      //   socket.send(
      //     JSON.stringify({
      //       event: 'subscribe',
      //       channel: 'ticker',
      //       symbol: 'tBTCUSD',
      //     }),
      //   );

      socket.send(
        JSON.stringify({
          event: 'subscribe',
          channel: 'book',
          symbol: 'tBTCUSD',
        }),
      );

      //   socket.send(
      //     JSON.stringify({
      //       event: 'subscribe',
      //       channel: 'trades',
      //       symbol: 'tBTCUSD',
      //     }),
      //   );
    });

    // Listen for messages
    socket.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.event) {
        console.log(msg);
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

      const [chanId, data] = msg;
      const chan = channels[chanId];
      if (chan !== 'book') {
        console.log('ChanID', channels[chanId], 'data', data, msg);
      }
    });
  }

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
      default:
        console.warn('Message for unknown channel received', chanId);
    }
  };
  render = () => null;
}

export default connect(
  state => ({
    ticker: state.data.ticker,
    book: state.data.book,
    trades: state.data.trades,
  }),
  dispatch => ({
    setBookChannel: data => dispatch(setBookChannel(data)),
    setTickerChannel: data => dispatch(setTickerChannel(data)),
    setTradesChannel: data => dispatch(setTradesChannel(data)),
    updateBookData: data => dispatch(updateBookData(data)),
    replaceBookData: data => dispatch(replaceBookData(data)),
  }),
)(WebsocketConnection);
