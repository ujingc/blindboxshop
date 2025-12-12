/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-else-return */
import { CustomInput } from '@/components/formik';
import { Field, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import COUNTRIES from '@/constants/countries'
const CreditPayment = () => {
  const { values, touched, errors, setValues } = useFormikContext();
  const [cardError, setCardError] = useState(null);
  const [cardNumberError, setCardNumberError] = useState(null);
  const [cardExpirationError, setCardExpirationError] = useState(null);
  const [cardCVCError, setCardCVCError] = useState(null);
  const [cardBrand, setCardBrand] = useState(null); // e.g., 'visa', 'mastercard', 'amex', etc.

  const [isCardNumberFocused, setIsCardNumberFocused] = useState(false);
  const [isCardExpiryFocused, setIsCardExpiryFocused] = useState(false);
  const [isCardCvcFocused, setIsCardCvcFocused] = useState(false);

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
      <span className="d-block padding-s text-fontSize-15">Payment Option</span>
      <div
        ref={containerRef}
        className={`checkout-payment-section checkout-fieldset-collapse ${values.type === 'credit' ? 'is-selected-payment' : ''}`}
      >
      {/* ---- RADIO BUTTON TOGGLER for Credit Card ------ */}
      <div className="checkout-checkbox-field" ref={checkboxContainerRef}>
        <input
          checked={values.type === 'credit'}
          id="modeCredit"
          name="type"
          onChange={(e) => onCreditModeChange(e, 'type', 'credit')}
          type="radio"
        />
        <label
          className="d-flex w-100"
          htmlFor="modeCredit"
        >
          <div className="d-flex-grow-1 margin-left-s">
            <h4 className="margin-0">Credit Card</h4>
          </div>
        </label>
      </div>

      {/* --- Actual Credit Card Input Fields (ONLY renders if 'credit' is selected) --- */}
      {values.type === 'credit' && (
        <div className="checkout-collapse-sub" ref={collapseContainerRef}>
          {/* Card Number Field */}
          <div className="checkout-field">
            <label className='checkout-label'>Card Number</label>
            <div className={`stripe-input-container ${cardNumberError ? 'is-invalid' : ''} ${isCardNumberFocused ? 'is-focus' : ''}`}>
              <CardNumberElement
                onFocus={() => setIsCardNumberFocused(true)}
                onBlur={() => setIsCardNumberFocused(false)}
                options={{
                  style: {
                    base: { border: '1px solid #c5c5c5' }, // Keep this here for the actual Stripe iframe styling
                    invalid: { color: '#df1b41', fontSize: '14px', fontWeight: 'bold', border: '1px' } // And this
                  }
                }}
                onChange={(event) => {
                  if (event.error) {
                    setCardNumberError(event.error.message);
                    setCardError(event.error.message);
                  } else {
                    setCardNumberError(null);
                    setCardError(null);
                  }
                  setCardBrand(event.brand);
                }}
              />
              {cardBrand && cardBrand !== 'unknown' ? (
                <img
                  src={`/assets/images/${cardBrand}.svg`}
                  alt={cardBrand}
                  className="card-icon"
                />
              ) : (
                <div className='card-brand-icons-display'>
                  <img src={`/images/card-brands/mastercard.svg`} alt="Mastercard" className="card-brand-icon" />
                  <img src={`/images/card-brands/visa.svg`} alt="Visa" className="card-brand-icon" />
                  <img src={`/images/card-brands/amex.svg`} alt="Amex" className="card-brand-icon" />
                  <img src={`/images/card-brands/unionpay.svg`} alt="UnionPay" className="card-brand-icon" />
                </div>
              )}
            </div>
          </div>

          {/* Expiration Date and Security Code Group */}
          <div className="checkout-fieldset checkout-fieldset__stripe-group">
            {/* Expiration Date */}
            <div className="checkout-field">
              <label className='checkout-label'>Expiration Date (MM/YY)</label>
              <div className={`stripe-input-container stripe-input-container--left ${cardExpirationError ? 'is-invalid' : ''} ${isCardExpiryFocused ? 'is-focus' : ''}`}>
                <CardExpiryElement
                  onFocus={() => setIsCardExpiryFocused(true)}
                  onBlur={() => setIsCardExpiryFocused(false)}
                  options={{
                    style: {
                      base: { fontSize: '14px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                      invalid: { color: '#df1b41' },
                    },
                  }}
                  onChange={(event) => {
                    if (event.error) {
                      setCardExpirationError(event.error.message);
                      setCardError(event.error.message);
                    } else {
                      setCardExpirationError(null);
                      setCardError(null);
                    }
                  }}
                />
              </div>
            </div>

            {/* Security Code (CVC) */}
            <div className="checkout-field">
              <label className='checkout-label'>Security Code (CVC)</label>
              <div className={`stripe-input-container stripe-input-container--right ${cardCVCError ? 'is-invalid' : ''} ${isCardCvcFocused ? 'is-focus' : ''}`}>
                <CardCvcElement
                  onFocus={() => setIsCardCvcFocused(true)}
                  onBlur={() => setIsCardCvcFocused(false)}
                  options={{
                    style: {
                      base: { fontSize: '14px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                      invalid: { color: '#df1b41' },
                    },
                  }}
                  onChange={(event) => {
                    if (event.error) {
                      setCardCVCError(event.error.message);
                      setCardError(event.error.message);
                    } else {
                      setCardCVCError(null);
                      setCardError(null);
                    }
                  }}
                />
                <img
                  src={'/images/card-icon.png'}
                  alt={'credit card icon'}
                  className="card-icon"
                />
              </div>
            </div>
          </div>

          <div className={`card-error ${cardError ? 'card-error-visible' : ''}`}>{cardError}</div>

          {/* Name on Card and Country Group */}
          <div className="checkout-fieldset">
            <div className="checkout-field">
              <Field
                className="stripe-input-card-name"
                name="cardName"
                type="text"
                label="Name on Card"
                placeholder="Full Name"
                component={CustomInput}
                style={{ textTransform: 'capitalize' }}
              />
            </div>
          </div>
          <div className="checkout-fieldset">
            <div className="checkout-field">
              <label className='checkout-label' htmlFor="country" >Countries or Regions</label>
              <Field
                as="select"
                name="country"
                id="country"
                className="country-select" // Uses the new country-select style
              >
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Field>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default CreditPayment;
