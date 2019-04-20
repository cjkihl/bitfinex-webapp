import React from 'react';
import { connect } from 'react-redux';
import Btc from '../../icons/Btc';
import * as styles from './base.module.css';

const Ticker = ({ symbol }) =>
  symbol ? (
    <div className={styles.base}>
      <div className={styles.icon}>
        <Btc />
      </div>
      <div className={styles.info}>
        <p>BTC/USD</p>
        <p>VOL: {Math.round(symbol.volume)} BTC</p>
        <p>LOW: {symbol.low}</p>
      </div>
      <div className={styles.info}>
        <p>{symbol.lastPrice}</p>
        <p>
          CHANGE: {symbol.dailyChange} (
          {Math.round(symbol.dailyChangePerc * 10000) / 100}%)
        </p>
        <p>HIGH: {symbol.high}</p>
      </div>
    </div>
  ) : null;

export default connect(state => ({
  symbol: state.data.ticker.tBTCUSD,
}))(Ticker);
