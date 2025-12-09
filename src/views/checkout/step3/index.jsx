import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { displayActionMessage } from '@/helpers/utils';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import CreditPayment2 from './CreditPayment2';
import Total from './Total';
import { setSubmitting, setErrors, resetCheckout } from '@/redux/actions/checkoutActions';
import { useDispatch, useSelector } from 'react-redux';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Name should be at least 4 characters.')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name can only contain letters, spaces, hyphens, or apostrophes')
    .required('Name is required'),
  cardnumber: Yup.string()
    .min(13, 'Card number should be 13-19 digits long')
    .max(19, 'Card number should only be 13-19 digits long')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name can only contain letters, spaces, hyphens, or apostrophes')
    .required('Card number is required.'),
  expiry: Yup.date()
    .required('Credit card expiry is required.'),
  ccv: Yup.string()
    .min(3, 'CCV length should be 3-4 digit')
    .max(4, 'CCV length should only be 3-4 digit')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name can only contain letters, spaces, hyphens, or apostrophes')
    .required('CCV is required.'),
  type: Yup.string().required('Please select paymend mode'),
  country: Yup.string().required('Please select your country.'),
  cardName: Yup.string()
  .required('Name on card is required')
  .min(2, 'Name is too short')
  .max(50, 'Name is too long')
  .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name can only contain letters, spaces, hyphens, or apostrophes')
  .required('Card name is required')
});

const Payment = ({ payment, subtotal, error }) => {
  useDocumentTitle('Check Out Final Step | Salinaka');
  useScrollTop();
  const { shipping } = useSelector((state) => ({
    shipping: state.checkout.shipping,
  }));

  const initFormikValues = {
    name: payment.name || '',
    cardnumber: payment.cardnumber || '',
    expiry: payment.expiry || '',
    ccv: payment.ccv || '',
    type: 'credit',
    cardName: '',
    country: 'US',
    paymentMethod: 'credit'
  };

  const app = getApp(); // Get your initialized Firebase app instance
  const functions = getFunctions(app); // Get your Firebase Functions instance

  // 2. Call the Stripe hooks INSIDE your component
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(null); // State to display Stripe.js errors
  const dispatch = useDispatch();

  const onConfirm = async (values, actions) => {
    dispatch(setSubmitting(true)); // Disable the submit button
    setErrors(null); // Clear any previous card errors
    console.log('called onConfirm method')
    try {
      if (values.paymentMethod === 'credit') {
        // --- CREDIT CARD PAYMENT FLOW ---
        // Basic check if Stripe.js is loaded
        if (!stripe || !elements) {
          throw new Error("Stripe.js has not loaded. Please try again.");
        }
        console.log('paymentMethod is credit, value: ', values.paymentMethod)
        // Get a reference to the CardElement
        const cardElement = elements.getElement(CardNumberElement);
        console.log("CardNumberElement instance:", CardNumberElement);

        if (!cardElement) { // Explicitly check if it's null before proceeding
          throw new Error("Credit card input is not ready. Please try again.");
        }

        // 3. Create a PaymentMethod ID using Stripe.js
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement, // The secure CardElement
          billing_details: {
            name: values.cardName,
            email: 'your-user-email@example.com', // Dynamically get user's email if available
            address: { // Optional: if you collect billing address separately
                line1: shipping.address.addressline1,
                line2: shipping.address.addressline2,
                city: shipping.address.city,
                country: shipping.address.country,
                postal_code: shipping.address.zipcode,
            }
          },
        });

        if (error) {
          setCardError(error.message); // Display error to the user
          throw new Error(error.message); // Propagate error for general catch block
        }
        if (!paymentMethod) {
            throw new Error("Failed to create payment method. Please check card details.");
        }

        const paymentMethodId = paymentMethod.id; // This is your secure token!

        // 4. Call your Firebase Cloud Function with the PaymentMethod ID
        const processStripePayment = httpsCallable(functions, 'processStripePayment');
        const response = await processStripePayment({
          paymentMethodId: paymentMethodId,
          amount: values.totalAmount, // Send total amount (e.g., 100.00 for $100)
          currency: 'usd', // Or your desired currency
          orderItems: values.cartItems, // Your detailed cart items
          shippingInfo: values.shippingAddress, // Shipping details
          // Add any other relevant data your Cloud Function expects
        });

        if (response.data && response.data.success) {
          console.log('Payment successful! Order ID:', response.data.orderId);
          displayActionMessage('Payment successful! Your order has been placed.', 'success');
          dispatch(resetCheckout()); // Clear the form or navigate away
          // Redirect user to an order confirmation page or update UI
        } else {
          // Cloud Function indicated a payment failure (e.g., card declined)
          throw new Error(response.data.error || 'Payment failed from server.');
        }

      } else {
        throw new Error('Please select a payment method.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      displayActionMessage(`Payment failed: ${error.message}`, 'error');
      setErrors({ submit: error.message }); // Display error in Formik's general error area
    } finally {
      dispatch(setSubmitting(false)); // Re-enable the submit button
    }
  };


  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        disabled={true}
        initialValues={initFormikValues}
        validateOnChange
        // validationSchema={FormSchema}
        onSubmit={onConfirm}
      >
        {() => (
          <Form className="checkout-step-3">
            <CreditPayment2 />
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string
  }).isRequired,
  subtotal: PropType.number.isRequired,
  error: PropType.string
};

export default withCheckout(Payment);
