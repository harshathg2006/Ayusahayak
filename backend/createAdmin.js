require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path if needed

async function createAdmin() {
  const adminUsername = 'Sunrise'; // specify the username to check/create

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin with specific username already exists
    const existingAdmin = await User.findOne({ role: 'admin', username: adminUsername });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.username);
      return process.exit(0);
    }

    // Create new admin
    const admin = new User({
      username: adminUsername,
      role: 'admin',
      email: 'admin@example.com', // optional
    });

    await admin.save();
    console.log('Admin created successfully:', admin.username);

    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
