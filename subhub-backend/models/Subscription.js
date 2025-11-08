// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  // Link to the user who owns this subscription
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Subscription must have a name'],
  },
  cost: {
    type: Number,
    required: [true, 'Subscription must have a cost'],
    // ✅ allow 0 for free subscriptions
    min: [0, 'Cost cannot be negative'],
  },
  billingCycle: {
    type: String,
    required: [true, 'Please select a billing cycle'],
    // ✅ Added "Free" as a valid billing cycle
    enum: ['Monthly', 'Quarterly', 'Yearly', 'Free'],
    default: 'Monthly',
  },
  nextDueDate: {
    type: Date,
  },
  category: {
    type: String,
    default: 'Other',
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Inactive', 'Cancelled'],
  },
  description: {
    type: String,
  },
  logoUrl: {
    type: String,
  },
  paymentUrl: {
    type: String,
  },
  manageUrl: {
    type: String,
  },
  notes: {
    type: String,
  },

  // ✅ New field for reminder tracking
  lastReminderSent: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
