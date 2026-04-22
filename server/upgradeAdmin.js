require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const upgrade = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');
    const result = await User.updateMany({}, { role: 'admin' });
    console.log(`Successfully upgraded ${result.modifiedCount} users to 'admin' role!`);
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

upgrade();
