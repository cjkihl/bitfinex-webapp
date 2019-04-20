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
      <div className={styles.row}>
        <div className={styles.col}>Time</div>
        <div className={styles.col}>Price</div>
        <div className={styles.col}>Amount</div>
      </div>
      {Object.values(trades).map(({ id, mts, price, amount }) => (
        <div
          className={styles.row}
          key={id}
          style={{
            backgroundColor:
              amount > 0 ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)',
          }}
        >
          <div className={styles.col}>{format(parse(mts), 'hh:mm:ss')}</div>
          <div className={styles.col}>{Math.round(price * 100) / 100}</div>
          <div className={styles.col}>{Math.round(amount * 100) / 100}</div>
        </div>
      ))}
    </div>
  );
};

export default connect(state => ({
  trades: state.data.trades.tBTCUSD,
}))(Trades);
