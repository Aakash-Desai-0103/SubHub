import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SubscriptionItem from '../components/SubscriptionItem';
import api from '../services/api';
import WelcomeModal from '../components/WelcomeModal';
import './Dashboard.css';

// --- Helper Functions ---
const getMonthlyCost = (sub) => {
  if (sub.billingCycle === 'Yearly') return sub.cost / 12;
  if (sub.billingCycle === 'Quarterly') return sub.cost / 4;
  return sub.cost;
};

const isDueSoon = (dateString) => {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  return dueDate >= today && dueDate <= nextWeek;
};

const getCategorySpending = (subs) => {
  const categoryMap = new Map();
  let totalSpending = 0;
  subs.forEach((sub) => {
    const monthlyCost = getMonthlyCost(sub);
    const currentCost = categoryMap.get(sub.category) || 0;
    categoryMap.set(sub.category, currentCost + monthlyCost);
    totalSpending += monthlyCost;
  });
  return {
    categories: Array.from(categoryMap, ([name, value]) => ({
      name,
      value,
      percent: totalSpending > 0 ? (value / totalSpending) * 100 : 0,
    })).sort((a, b) => b.value - a.value),
    totalSpending,
  };
};

const ProgressBar = ({ name, percent, value }) => {
  const COLORS = {
    Entertainment: '#0088FE',
    Work: '#00C49F',
    Fitness: '#FF8042',
    Other: '#FFBB28',
    Default: '#888',
  };
  const color = COLORS[name] || COLORS.Default;
  return (
    <div className="progress-item">
      <div className="progress-info">
        <span className="progress-name">{name}</span>
        <span className="progress-value">${value.toFixed(2)}</span>
      </div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fg"
          style={{ width: `${percent}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};
// --- End of Helper Functions ---

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [categorySpending, setCategorySpending] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const shouldShowWelcome = sessionStorage.getItem('showWelcome');
    if (shouldShowWelcome === 'true') {
      setShowWelcome(true);
      sessionStorage.removeItem('showWelcome');
    }

    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/subscriptions');
        const subs = response.data.data || response.data;

        setSubscriptions(subs);
        const { categories } = getCategorySpending(subs);
        setCategorySpending(categories);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleDelete = async (id) => {
    const originalSubscriptions = [...subscriptions];
    const newSubs = subscriptions.filter((sub) => sub._id !== id);
    setSubscriptions(newSubs);
    const { categories } = getCategorySpending(newSubs);
    setCategorySpending(categories);

    try {
      await api.delete(`/subscriptions/${id}`);
    } catch (error) {
      console.error('Failed to delete subscription:', error);
      setSubscriptions(originalSubscriptions);
      const { categories } = getCategorySpending(originalSubscriptions);
      setCategorySpending(categories);
      alert('Failed to delete subscription.');
    }
  };

  // --- Calculations ---
  const today = new Date();

  // Only count valid active subscriptions
  const activeSubs = subscriptions.filter((sub) => {
    const due = new Date(sub.nextDueDate);
    return sub.status?.toLowerCase() === 'active' && due >= today;
  });

  const activeSubsCount = activeSubs.length;

  // Calculate spending using only active (non-expired) subs
  const monthlyCost = activeSubs.reduce((total, sub) => total + getMonthlyCost(sub), 0);
  const annualCost = monthlyCost * 12;

  const upcomingPayments = activeSubs
    .filter((sub) => isDueSoon(sub.nextDueDate))
    .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));

  // --- Render ---
  return (
    <>
      <Navbar />
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back!</h1>
          <Link to="/subscriptions/new" className="btn-add-new-dash">
            + Add New
          </Link>
        </div>

        {loading ? (
          <p className="no-payments-message">Loading dashboard...</p>
        ) : (
          <>
            {/* --- Summary Cards --- */}
            <div className="summary-cards">
              <div className="card">
                <Link to="/analytics" className="card-link">
                  <h3>Total Monthly</h3>
                  <p>${monthlyCost.toFixed(2)}</p>
                </Link>
              </div>
              <div className="card">
                <Link to="/analytics" className="card-link">
                  <h3>Total Annual</h3>
                  <p>${annualCost.toFixed(2)}</p>
                </Link>
              </div>
              <div className="card">
                <Link to="/subscriptions" className="card-link">
                  <h3>Active Subs</h3>
                  <p>{activeSubsCount}</p>
                </Link>
              </div>
            </div>

            {/* --- Breakdown Section --- */}
            <div className="dashboard-breakdown">
              {/* Upcoming Payments */}
              <div className="upcoming-payments">
                <h2>Upcoming Payments (Next 7 Days)</h2>
                {upcomingPayments.length > 0 ? (
                  upcomingPayments.map((sub) => (
                    <SubscriptionItem key={sub._id} subscription={sub} onDelete={handleDelete} />
                  ))
                ) : (
                  <p className="no-payments-message">You're all paid up for the week!</p>
                )}
              </div>

              {/* Spending by Category */}
              <Link to="/analytics" className="category-spending-link">
                <div className="category-spending">
                  <h2>Spending by Category</h2>
                  {categorySpending.length > 0 ? (
                    categorySpending.map((cat) => (
                      <ProgressBar
                        key={cat.name}
                        name={cat.name}
                        percent={cat.percent}
                        value={cat.value}
                      />
                    ))
                  ) : (
                    <p className="no-payments-message">No spending data to show.</p>
                  )}
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
