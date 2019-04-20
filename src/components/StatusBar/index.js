import React from 'react';

export default ({ connect, disconnect, status }) => {
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

  return (
    <div>
      <button onClick={onClick} disabled={disabled}>
        {text}
      </button>
    </div>
  );
};
