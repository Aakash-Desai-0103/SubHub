// controllers/subscriptionController.js
const Subscription = require('../models/Subscription');

// -------------------- GET ALL SUBSCRIPTIONS --------------------
// GET /api/subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({ nextDueDate: 1 });
    const today = new Date();

    // ✅ Auto-update statuses based on billingCycle and nextDueDate
    const updatedSubscriptions = await Promise.all(
      subscriptions.map(async (sub) => {
        let shouldSave = false;

        // 1️⃣ Free subscriptions → Always Active
        if (sub.billingCycle === 'Free') {
          if (sub.status !== 'Active') {
            sub.status = 'Active';
            shouldSave = true;
          }
        }

        // 2️⃣ Paid subscriptions with valid due date
        else if (sub.nextDueDate) {
          const dueDate = new Date(sub.nextDueDate);

          if (!isNaN(dueDate)) {
            // Past due → Inactive
            if (dueDate < today && sub.status !== 'Inactive') {
              sub.status = 'Inactive';
              shouldSave = true;
            }

            // Future due → Active
            if (dueDate >= today && sub.status !== 'Active') {
              sub.status = 'Active';
              shouldSave = true;
            }
          }
        }

        // 3️⃣ Save only if something changed
        if (shouldSave) await sub.save();

        return sub;
      })
    );

    return res.status(200).json({
      success: true,
      count: updatedSubscriptions.length,
      data: updatedSubscriptions,
    });
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- CREATE NEW SUBSCRIPTION --------------------
// POST /api/subscriptions
exports.createSubscription = async (req, res) => {
  try {
    const { status, ...rest } = req.body;

    // ✅ Include accountUrl and other optional fields automatically via spread
    const subscription = new Subscription({
      user: req.user._id,
      ...rest,
      status:
        status && ['Active', 'Inactive', 'Cancelled'].includes(status)
          ? status
          : 'Active',
    });

    const created = await subscription.save();

    return res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: created,
    });
  } catch (err) {
    console.error('Error creating subscription:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// -------------------- GET SINGLE SUBSCRIPTION --------------------
// GET /api/subscriptions/:id
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription)
      return res.status(404).json({ success: false, message: 'Subscription not found' });

    if (subscription.user.toString() !== req.user._id.toString())
      return res.status(401).json({ success: false, message: 'Not authorized' });

    return res.status(200).json({ success: true, data: subscription });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- UPDATE SUBSCRIPTION --------------------
// PUT /api/subscriptions/:id
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription)
      return res.status(404).json({ success: false, message: 'Subscription not found' });

    if (subscription.user.toString() !== req.user._id.toString())
      return res.status(401).json({ success: false, message: 'Not authorized' });

    // ✅ Allow updating accountUrl and other fields
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error('Error updating subscription:', err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// -------------------- DELETE SUBSCRIPTION --------------------
// DELETE /api/subscriptions/:id
exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription)
      return res.status(404).json({ success: false, message: 'Subscription not found' });

    if (subscription.user.toString() !== req.user._id.toString())
      return res.status(401).json({ success: false, message: 'Not authorized' });

    await subscription.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting subscription:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- CANCEL SUBSCRIPTION --------------------
// PATCH /api/subscriptions/:id/cancel
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription)
      return res.status(404).json({ success: false, message: 'Subscription not found' });

    if (subscription.user.toString() !== req.user._id.toString())
      return res.status(401).json({ success: false, message: 'Not authorized' });

    subscription.status = req.body.status || 'Inactive';
    await subscription.save();

    return res.status(200).json({
      success: true,
      message: `Subscription ${subscription.status.toLowerCase()} successfully`,
      data: subscription,
    });
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------- UPGRADE SUBSCRIPTION --------------------
// PATCH /api/subscriptions/:id/upgrade
exports.upgradeSubscription = async (req, res) => {
  try {
    const { billingCycle, cost, nextDueDate } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription)
      return res.status(404).json({ success: false, message: 'Subscription not found' });

    if (subscription.user.toString() !== req.user._id.toString())
      return res.status(401).json({ success: false, message: 'Not authorized' });

    if (subscription.billingCycle !== 'Free') {
      return res
        .status(400)
        .json({ success: false, message: 'Only free subscriptions can be upgraded' });
    }

    subscription.billingCycle = billingCycle || 'Monthly';
    subscription.cost = parseFloat(cost) || 0;
    subscription.nextDueDate = nextDueDate ? new Date(nextDueDate) : null;
    subscription.status = 'Active';

    await subscription.save();

    return res.status(200).json({
      success: true,
      message: 'Subscription upgraded successfully',
      data: subscription,
    });
  } catch (err) {
    console.error('Error upgrading subscription:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
