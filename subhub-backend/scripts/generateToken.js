// scripts/generateToken.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: node scripts/generateToken.js <USER_ID>');
  process.exit(1);
}

const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log(token);
