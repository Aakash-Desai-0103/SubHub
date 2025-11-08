import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SubscriptionRow from '../components/SubscriptionRow';
import api from '../services/api';
import './AllSubscriptionsPage.css';

// ✅ Enhanced helper to correctly handle "Free" subscriptions and missing dates
const getStatus = (sub) => {
  const today = new Date();

  // Always ACTIVE for free subscriptions
  if (sub.billingCycle === 'Free') {
    return 'ACTIVE';
  }

  // If no due date, fall back to current status or assume active
  if (!sub.nextDueDate) {
    return sub.status || 'ACTIVE';
  }

  const due = new Date(sub.nextDueDate);
  if (isNaN(due.getTime())) {
    // Invalid date → treat as active
    return sub.status || 'ACTIVE';
  }

  // Mark as inactive only if nextDueDate is valid and in the past
  if (due < today) {
    return 'INACTIVE';
  }

  return sub.status || 'ACTIVE';
};

function AllSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterBilling, setFilterBilling] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Sorting
  const [sortBy, setSortBy] = useState('name');

  // 🔹 Fetch data from backend
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/subscriptions');

        const subs = response.data.data || response.data || [];
        if (!Array.isArray(subs)) throw new Error('Invalid data format');

        setSubscriptions(subs);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
        setSubscriptions([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Delete subscription
  const handleDelete = async (id) => {
    const originalSubscriptions = [...subscriptions];
    setSubscriptions(subscriptions.filter((sub) => sub._id !== id));

    try {
      await api.delete(`/subscriptions/${id}`);
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      setSubscriptions(originalSubscriptions);
      alert('Failed to delete subscription.');
    }
  };

  // Filter values
  const categories = ['All', ...new Set(subscriptions.map((sub) => sub.category))];
  const billingCycles = ['All', ...new Set(subscriptions.map((sub) => sub.billingCycle))];
  const statuses = ['All', ...new Set(subscriptions.map((sub) => getStatus(sub)))];

  const filteredSubscriptions = subscriptions
    .filter((sub) => filterCategory === 'All' || sub.category === filterCategory)
    .filter((sub) => filterBilling === 'All' || sub.billingCycle === filterBilling)
    .filter((sub) => filterStatus === 'All' || getStatus(sub) === filterStatus);

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'cost') return a.cost - b.cost;
    if (sortBy === 'date') return new Date(a.nextDueDate) - new Date(b.nextDueDate);
    return 0;
  });

  const clearFilters = () => {
    setFilterCategory('All');
    setFilterBilling('All');
    setFilterStatus('All');
  };

  return (
    <>
      <Navbar />
      <div className="all-subs-container">
        <div className="all-subs-header">
          <h1>Subscription Management</h1>
          <p>
            Manage all your subscriptions in one place. Track costs, billing cycles, and upcoming
            payments.
          </p>
        </div>

        <div className="filter-bar">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={filterBilling} onChange={(e) => setFilterBilling(e.target.value)}>
            {billingCycles.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={clearFilters} className="btn-clear-filters">
            × Clear
          </button>

          <span className="filter-count">{`${filteredSubscriptions.length} subscriptions found`}</span>

          <Link to="/subscriptions/new" className="btn-add-new">
            + Add Subscription
          </Link>
        </div>

        <div className="sort-bar">
          <span className="sort-label">Sort by:</span>
          <button
            className={`btn-sort ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => setSortBy('name')}
          >
            Name
          </button>
          <button
            className={`btn-sort ${sortBy === 'cost' ? 'active' : ''}`}
            onClick={() => setSortBy('cost')}
          >
            Cost
          </button>
          <button
            className={`btn-sort ${sortBy === 'date' ? 'active' : ''}`}
            onClick={() => setSortBy('date')}
          >
            Next Payment
          </button>
        </div>

        <table className="subs-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Cost</th>
              <th>Billing Cycle</th>
              <th>Next Payment</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="no-subs-message">
                  Loading subscriptions...
                </td>
              </tr>
            ) : Array.isArray(sortedSubscriptions) && sortedSubscriptions.length > 0 ? (
              sortedSubscriptions.map((sub) => {
                const updatedSub = {
                  ...sub,
                  status: getStatus(sub),
                };
                return (
                  <SubscriptionRow
                    key={sub._id}
                    subscription={updatedSub}
                    onDelete={handleDelete}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-subs-message">
                  No subscriptions found. <Link to="/subscriptions/new">Add one!</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AllSubscriptionsPage;
