import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SubscriptionItem.css';

// 🔹 Helper: Determine real-time status
const getStatus = (subscription) => {
  // Always ACTIVE for free subscriptions
  if (subscription.billingCycle === 'Free') return 'ACTIVE';

  if (!subscription.nextDueDate) return subscription.status?.toUpperCase() || 'INACTIVE';
  const today = new Date();
  const due = new Date(subscription.nextDueDate);
  return due < today ? 'INACTIVE' : subscription.status?.toUpperCase() || 'ACTIVE';
};

// 🔹 Helper: CSS color class for status badge
const getStatusClass = (status) => {
  if (!status) return 'status-inactive';
  switch (status.toLowerCase()) {
    case 'active':
      return 'status-active';
    case 'inactive':
      return 'status-inactive';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return 'status-inactive';
  }
};

function SubscriptionItem({ subscription, onDelete }) {
  if (!subscription) return null;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const displayStatus = getStatus(subscription);
  const isActive = displayStatus === 'ACTIVE';
  const cost = parseFloat(subscription.cost) || 0;

  return (
    <div className="sub-item">
      <div className="sub-item-info">
        <h3>{subscription.name || 'Unnamed Subscription'}</h3>
        <p className="sub-item-cost">
          {subscription.billingCycle === 'Free'
            ? 'Free Plan'
            : `$${cost.toFixed(2)} / ${subscription.billingCycle}`}
        </p>
        <p className="sub-item-category">{subscription.category}</p>
        <p className="sub-item-due">
          {subscription.billingCycle === 'Free'
            ? 'No due date'
            : `Due: ${formatDate(subscription.nextDueDate)}`}
        </p>

        {/* 🔹 Status badge */}
        <p className={`sub-item-status ${getStatusClass(displayStatus)}`}>
          STATUS: {displayStatus}
        </p>
      </div>

      <div className="sub-item-actions">
        {/* 💳 Pay button (only when active & paid) */}
        {isActive &&
          subscription.paymentUrl &&
          subscription.billingCycle !== 'Free' && (
            <a
              href={subscription.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action btn-pay"
            >
              Pay
            </a>
          )}

        {/* ⚙️ Manage button (only when active & paid) */}
        {isActive &&
          subscription.manageUrl &&
          subscription.billingCycle !== 'Free' && (
            <a
              href={subscription.manageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action btn-manage"
            >
              Manage
            </a>
          )}

        {/* 🔼 Upgrade button (only for free subscriptions) */}
        {subscription.billingCycle === 'Free' && (
          <button
            className="btn-action btn-upgrade"
            onClick={() => navigate(`/subscriptions/upgrade/${subscription._id}`)}
          >
            🔼 Upgrade
          </button>
        )}

        {/* ✏️ Edit */}
        <Link
          to={`/subscriptions/edit/${subscription._id}`}
          className="btn-action btn-edit"
        >
          Edit
        </Link>

        {/* 🗑️ Delete */}
        <button
          onClick={() => onDelete(subscription._id)}
          className="btn-action btn-delete"
        >
          Delete
        </button>

        {/* ⏸ Show Inactive tag only when not active & not Free */}
        {!isActive && subscription.billingCycle !== 'Free' && (
          <span className="btn-disabled" title="Expired or inactive">
            Inactive
          </span>
        )}
      </div>
    </div>
  );
}

export default SubscriptionItem;
