// controllers/analyticsController.js
const Subscription = require('../models/Subscription');
const mongoose = require('mongoose');

// -------------------- GET ANALYTICS --------------------
// GET /api/analytics?period=6months
// Optional query params: period=3months|6months|12months
exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Determine time period
    const { period = '6months' } = req.query;
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '12months':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 6 months
        startDate.setMonth(now.getMonth() - 6);
    }

    // Fetch subscriptions belonging to this user that fall within the window
    const matchStage = {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        nextDueDate: { $gte: startDate, $lte: now }
      }
    };

    // Category spending breakdown (Pie chart)
    const categoryBreakdown = await Subscription.aggregate([
      matchStage,
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$cost' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    // Monthly spending over time (Bar chart)
    const monthlyTrend = await Subscription.aggregate([
      matchStage,
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$nextDueDate' } },
          totalSpent: { $sum: '$cost' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top 5 subscriptions by total cost (List)
    const topSubscriptions = await Subscription.aggregate([
      matchStage,
      {
        $group: {
          _id: '$name',
          totalSpent: { $sum: '$cost' },
          occurrences: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      period,
      startDate,
      endDate: now,
      summary: {
        totalSpent: categoryBreakdown.reduce((sum, c) => sum + c.totalSpent, 0),
        activeCategories: categoryBreakdown.length,
        topSubscription: topSubscriptions[0]?._id || 'N/A'
      },
      charts: {
        categoryBreakdown,
        monthlyTrend,
        topSubscriptions
      }
    });
  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
