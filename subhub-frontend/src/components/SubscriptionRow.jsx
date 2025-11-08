import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 🔹 Helper: dynamic status update based on due date
const getStatus = (subscription) => {
  // Always ACTIVE for free subscriptions
  if (subscription.billingCycle === 'Free') {
    return 'ACTIVE';
  }

  if (!subscription.nextDueDate) return subscription.status?.toUpperCase() || 'INACTIVE';
  const today = new Date();
  const due = new Date(subscription.nextDueDate);
  return due < today ? 'INACTIVE' : subscription.status?.toUpperCase() || 'ACTIVE';
};

// 🔹 Helper: CSS class mapping for status
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

function SubscriptionRow({ subscription, onDelete }) {
  if (!subscription) return null;
  const navigate = useNavigate();

  const [imgSrc, setImgSrc] = useState(subscription.logoUrl || '/placeholder.png');

  const handleImgError = () => {
    if (imgSrc !== '/placeholder.png') {
      setImgSrc('/placeholder.png');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const displayStatus = getStatus(subscription);
  const cost = parseFloat(subscription.cost) || 0;

  return (
    <tr className="sub-table-row">
      {/* --- Service + Logo --- */}
      <td className="sub-table-cell sub-table-service">
        <img
          src={imgSrc}
          alt={`${subscription.name || 'Service'} logo`}
          className="service-logo"
          onError={handleImgError}
          loading="lazy"
          style={{ transition: 'opacity 0.3s ease-in-out' }}
        />
        <div className="service-info">
          <span className="service-name">{subscription.name}</span>
          {/* ⭐ Optional small badge for upgraded services */}
          {subscription.wasUpgraded && (
            <span className="upgrade-badge">⭐ Upgraded</span>
          )}
        </div>
      </td>

      {/* --- Cost --- */}
      <td className="sub-table-cell sub-table-cost">
        {subscription.billingCycle === 'Free' ? 'Free' : `$${cost.toFixed(2)}`}
      </td>

      {/* --- Billing Cycle --- */}
      <td className="sub-table-cell">{subscription.billingCycle}</td>

      {/* --- Next Payment --- */}
      <td className="sub-table-cell">{formatDate(subscription.nextDueDate)}</td>

      {/* --- Category --- */}
      <td className="sub-table-cell">{subscription.category}</td>

      {/* --- Status --- */}
      <td className="sub-table-cell">
        <span className={`status-pill ${getStatusClass(displayStatus)}`}>
          {displayStatus.toUpperCase()}
        </span>
      </td>

      {/* --- Actions --- */}
      <td className="sub-table-cell sub-table-actions">
        {/* 💳 Payment link */}
        {subscription.paymentUrl && (
          <a
            href={subscription.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            title="Go to Payment Page"
          >
            💳
          </a>
        )}

        {/* ⚙️ Manage link */}
        {subscription.manageUrl && (
          <a
            href={subscription.manageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            title="Manage Subscription"
          >
            ⚙️
          </a>
        )}

        {/* ✏️ Edit */}
        <Link
          to={`/subscriptions/edit/${subscription._id}`}
          className="action-btn"
          title="Edit Subscription"
        >
          ✏️
        </Link>

        {/* 🔼 Upgrade - only for Free subscriptions */}
        {subscription.billingCycle === 'Free' && (
          <button
            className="action-btn upgrade-btn"
            title="Upgrade Subscription"
            onClick={() => navigate(`/subscriptions/upgrade/${subscription._id}`)}
          >
            🔼
          </button>
        )}

        {/* 🚫 Cancel / 🔄 Reactivate */}
        {displayStatus === 'ACTIVE' && subscription.manageUrl && (
          <a
            href={subscription.manageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            title="Cancel Subscription"
          >
            🚫
          </a>
        )}

        {displayStatus === 'INACTIVE' && subscription.paymentUrl && (
          <a
            href={subscription.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn"
            title="Reactivate Subscription"
          >
            🔄
          </a>
        )}

        {/* 🗑️ Delete */}
        <button
          onClick={() => onDelete(subscription._id)}
          className="action-btn"
          title="Delete Subscription"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}

export default SubscriptionRow;
