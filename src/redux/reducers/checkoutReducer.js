import {
  RESET_CHECKOUT, SET_CHECKOUT_PAYMENT_DETAILS, SET_CHECKOUT_SHIPPING_DETAILS, 
  RESET_ERRORS, SET_ERRORS, SET_SUBMITTING
} from '@/constants/constants';

const defaultState = {
  shipping: {},
  payment: {
    paymentMethod: '',
    type: 'paypal',
    name: '',
    cardnumber: '',
    expiry: '',
    ccv: ''
  },
  submitting: false,
  errors: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_CHECKOUT_SHIPPING_DETAILS:
      return {
        ...state,
        shipping: action.payload
      };
    case SET_CHECKOUT_PAYMENT_DETAILS:
      return {
        ...state,
        payment: action.payload
      };
    case SET_ERRORS:
      return {
        ...state,
        errors: action.payload
      };
    case RESET_ERRORS:
      return {
        ...state,
        errors: null
      };
    case RESET_CHECKOUT:
      return defaultState;
    case SET_SUBMITTING:
      return {
        ...state,
        submitting: action.payload
      }
    default:
      return state;
  }
};
