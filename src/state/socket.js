const initialState = {
  status: 'offline',
};

const SET_STATUS = 'SET_STATUS';

export const setWebsocketStatus = payload => ({
  type: SET_STATUS,
  payload,
});

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_STATUS:
      return { ...state, status: payload };
    default:
      return state;
  }
};
