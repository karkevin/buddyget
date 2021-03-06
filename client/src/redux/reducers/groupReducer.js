const initialState = {
  group: {},
  loading: false
};

const updateTransaction = (state, payload) => {
  const group = { ...state.group };

  const updated = group.transactions.map(transaction => {
    const clone = JSON.parse(JSON.stringify(transaction));
    if (clone._id === payload._id) {
      clone.money = payload.money;
    }
    return clone;
  });

  group.transactions = updated;

  return group;
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "GET_GROUP":
    case "REGISTER_GROUP_SUCCESS":
      return {
        ...state,
        group: action.payload,
        loading: false
      };
    case "REGISTER_GROUP_FAIL":
      return {
        ...state,
        group: {},
        loading: false
      };
    case "GROUP_LOADING":
      return {
        ...state,
        loading: true
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        group: updateTransaction(state, action.payload),
        loading: true
      };
    default:
      return state;
  }
}
