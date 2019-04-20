import React from 'react';
import { connect } from 'react-redux';
import * as styles from './base.module.css';

const Book = ({ asks, bids }) => (
  <div className={styles.grid}>
    <div className={styles.side}>
      <div className={styles.row}>
        <div className={styles.col}>Ask</div>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>Count</div>
        <div className={styles.col}>Amount</div>
        <div className={styles.col}>Price</div>
      </div>
      {Object.values(asks).map(({ count, amount, price }) => (
        <div className={styles.row} key={price}>
          <div className={styles.col}>{count}</div>
          <div className={styles.col}>{amount}</div>
          <div className={styles.col}>{price}</div>
        </div>
      ))}
    </div>
    <div className={styles.side}>
      <div className={styles.row}>
        <div className={styles.col}>Bids</div>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>Price</div>
        <div className={styles.col}>Amount</div>
        <div className={styles.col}>Count</div>
      </div>
      {Object.values(bids).map(({ count, amount, price }) => (
        <div className={styles.row} key={price}>
          <div className={styles.col}>{Math.round(price * 100) / 100}</div>
          <div className={styles.col}>{Math.round(amount * 100) / 100}</div>
          <div className={styles.col}>{count}</div>
        </div>
      ))}
    </div>
  </div>
);

export default connect(state => ({
  asks: state.data.book.asks,
  bids: state.data.book.bids,
}))(Book);
