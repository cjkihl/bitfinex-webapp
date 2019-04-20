const initialState = {
  bookPrec: 'P2',
  bookPrecs: ['P0', 'P1', 'P2', 'P3', 'P4'],
  currency: 'tBTCUSD',
};

const BOOK_SET_PREC = 'BOOK_SET_PREC';

export const setBookPrec = payload => ({
  type: BOOK_SET_PREC,
  payload,
});

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case BOOK_SET_PREC:
      return { ...state, bookPrec: payload };
    default:
      return state;
  }
};
