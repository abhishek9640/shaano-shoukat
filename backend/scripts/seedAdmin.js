require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@shaanoshaukat.com' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@shaanoshaukat.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@shaanoshaukat.com');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
