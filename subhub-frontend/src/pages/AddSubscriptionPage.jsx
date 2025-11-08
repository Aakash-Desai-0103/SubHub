import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './AddSubscriptionPage.css';

function AddSubscriptionPage() {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [notes, setNotes] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [manageUrl, setManageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Handle billing cycle change (for Free option)
  const handleBillingCycleChange = (e) => {
    const value = e.target.value;
    setBillingCycle(value);

    if (value === 'Free') {
      setCost(0);
      setNextDueDate(''); // Free subscriptions don’t have due dates
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newSubscription = {
      name: name.trim(),
      cost: parseFloat(cost) || 0,
      billingCycle,
      nextDueDate: billingCycle === 'Free' ? null : nextDueDate || undefined,
      category,
      notes,
      paymentUrl,
      manageUrl,
      logoUrl,
      status: 'Active',
    };

    try {
      const response = await api.post('/subscriptions', newSubscription);
      const created = response.data.data || response.data;
      console.log('✅ Subscription created:', created);

      navigate('/subscriptions');
    } catch (error) {
      console.error('❌ Failed to add subscription:', error);
      alert('Failed to add subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="add-sub-page">
        <h1>Add New Subscription</h1>

        <form onSubmit={handleSubmit} className="add-sub-form">
          <div className="form-group">
            <label htmlFor="name">Subscription Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Netflix"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cost">Cost</label>
              <input
                type="number"
                id="cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required={billingCycle !== 'Free'}
                placeholder="15.99"
                step="0.01"
                disabled={loading || billingCycle === 'Free'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="billingCycle">Billing Cycle</label>
              <select
                id="billingCycle"
                value={billingCycle}
                onChange={handleBillingCycleChange}
                disabled={loading}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
                <option value="Free">Free</option> {/* ✅ Added new option */}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nextDueDate">Next Due Date</label>
              <input
                type="date"
                id="nextDueDate"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                disabled={loading || billingCycle === 'Free'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Work">Work</option>
                <option value="Utilities">Utilities</option>
                <option value="Fitness">Fitness</option>
                <option value="Education">Education</option> {/* ✅ Added useful category */}
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paymentUrl">Payment URL (Optional)</label>
            <input
              type="url"
              id="paymentUrl"
              value={paymentUrl}
              onChange={(e) => setPaymentUrl(e.target.value)}
              placeholder="https://netflix.com/pay"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="manageUrl">Manage/Cancel URL (Optional)</label>
            <input
              type="url"
              id="manageUrl"
              value={manageUrl}
              onChange={(e) => setManageUrl(e.target.value)}
              placeholder="https://netflix.com/YourAccount"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="logoUrl">Logo Image URL (Optional)</label>
            <input
              type="url"
              id="logoUrl"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://assets.netflix.com/logo.png"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Standard plan or free-tier account"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddSubscriptionPage;
