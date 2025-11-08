// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Optional: remove previous dev users created by this script
    await User.deleteMany({ email: /dev@local/ });

    // Create dev user
    const devUser = new User({
      name: 'Dev User',
      email: 'dev@local',
      password: 'password123' // will be hashed by pre-save hook
    });
    await devUser.save();

    // Sample subscriptions
    const subs = [
      {
        user: devUser._id,
        name: 'Netflix',
        cost: 9.99,
        billingCycle: 'Monthly',
        nextDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        category: 'Entertainment'
      },
      {
        user: devUser._id,
        name: 'Spotify',
        cost: 4.99,
        billingCycle: 'Monthly',
        nextDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        category: 'Music'
      },
      {
        user: devUser._id,
        name: 'AWS',
        cost: 25.0,
        billingCycle: 'Monthly',
        nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        category: 'Work'
      }
    ];

    await Subscription.insertMany(subs);

    console.log('Seed complete.');
    console.log('Dev credentials: dev@local / password123');
    console.log('Dev user id:', devUser._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

run();
