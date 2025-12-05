/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Boundary } from '@/components/common';
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setShippingDetails } from '@/redux/actions/checkoutActions';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import ShippingForm from './ShippingForm';
import ShippingTotal from './ShippingTotal';

const FormSchema = Yup.object().shape({
  firstname: Yup.string()
    .required('First name is required.'),
  lastname: Yup.string()
    .required('Last name is required.'),
  addressline1: Yup.string()
    .required('Shipping address line is required.'),
  addressline2: Yup.string()
    .optional(),
  city: Yup.string()
    .required('City is required.'),
  country: Yup.string()
    .required('Country is required.'),
  zipcode: Yup.number()
    .required('Zip code is required.'),
  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required('Mobile number is required'),
      value: Yup.string().required('Mobile number is required')
    })
    .required('Mobile number is required.'),
  isInternational: Yup.boolean(),
  isDone: Yup.boolean()
});

const ShippingDetails = ({ profile, shipping, subtotal }) => {
  useDocumentTitle('Check Out Step 2 | Salinaka');
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();

  const initFormikValues = {
    firstname: shipping.firstname || '',
    lastname: shipping.lastname || '',
    addressline1: shipping.address.addressline1 || '',
    addressline2: shipping.address.addressline2 || '',
    city: shipping.address.city || '',
    zipcode: shipping.address.zipcode,
    country: shipping.address.country || 'US',
    mobile: shipping.mobile || profile.mobile || {},
    isInternational: shipping.isInternational || false,
    isDone: shipping.isDone || false
  };

  const onSubmitForm = (form) => {
    console.log(form)
    dispatch(setShippingDetails({
      address: {
        firstname: form.firstname,
        lastname: form.lastname,
        addressline1: form.addressline1,
        addressline2: form.addressline2,
        country: form.country,
        zipcode: form.zipcode,
        city: form.city
      },
      mobile: form.mobile,
      isInternational: form.isInternational,
      isDone: true
    }));
    history.push(CHECKOUT_STEP_3);
  };

  return (
    <Boundary>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h3 className="text-center">Shipping Details</h3>
          <Formik
            initialValues={initFormikValues}
            validateOnChange
            validationSchema={FormSchema}
            onSubmit={onSubmitForm}
          >
            {({values, errors, touched}) => {
              return (
                <Form>
                  <ShippingForm />
                  <br />
                  {/*  ---- TOTAL --------- */}
                  <ShippingTotal subtotal={subtotal} />
                  <br />
                  {/*  ----- NEXT/PREV BUTTONS --------- */}
                  <div className="checkout-shipping-action">
                    <button
                      className="button button-muted"
                      onClick={() => history.push(CHECKOUT_STEP_1)}
                      type="button"
                    >
                      <ArrowLeftOutlined />
                      &nbsp;
                      Go Back
                    </button>
                    <button
                      className="button button-icon"
                      type="submit"
                    >
                      Next Step
                      &nbsp;
                      <ArrowRightOutlined />
                    </button>
                  </div>
                </Form>
            )}
          }
          </Formik>
        </div>
      </div>
    </Boundary>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object
  }).isRequired,
  shipping: PropType.shape({
    address: PropType.object,
    mobile: PropType.object,
    isInternational: PropType.bool,
    isDone: PropType.bool
  }).isRequired
};

export default withCheckout(ShippingDetails);
