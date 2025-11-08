import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import "./AnalyticsPage.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

// 🔹 Convert costs to monthly/quarterly/yearly
const calculateCostByView = (sub, view) => {
  const { billingCycle, cost } = sub;
  if (view === "Monthly") {
    if (billingCycle === "Yearly") return cost / 12;
    if (billingCycle === "Quarterly") return cost / 3;
    return cost;
  }
  if (view === "Quarterly") {
    if (billingCycle === "Monthly") return cost * 3;
    if (billingCycle === "Yearly") return cost / 4;
    return cost;
  }
  if (view === "Yearly") {
    if (billingCycle === "Monthly") return cost * 12;
    if (billingCycle === "Quarterly") return cost * 4;
    return cost;
  }
  return cost;
};

// 🔹 Group by category
const getCategoryData = (subs, view) => {
  const categoryMap = new Map();
  subs.forEach((sub) => {
    const adjustedCost = calculateCostByView(sub, view);
    const current = categoryMap.get(sub.category) || 0;
    categoryMap.set(sub.category, current + adjustedCost);
  });
  return Array.from(categoryMap, ([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  })).sort((a, b) => b.value - a.value);
};

// 🔹 Metric card
const MetricCard = ({ title, value, onClick, clickable }) => (
  <div
    className={`metric-card ${clickable ? "metric-card-clickable" : ""}`}
    onClick={clickable ? onClick : undefined}
    title={clickable ? "Click for details" : undefined}
  >
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

function AnalyticsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spendingView, setSpendingView] = useState("Monthly");

  const [keyMetrics, setKeyMetrics] = useState({
    monthly: 0,
    annual: 0,
    active: 0,
    savings: 0,
  });

  const [inactiveSavings, setInactiveSavings] = useState(0);
  const [yearlySwitchSavings, setYearlySwitchSavings] = useState(0);
  const [showSavingsDetails, setShowSavingsDetails] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState([]);

  // 🔹 Fetch subscriptions and compute analytics
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/subscriptions");
        const subs = response.data.data || response.data;
        setSubscriptions(subs);

        const today = new Date();
        const validSubs = subs.filter((s) => {
          const due = new Date(s.nextDueDate);
          return s.status?.toLowerCase() === "active" && due >= today;
        });

        if (subs.length === 0) {
          setKeyMetrics({ monthly: 0, annual: 0, active: 0, savings: 0 });
          setCategoryData([]);
          setBillingData([]);
          return;
        }

        // 🔹 Active & inactive classification
        const inactiveSubs = subs.filter(
          (s) =>
            s.status?.toLowerCase() !== "active" ||
            new Date(s.nextDueDate) < today
        );

        // 🔹 Key metrics
        const monthly = validSubs.reduce(
          (total, sub) => total + calculateCostByView(sub, "Monthly"),
          0
        );
        const active = validSubs.length;
        const inactiveSave = inactiveSubs.reduce(
          (acc, s) => acc + (s.cost || 0),
          0
        );

        // 🔹 Enhanced savings calculation
        // Monthly → Yearly (15% discount)
        const monthlyToYearlySavings = validSubs
          .filter((s) => s.billingCycle === "Monthly")
          .reduce((acc, s) => acc + s.cost * 12 * 0.15, 0);

        // Quarterly → Yearly (5% discount)
        const quarterlyToYearlySavings = validSubs
          .filter((s) => s.billingCycle === "Quarterly")
          .reduce((acc, s) => acc + s.cost * 4 * 0.05, 0);

        const yearlySave = monthlyToYearlySavings + quarterlyToYearlySavings;
        const potentialSavings = inactiveSave + yearlySave;

        setInactiveSavings(inactiveSave);
        setYearlySwitchSavings(yearlySave);

        setKeyMetrics({
          monthly: monthly.toFixed(2),
          annual: (monthly * 12).toFixed(2),
          active,
          savings: potentialSavings.toFixed(2),
        });

        setCategoryData(getCategoryData(validSubs, spendingView));

        // 🔹 Aggregate by billing cycle
        const billingSummary = ["Monthly", "Quarterly", "Yearly"].map(
          (cycle) => ({
            billingCycle: cycle,
            count: validSubs.filter((s) => s.billingCycle === cycle).length,
          })
        );
        setBillingData(billingSummary);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [spendingView]);

  // 🔹 Drill-down on category click
  const handleCategoryClick = (categoryName) => {
    if (!categoryName) return;
    const filtered = subscriptions.filter(
      (s) => s.category === categoryName
    );
    setCategoryDetails(filtered);
    setSelectedCategory(categoryName);
  };

  const topCategories = categoryData.slice(0, 4);
  const hasSubscriptions = subscriptions.length > 0;

  return (
    <>
      <Navbar />
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Spending Analytics</h1>
          <p className="analytics-subtext">
            Track your subscriptions and spending insights.
          </p>
        </div>

        {loading ? (
          <p className="no-payments-message">Loading analytics...</p>
        ) : !hasSubscriptions ? (
          <div className="empty-analytics">
            <h2>No Subscriptions Yet</h2>
            <p>
              Add your first subscription to start tracking your spending and
              savings.
            </p>
            <Link to="/subscriptions/new" className="btn-primary">
              + Add Subscription
            </Link>
          </div>
        ) : (
          <>
            {/* --- Metrics Section --- */}
            <div className="analytics-metrics-grid">
              <MetricCard
                title="Total Monthly Spending"
                value={`$${keyMetrics.monthly}`}
              />
              <MetricCard
                title="Annual Projection"
                value={`$${keyMetrics.annual}`}
              />
              <MetricCard
                title="Active Subscriptions"
                value={keyMetrics.active}
              />
              <MetricCard
                title="Potential Savings"
                value={`$${keyMetrics.savings}`}
                clickable
                onClick={() => setShowSavingsDetails(true)}
              />
            </div>

            {/* --- Charts Section --- */}
            {categoryData.length > 0 && (
              <div className="charts-grid">
                {/* 🔹 Spending by Category (interactive) */}
                <div className="chart-box">
                  <div className="chart-header">
                    <h3>Spending by Category</h3>
                    <div className="view-selector">
                      <label htmlFor="spendingView">View:</label>
                      <select
                        id="spendingView"
                        value={spendingView}
                        onChange={(e) => setSpendingView(e.target.value)}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="chart-box-split">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          onClick={(data) =>
                            handleCategoryClick(data?.name || null)
                          }
                        >
                          {categoryData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="top-categories-list">
                      <h4>Top Categories</h4>
                      {topCategories.map((cat, index) => (
                        <div key={cat.name} className="category-list-item">
                          <div className="category-list-name">
                            <span
                              className="color-dot"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></span>
                            {cat.name}
                          </div>
                          <span className="category-list-value">
                            ${cat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🔹 Spending by Billing Cycle */}
                <div className="chart-box">
                  <h3>Spending by Billing Cycle</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={billingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="billingCycle" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* 🔹 Category Breakdown Modal */}
            {selectedCategory && (
              <div className="category-detail-modal">
                <div className="modal-header">
                  <h3>{selectedCategory} – Detailed Breakdown</h3>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedCategory(null)}
                  >
                    ✕
                  </button>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={categoryDetails.map((s) => ({
                      name: s.name,
                      cost: calculateCostByView(s, spendingView),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="cost" fill="#007bff" />
                  </BarChart>
                </ResponsiveContainer>

                <ul className="category-detail-list">
                  {categoryDetails.map((s) => (
                    <li key={s._id}>
                      <strong>{s.name}</strong> — $
                      {calculateCostByView(s, spendingView).toFixed(2)} /{" "}
                      {s.billingCycle}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 🔹 Savings Breakdown Modal */}
            {showSavingsDetails && (
              <div className="savings-modal">
                <div className="savings-modal-content">
                  <h3>💰 Savings Breakdown</h3>
                  <p>Here’s how you’re saving money right now:</p>
                  <ul className="savings-breakdown">
                    <li>
                      <strong>Inactive / Cancelled Subscriptions:</strong>&nbsp;$
                      {inactiveSavings.toFixed(2)} per month
                    </li>
                    <li>
                      <strong>Annual Plan Discounts:</strong>&nbsp;$
                      {yearlySwitchSavings.toFixed(2)} per year
                    </li>
                    <li className="subtext">(15% for Monthly, 5% for Quarterly)</li>
                  </ul>

                  <p className="savings-summary">
                    <strong>Total Potential Savings:</strong> $
                    {keyMetrics.savings}
                  </p>

                  <button
                    className="close-btn"
                    onClick={() => setShowSavingsDetails(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AnalyticsPage;
