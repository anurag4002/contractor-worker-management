import jwt from "jsonwebtoken";

const secret = "f08e447cb07fd985541c3dc4a84d0c7f12b5095d50f071f307364e1158afc7bd10d8af99c0925670df923397913d1b2dbd39fcf6c81d41af971b3565b587e69a";

import mongoose from "mongoose";

const run = async () => {
    try {
        await mongoose.connect("mongodb+srv://shubhamsingh22485:21worker@cluster0.2nwntor.mongodb.net/worker%20management%20system?retryWrites=true&w=majority&appName=Cluster0");
        const Admin = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const adminUser = await Admin.findOne({ role: 'ADMIN' });
        if (!adminUser) { console.log('No admin found'); return process.exit(0); }

        const token = jwt.sign({ id: adminUser._id, role: adminUser.role, status: adminUser.status }, secret, { expiresIn: '1d' });

        console.log("Token:", token.substring(0, 20) + "...");

        const res = await fetch("http://localhost:5000/api/v1/dashboard", { headers: { Authorization: "Bearer " + token } });
        const data = await res.json();
        console.log("SUCCESS. Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.log("ERR:", err.message);
    }
    process.exit(0);
};
run();
