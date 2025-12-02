import {
  RESET_CHECKOUT, SET_CHECKOUT_PAYMENT_DETAILS, SET_CHECKOUT_SHIPPING_DETAILS,
  SET_SUBMITTING, SET_ERRORS, RESET_ERRORS
} from '@/constants/constants';

export const setShippingDetails = (details) => ({
  type: SET_CHECKOUT_SHIPPING_DETAILS,
  payload: details
});

export const setPaymentDetails = (details) => ({
  type: SET_CHECKOUT_PAYMENT_DETAILS,
  payload: details
});

export const resetCheckout = () => ({
  type: RESET_CHECKOUT
});

export const setSubmitting = (submitting) => ({
  type: SET_SUBMITTING
});

export const setErrors = (errors) => ({
  type: SET_ERRORS
});

export const resetErrors = () => ({
  type: RESET_ERRORS
});
