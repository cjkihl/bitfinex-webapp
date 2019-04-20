import React from 'react';
import { connect } from 'react-redux';
import * as styles from './base.module.css';
import { sortByPrice, sortByPriceDesc, normalize } from '../../utils';

const Book = ({ asks, bids }) => {
  const askValues = Object.values(asks).sort(sortByPrice);
  const bidValues = Object.values(bids).sort(sortByPriceDesc);

  let accAskTotal = 0;
  for (const ask of askValues) {
    accAskTotal -= ask.amount;
    ask.total = accAskTotal;
  }

  let accBidTotal = 0;
  for (const bid of bidValues) {
    accBidTotal += bid.amount;
    bid.total = accBidTotal;
  }

  return (
    <div className={styles.grid}>
      <div className={styles.side}>
        <div className={styles.row}>
          <div className={styles.col}>Bids</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>Count</div>
          <div className={styles.col}>Amount</div>
          <div className={styles.col}>Total</div>
          <div className={styles.col}>Price</div>
        </div>
        {Object.values(bids)
          .sort(sortByPriceDesc)
          .map(({ count, amount, price, total }) => (
            <div className={styles.row} key={price}>
              <div
                className={styles.bidDepth}
                style={{
                  width:
                    Math.round(normalize(total, accBidTotal, 0) * 100) + '%',
                }}
              />
              <div className={styles.col}>{count}</div>
              <div className={styles.col}>{Math.round(amount * 100) / 100}</div>
              <div className={styles.col}>{Math.round(total * 100) / 100}</div>
              <div className={styles.col}>{Math.round(price * 100) / 100}</div>
            </div>
          ))}
      </div>
      <div className={styles.side}>
        <div className={styles.row}>
          <div className={styles.col}>Ask</div>
        </div>
        <div className={styles.row}>
          <div className={styles.col}>Price</div>
          <div className={styles.col}>Total</div>
          <div className={styles.col}>Amount</div>
          <div className={styles.col}>Count</div>
        </div>
        {askValues.map(({ count, amount, price, total }) => {
          return (
            <div className={styles.row} key={price}>
              <div
                className={styles.askDepth}
                style={{
                  width:
                    Math.round(normalize(total, accAskTotal, 0) * 100) + '%',
                }}
              />
              <div className={styles.col}>
                {Math.round((price * 100) / 100)}
              </div>
              <div className={styles.col}>{Math.round(total * 100) / 100}</div>
              <div className={styles.col}>
                {Math.round(amount * -100) / 100}
              </div>
              <div className={styles.col}>{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default connect(state => ({
  asks: state.data.book.asks,
  bids: state.data.book.bids,
}))(Book);
