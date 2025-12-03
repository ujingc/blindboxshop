/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-else-return */
import { CustomInput } from '@/components/formik';
import { Field, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

const CreditPayment = () => {
  const { values, touched, errors, setValues } = useFormikContext();
  const [cardError, setCardError] = useState(null);
  const collapseContainerRef = useRef(null);
  const cardInputRef = useRef(null);
  const containerRef = useRef(null);
  const checkboxContainerRef = useRef(null);

  const toggleCollapse = () => {
    const cn = containerRef.current;
    const cb = checkboxContainerRef.current;
    const cl = collapseContainerRef.current;

    if (cb && cn && cl) {
      if (values.type === 'credit') {
        cardInputRef.current.focus();
        cn.style.height = `${cb.offsetHeight + cl.offsetHeight}px`;
      } else {
        cardInputRef.current.blur();
        cn.style.height = `${cb.offsetHeight}px`;
      }
    }
  };

  useEffect(() => {
    toggleCollapse();
  }, [values.type]);

  const onCreditModeChange = (e) => {
    if (e.target.checked) {
      setValues({ ...values, type: 'credit', paymentMethod: 'credit' });
      toggleCollapse();
    }
  };

  const handleOnlyNumberInput = (e) => {
    const { key } = e.nativeEvent;
    if (/\D/.test(key) && key !== 'Backspace') {
      e.preventDefault();
    }
  };
  return (
    <>
      <h3 className="text-center">Payment</h3>
      <br />
      <span className="d-block padding-s">Payment Option</span>
      <div
        ref={containerRef}
        className={`checkout-fieldset-collapse ${values.type === 'credit' ? 'is-selected-payment' : ''}`}
      >
        {/* ---- RADIO BUTTON TOGGLER for Credit Card ------ */}
        <div className="checkout-field margin-0">
          <div className="checkout-checkbox-field" ref={checkboxContainerRef}>
            <input
              checked={values.type === 'credit'}
              id="modeCredit"
              name="type" // This should match the Formik field name for payment method selection
              onChange={(e) => onCreditModeChange(e, 'type', 'credit')} // Update Formik state directly
              type="radio"
            />
            <label
              className="d-flex w-100"
              htmlFor="modeCredit"
            >
              <div className="d-flex-grow-1 margin-left-s">
                <h4 className="margin-0">Credit Card</h4>
                <span className="text-subtle d-block margin-top-s">
                  Pay with Visa, Master Card and other debit or credit card
                </span>
              </div>
              <div className="d-flex">
                <div className="payment-img payment-img-visa" />
                &nbsp;
                <div className="payment-img payment-img-mastercard" />
              </div>
            </label>
          </div>
        </div>

        {/* --- Actual Credit Card Input Fields (ONLY renders if 'credit' is selected) --- */}
        {values.type === 'credit' && (
          <div className="checkout-collapse-sub" ref={collapseContainerRef}>
            <span className="d-block padding-s text-center">Accepted Cards</span>
            <div className="checkout-cards-accepted d-flex-center">
              <div className="payment-img payment-img-visa" title="Visa" />
              <div className="payment-img payment-img-express" title="American Express" />
              <div className="payment-img payment-img-mastercard" title="Master Card" />
              <div className="payment-img payment-img-maestro" title="Maestro" />
              <div className="payment-img payment-img-discover" title="Discover" />
            </div>
            <br />
            <div className="checkout-field margin-0">
              <div className="checkout-fieldset">

                {/* --- Name on Card (Your existing Formik Field) --- */}
                <div className="checkout-field">
                  {/* Ensure this label's 'htmlFor' matches the 'id' of the Field */}
                  {/* <label htmlFor="cardHolderNameInput">* Name on Card</label> */}
                  <Field
                    name="cardName" // IMPORTANT: This should match your Formik state (e.g., initialValues.cardName)
                    id="cardHolderNameInput" // IMPORTANT: Added ID to match label's htmlFor
                    type="text"
                    label="* Name on Card"
                    placeholder="Jane Doe"
                    component={CustomInput} // Using your CustomInput component
                    style={{ textTransform: 'capitalize' }}
                    inputRef={cardInputRef}
                  />
                  {/* Display Formik validation errors for cardName */}
                  {touched.cardName && errors.cardName && <div className="error-message">{errors.cardName}</div>}
                </div>

              </div>
              <div className="checkout-fieldset stripe-element-container">
                {/* Card Number */}
                <div className="checkout-field">
                  <label className='checkout-label'>Card Number</label> {/* Your custom label */}
                  <CardNumberElement
                    options={{
                      style: {invalid: { color: '#9e2146' }},
                    }}
                    onChange={(event) => {
                      if (event.error) {
                        setCardError(event.error.message);
                      } else {
                        setCardError(null);
                      }
                    }}
                  />
                  {cardError && <div className="card-error">{cardError}</div>}
                </div>
              </div>
              <div className="checkout-fieldset stripe-element-container"> {/* Grouping Expiry and CVC */}
                {/* Expiration Date */}
                <div className="checkout-field">
                  <label className='checkout-label'>Expiration Date</label> {/* Your custom label */}
                  <CardExpiryElement
                    options={{
                      style: {
                        base: { fontSize: '14px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                        invalid: { color: '#9e2146' },
                      },
                    }}
                    onChange={(event) => {
                      if (event.error) {
                        setCardError(event.error.message);
                      } else {
                        setCardError(null);
                      }
                    }}
                  />
                </div>
              </div>
              {/* Security Code (CVC) */}
              <div className="checkout-field stripe-element-container">
                <label className='checkout-label'>Security Code (CVC)</label> {/* Your custom label */}
                <CardCvcElement
                  options={{
                    style: {
                      base: { fontSize: '14px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                      invalid: { color: '#9e2146' },
                    },
                  }}
                  onChange={(event) => {
                    if (event.error) {
                      setCardError(event.error.message);
                    } else {
                      setCardError(null);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreditPayment;
