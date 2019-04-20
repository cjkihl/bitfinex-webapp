import React from 'react';
import { connect } from 'react-redux';
import { setBookPrec } from '../../state/settings';
import * as styles from './base.module.css';

const StatusBar = ({ connect, disconnect, status, precs, prec, setPrec }) => {
  let onClick = null;
  let text = 'Loading';
  let disabled = true;

  switch (status) {
    case 'online':
      onClick = disconnect;
      text = 'Disconnect';
      disabled = false;
      break;
    case 'offline':
      onClick = connect;
      text = 'Connect';
      disabled = false;
      break;
    default:
      break;
  }

  const precIndex = precs.indexOf(prec);
  const isHighestPrec = precIndex === precs.length - 1;
  const isLowestPrec = precIndex === 0;

  return (
    <div className={styles.base}>
      <span>Book Precision Level</span>
      <button
        className={styles.button}
        disabled={isLowestPrec}
        onClick={isLowestPrec ? null : () => setPrec(precs[precIndex - 1])}
      >
        -
      </button>
      <span>{prec}</span>
      <button
        className={styles.button}
        disabled={isHighestPrec}
        onClick={isHighestPrec ? null : () => setPrec(precs[precIndex + 1])}
      >
        +
      </button>
      <button className={styles.button} onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
};

export default connect(
  state => ({ prec: state.settings.bookPrec, precs: state.settings.bookPrecs }),
  dispatch => ({
    setPrec: prec => dispatch(setBookPrec(prec)),
  }),
)(StatusBar);
