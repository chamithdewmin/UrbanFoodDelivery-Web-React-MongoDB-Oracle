import React, { useState, useEffect } from 'react';
import './promocode.css';

const PromoCode = () => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [expiration, setExpiration] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const mockCustomers = [
      { id: 1, name: 'Customer 1', email: 'customer1@example.com' },
      { id: 2, name: 'Customer 2', email: 'customer2@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
      { id: 3, name: 'Customer 3', email: 'customer3@example.com' },
    ];
    setCustomers(mockCustomers);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!promoCode) newErrors.promoCode = 'Promo code is required';
    if (!discountPrice || discountPrice <= 0) 
      newErrors.discountPrice = 'Valid discount price required';
    if (!expiration || new Date(expiration) < new Date()) 
      newErrors.expiration = 'Invalid expiration date';
    if (selectedCustomers.length === 0) 
      newErrors.customers = 'Select at least one customer';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      console.log('Sending promo codes:', {
        promoCode,
        discountPrice,
        expiration,
        customers: selectedCustomers
      });

      setPromoCode('');
      setDiscountPrice('');
      setExpiration('');
      setSelectedCustomers([]);
      alert('Promo codes sent successfully!');
    } catch (error) {
      alert('Error sending promo codes');
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomer = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  return (
    <div className="promo-container">
      <h2>Promo Code Distribution</h2>
      <div className="layout-container">
        <div className="customer-selection">
          <h3>Select Customers</h3>
          <div className="customer-list">
            {customers.map(customer => (
              <div 
                key={customer.id}
                className={`customer-item ${selectedCustomers.includes(customer.id) ? 'selected' : ''}`}
                onClick={() => toggleCustomer(customer.id)}
              >
                <div className="customer-info">
                  <div className="customer-name">{customer.name}</div>
                  <div className="customer-email">{customer.email}</div>
                </div>
              </div>
            ))}
          </div>
          {errors.customers && <div className="error-message">{errors.customers}</div>}
        </div>
        <div className="promo-form-section">
          <form onSubmit={handleSubmit} className="promo-form">
            <h3>Create Promo Code</h3>
            
            <div className="form-group">
              <label>Promo Code:</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={errors.promoCode ? 'error' : ''}
              />
              {errors.promoCode && <span className="error-message">{errors.promoCode}</span>}
            </div>

            <div className="form-group">
              <label>Discount Price ($):</label>
              <input
                type="number"
                min="1"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className={errors.discountPrice ? 'error' : ''}
              />
              {errors.discountPrice && <span className="error-message">{errors.discountPrice}</span>}
            </div>

            <div className="form-group">
              <label>Expiration Date:</label>
              <input
                type="datetime-local"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className={errors.expiration ? 'error' : ''}
              />
              {errors.expiration && <span className="error-message">{errors.expiration}</span>}
            </div>

            <button 
              type="submit" 
              className="send-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Promo Codes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromoCode;