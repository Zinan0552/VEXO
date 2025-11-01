// src/components/Payment/StripePayment.js
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { Loader2, CreditCard, Shield, CheckCircle2 } from 'lucide-react';

const Payment = ({ 
  amount, 
  onSuccess, 
  onCancel, 
  orderDetails,
  customerEmail 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Create payment intent when component mounts
  useEffect(() => {
    createPaymentIntent();
  }, [amount]);

  const createPaymentIntent = async () => {
    try {
      // In a real app, this would call your backend
      // For now, we'll simulate the response
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            orderId: orderDetails?.id || `order_${Date.now()}`,
            customerEmail: customerEmail
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setPaymentError('');

    try {
      const cardElement = elements.getElement(CardElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: customerEmail,
            name: orderDetails?.shippingDetails?.fullName || 'Customer',
            address: {
              line1: orderDetails?.shippingDetails?.address,
              city: orderDetails?.shippingDetails?.city,
              postal_code: orderDetails?.shippingDetails?.postalCode,
            }
          },
        },
      });

      if (stripeError) {
        setPaymentError(stripeError.message);
        toast.error(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError('An unexpected error occurred');
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9CA3AF',
        },
        padding: '10px',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Secure Payment</h2>
              <p className="text-gray-300 text-sm">Powered by Stripe</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure</span>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="p-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Order Total</span>
            <span className="text-2xl font-bold text-gray-900">${amount.toFixed(2)}</span>
          </div>
          {orderDetails && (
            <div className="text-sm text-gray-500">
              {orderDetails.items?.length} item(s) • {orderDetails.shippingDetails?.city}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Element */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Card Information
            </label>
            <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 focus-within:border-red-500 transition-colors">
              <CardElement options={cardElementOptions} />
            </div>
            {paymentError && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {paymentError}
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Your payment is secure</p>
                <p className="mt-1">We use Stripe for secure payment processing. Your card details are never stored on our servers.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || !clientSecret || processing}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Pay ${amount.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Accepted Cards */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">We accept</p>
          <div className="flex justify-center space-x-4">
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
            <div className="w-10 h-6 bg-blue-900 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
            <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
            <div className="w-10 h-6 bg-yellow-600 rounded flex items-center justify-center text-white text-xs font-bold">DISC</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;