import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './AddSubscriptionPage.css';

function UpgradeSubscriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [currentPlan, setCurrentPlan] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState('Monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await api.get(`/subscriptions/${id}`);
        const sub = response.data.data || response.data;

        setName(sub.name);
        setCurrentPlan(sub.billingCycle);
      } catch (err) {
        console.error('Failed to load subscription:', err);
        alert('Could not load subscription details.');
        navigate('/subscriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch(`/subscriptions/${id}/upgrade`, {
        billingCycle,
        cost: parseFloat(cost),
        nextDueDate,
      });

      alert(`${name} upgraded successfully!`);
      navigate('/subscriptions');
    } catch (err) {
      console.error('Upgrade failed:', err);
      alert('Failed to upgrade. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="add-sub-page"><h1>Loading...</h1></div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="add-sub-page">
        <h1>Upgrade Subscription</h1>
        <p className="upgrade-info">
          You are upgrading <strong>{name}</strong> (current plan: {currentPlan})
        </p>

        <form onSubmit={handleSubmit} className="add-sub-form">
          <div className="form-group">
            <label htmlFor="billingCycle">New Billing Cycle</label>
            <select
              id="billingCycle"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              disabled={saving}
            >
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cost">Cost</label>
            <input
              type="number"
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              step="0.01"
              placeholder="e.g., 10.99"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nextDueDate">Next Payment Date</label>
            <input
              type="date"
              id="nextDueDate"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              required
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
              {saving ? 'Upgrading...' : 'Upgrade Plan'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpgradeSubscriptionPage;
