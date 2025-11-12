import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './AddSubscriptionPage.css'; // Reuse the same CSS

function EditSubscriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [notes, setNotes] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [manageUrl, setManageUrl] = useState('');
  const [accountUrl, setAccountUrl] = useState(''); // ✅ new state
  const [logoFile, setLogoFile] = useState(null);

  // Loading State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Fetch subscription data on page load ---
  useEffect(() => {
    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/subscriptions/${id}`);
        const subToEdit = response.data.data || response.data;

        // ✅ Safely format and populate form
        setName(subToEdit.name || '');
        setCost(subToEdit.cost || '');
        setBillingCycle(subToEdit.billingCycle || 'Monthly');
        setNextDueDate(
          subToEdit.nextDueDate
            ? new Date(subToEdit.nextDueDate).toISOString().split('T')[0]
            : ''
        );
        setCategory(subToEdit.category || 'Entertainment');
        setNotes(subToEdit.notes || '');
        setPaymentUrl(subToEdit.paymentUrl || '');
        setManageUrl(subToEdit.manageUrl || '');
        setAccountUrl(subToEdit.accountUrl || ''); // ✅ load from DB if exists
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        alert(error.response?.data?.message || 'Could not load subscription data.');
        navigate('/subscriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  // --- Handle Billing Cycle Change ---
  const handleBillingCycleChange = (e) => {
    const value = e.target.value;
    setBillingCycle(value);

    if (value === 'Free') {
      setCost(0);
      setNextDueDate('');
    }
  };

  // --- Handle Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedSubscription = {
      name,
      cost: parseFloat(cost),
      billingCycle,
      nextDueDate: billingCycle === 'Free' ? null : nextDueDate ? new Date(nextDueDate) : null,
      category,
      notes,
      paymentUrl,
      manageUrl,
      accountUrl, // ✅ include new field
    };

    try {
      await api.put(`/subscriptions/${id}`, updatedSubscription);
      navigate('/subscriptions');
    } catch (error) {
      console.error('Failed to update subscription:', error);
      alert(error.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // --- Show Loading State ---
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="add-sub-page">
          <h1>Loading...</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="add-sub-page">
        <h1>Edit Subscription</h1>

        <form onSubmit={handleSubmit} className="add-sub-form">
          <div className="form-group">
            <label htmlFor="name">Subscription Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
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
                step="0.01"
                disabled={saving || billingCycle === 'Free'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="billingCycle">Billing Cycle</label>
              <select
                id="billingCycle"
                value={billingCycle}
                onChange={handleBillingCycleChange}
                disabled={saving}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
                <option value="Free">Free</option>
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
                disabled={saving || billingCycle === 'Free'}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={saving}
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Work">Work</option>
                <option value="Utilities">Utilities</option>
                <option value="Fitness">Fitness</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* --- URL Fields --- */}
          <div className="form-group">
            <label htmlFor="paymentUrl">Payment URL (Optional)</label>
            <input
              type="url"
              id="paymentUrl"
              value={paymentUrl}
              onChange={(e) => setPaymentUrl(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="manageUrl">Manage/Cancel URL (Optional)</label>
            <input
              type="url"
              id="manageUrl"
              value={manageUrl}
              onChange={(e) => setManageUrl(e.target.value)}
              disabled={saving}
            />
          </div>

          {/* ✅ New Account Page URL field */}
          <div className="form-group">
            <label htmlFor="accountUrl">Account Page URL (Optional)</label>
            <input
              type="url"
              id="accountUrl"
              value={accountUrl}
              onChange={(e) => setAccountUrl(e.target.value)}
              placeholder="https://github.com/username"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="logoUpload">Upload New Logo (Optional)</label>
            <input
              type="file"
              id="logoUpload"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              disabled={saving}
            />
            {logoFile && <span className="file-name">{logoFile.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditSubscriptionPage;
