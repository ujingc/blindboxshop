/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-else-return */
import { CustomInput } from '@/components/formik';
import { Field, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';

const CreditPayment = () => {
  const { values, touched, errors, setValues } = useFormikContext();
  const [cardNumberError, setCardNumberError] = useState(null);
  const [cardExpirationError, setCardExpirationError] = useState(null);
  const [cardCVCError, setCardCVCError] = useState(null);
  const [cardBrand, setCardBrand] = useState(null); // e.g., 'visa', 'mastercard', 'amex', etc.

  const collapseContainerRef = useRef(null);
  const cardInputRef = useRef(null);
  const containerRef = useRef(null);
  const checkboxContainerRef = useRef(null);
  console.log(cardBrand)
  const toggleCollapse = () => {
    const cn = containerRef.current;
    const cb = checkboxContainerRef.current;
    const cl = collapseContainerRef.current;

    if (cb && cn && cl) {
      if (values.type === 'credit') {
        // cardInputRef.current.focus();
        // cn.style.height = `${cb.offsetHeight + cl.offsetHeight}+100px`;
      } else {
        // cardInputRef.current.blur();
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
                <img
                  src={`/images/creditcard.png`}
                  alt={cardBrand}
                  className="payment-img"
                />
              </div>
            </label>
          </div>
        </div>

        {/* --- Actual Credit Card Input Fields (ONLY renders if 'credit' is selected) --- */}
        {values.type === 'credit' && (
          <div className="checkout-collapse-sub" ref={collapseContainerRef}>
            <div className="checkout-field margin-0">
              <div className="checkout-fieldset">
              </div>
              <div className="checkout-fieldset stripe-element-container">
                {/* Card Number */}
                <div className="checkout-field">
                  <label className='checkout-label'>Card Number</label> {/* Your custom label */}
                  <div className={`stripe-input-container ${cardNumberError ? 'is-invalid':''}`}>
                    <CardNumberElement
                      options={{
                        style: {
                          base: {border: '1px solid #c5c5c5'},
                          invalid: { color: '#df1b41', fontSize: '14px', fontWeight: 'bold', border: '1px'}
                          }
                      }}
                      onChange={(event) => {
                        if (event.error) {
                          setCardNumberError(event.error.message);
                        } else {
                          setCardNumberError(null);
                        }
                        setCardBrand(event.brand)
                      }}
                    />
                    {cardBrand && cardBrand !== 'unknown' ? (
                      <img
                        src={`/images/card-brands/${cardBrand}.svg`}
                        alt={cardBrand}
                        className="detected-card-brand-icon"
                      />
                    ): (
                      <div className='card-brand-icons-display'>
                        <img
                          src={`/images/card-brands/mastercard.svg`}
                          alt={cardBrand}
                          className="card-brand-icon"
                        />
                        <img
                          src={`/images/card-brands/visa.svg`}
                          alt={cardBrand}
                          className="card-brand-icon"
                        />
                        <img
                          src={`/images/card-brands/amex.svg`}
                          alt={cardBrand}
                          className="card-brand-icon"
                        />
                        <img
                          src={`/images/card-brands/unionpay.svg`}
                          alt={cardBrand}
                          className="card-brand-icon"
                        />
                      </div>
                    )}


                  </div>
                  {cardNumberError && <div className="card-error">{cardNumberError}</div>}
                </div>
              </div>
              <div className="checkout-fieldset stripe-element-container"> {/* Grouping Expiry and CVC */}
                {/* Expiration Date */}
                <div className="checkout-field">
                  <label className='checkout-label'>Expiration Date</label> {/* Your custom label */}
                  <div className={`stripe-input-container ${cardExpirationError ? 'is-invalid':''}`}>
                    <CardExpiryElement
                      options={{
                        style: {
                          base: { fontSize: '14px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                          invalid: { color: '#df1b41' },
                        },
                      }}
                      onChange={(event) => {
                        if (event.error) {
                          setCardExpirationError(event.error.message);
                        } else {
                          setCardExpirationError(null);
                        }
                      }}
                    />
                  </div>
                  {cardExpirationError && <div className="card-error">{cardExpirationError}</div>}
                </div>
              </div>
              {/* Security Code (CVC) */}
              <div className="checkout-field stripe-element-container">
                <label className='checkout-label'>Security Code (CVC)</label> {/* Your custom label */}
                <div className={`stripe-input-container ${cardCVCError ? 'is-invalid':''}`}>
                  <CardCvcElement
                    options={{
                      style: {
                        base: { fontSize: '14px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                        invalid: { color: '#df1b41' },
                      },
                    }}
                    onChange={(event) => {
                      if (event.error) {
                        setCardCVCError(event.error.message);
                      } else {
                        setCardCVCError(null);
                      }
                    }}
                  />
                </div>
                {cardCVCError && <div className="card-error">{cardCVCError}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreditPayment;
