import { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, bookingDetails, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    cardType: 'visa',
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const cardTypes = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'amex', label: 'American Express' },
  ];

  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const validateForm = () => {
    const newErrors = {};

    if (!paymentData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Cardholder name is required';
    }

    const cardNumberClean = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardNumberClean) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!paymentData.expiryMonth) {
      newErrors.expiryMonth = 'Month required';
    }

    if (!paymentData.expiryYear) {
      newErrors.expiryYear = 'Year required';
    }

    // Check if card is expired
    if (paymentData.expiryMonth && paymentData.expiryYear) {
      const expiry = new Date(paymentData.expiryYear, paymentData.expiryMonth - 1);
      const now = new Date();
      if (expiry < now) {
        newErrors.expiryMonth = 'Card expired';
        newErrors.expiryYear = 'Card expired';
      }
    }

    if (!paymentData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '');
      formattedValue = formatCardNumber(cleaned.slice(0, 19));
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (name === 'cardHolderName') {
      formattedValue = value.toUpperCase();
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate transaction ID
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Get last 4 digits of card
      const cardLast4 = paymentData.cardNumber.replace(/\s/g, '').slice(-4);

      // Call parent callback with payment details
      await onPaymentSuccess({
        payment_method: paymentData.cardType,
        card_type: paymentData.cardType,
        card_holder_name: paymentData.cardHolderName,
        card_last_four: cardLast4,
        transaction_id: transactionId,
        amount: bookingDetails.amount
      });

      // Reset form
      setPaymentData({
        cardType: 'visa',
        cardHolderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Payment failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto"
      onClick={(e) => {
        // Close modal when clicking the backdrop
        if (e.target === e.currentTarget && !processing) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-8 relative max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
              <p className="text-sm text-gray-500">Secure payment processing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tutor:</span>
              <span className="font-medium text-gray-900">{bookingDetails.tutorName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium text-gray-900">{bookingDetails.packageName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sessions:</span>
              <span className="font-medium text-gray-900">{bookingDetails.sessions}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-300 mt-2">
              <span className="font-semibold text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-primary-600">
                Rs. {bookingDetails.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Card Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Type
            </label>
            <select
              name="cardType"
              value={paymentData.cardType}
              onChange={handleInputChange}
              disabled={processing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
            >
              {cardTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardHolderName"
              value={paymentData.cardHolderName}
              onChange={handleInputChange}
              disabled={processing}
              placeholder="JOHN DOE"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 ${
                errors.cardHolderName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardHolderName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleInputChange}
              disabled={processing}
              placeholder="1234 5678 9012 3456"
              maxLength="23"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                name="expiryMonth"
                value={paymentData.expiryMonth}
                onChange={handleInputChange}
                disabled={processing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">MM</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              {errors.expiryMonth && (
                <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                name="expiryYear"
                value={paymentData.expiryYear}
                onChange={handleInputChange}
                disabled={processing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.expiryYear ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">YYYY</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {errors.expiryYear && (
                <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleInputChange}
                disabled={processing}
                placeholder="123"
                maxLength="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 ${
                  errors.cvv ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Lock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay Rs. {bookingDetails.amount.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
