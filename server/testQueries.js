require('dotenv').config();
const mongoose = require('mongoose');
const Report = require('./models/Report');

const test = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const reports = await Report.find().sort({ createdAt: -1 }).limit(5);
    console.log("Recent reports statuses:");
    reports.forEach(r => console.log(`ID: ${r._id}, Title: ${r.title}, Status: ${r.status}`));
    mongoose.connection.close();
};

test();
