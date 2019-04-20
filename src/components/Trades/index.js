import React from 'react';
import { connect } from 'react-redux';
import { parse, format } from 'date-fns';
import * as styles from './base.module.css';

const Trades = ({ trades }) => {
  if (!trades) return null;

  return (
    <div className={styles.grid}>
      <div className={styles.row}>
        <div className={styles.col}>Trades</div>
      </div>
      {Object.values(trades).map(trade => (
        <div className={styles.row} key={trade.id}>
          <div className={styles.col}>
            {format(parse(trade.mts), 'hh:mm:ss')}
          </div>
          <div className={styles.col}>
            {Math.round(trade.price * 100) / 100}
          </div>
          <div className={styles.col}>
            {Math.round(trade.amount * 100) / 100}
          </div>
        </div>
      ))}
    </div>
  );
};

export default connect(state => ({
  trades: state.data.trades.tBTCUSD,
}))(Trades);
