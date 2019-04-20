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

export class WebsocketConnection extends React.Component {
  componentDidMount() {
    this.connect();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bookPrec !== nextProps.bookPrec) {
      this.refreshBook({ prec: nextProps.bookPrec });
    }
  }

  connect = () => {
    if (this.props.isConnected) {
      console.warn('Already connected');
      return;
    }

    console.log('Connecting to Websocket');
    this.props.setStatus('loading');
    this.socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    this.socket.addEventListener('open', event => {
      console.log('Connected', event);
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
          prec: this.props.bookPrec,
          freq: 'F1',
          len: '25',
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
        switch (msg.event) {
          case 'subscribed':
            this.onChannelSubscribed(msg);
            break;
          case 'error': {
            console.warn(msg.code, msg.msg);
            break;
          }
          default:
            break;
        }
        if (msg.event === 'subscribed') {
        }
        return;
      }

      if (Array.isArray(msg)) {
        this.onDataReceived(msg);
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
            // Todo support for more symbols
            this.props.replaceTradesData('tBTCUSD', data);
          } else {
            // Todo support for more symbols
            this.props.updateTradesData('tBTCUSD', data);
          }
        }
        break;
      default:
        console.warn('Message for unknown channel received', chanId);
    }
  };

  refreshBook = ({ prec }) => {
    this.socket.send(
      JSON.stringify({
        event: 'unsubscribe',
        chanId: this.props.book.channel.chanId,
      }),
    );

    this.socket.send(
      JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD',
        prec,
        freq: 'F1',
        len: '25',
      }),
    );
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
    bookPrec: state.settings.bookPrec,
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
