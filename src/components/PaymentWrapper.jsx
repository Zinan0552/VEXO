// src/components/Payment/PaymentWrapper.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../../config/stripe';
import Payment from './Payment';

const PaymentWrapper = ({ 
  amount, 
  onSuccess, 
  onCancel, 
  orderDetails, 
  customerEmail 
}) => {
  return (
    <Elements stripe={stripePromise}>
      <Payment
        amount={amount}
        onSuccess={onSuccess}
        onCancel={onCancel}
        orderDetails={orderDetails}
        customerEmail={customerEmail}
      />
    </Elements>
  );
};

export default PaymentWrapper;