const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const name = "Admin";
    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      existingAdmin.role = "admin";

      await existingAdmin.save();

      console.log("Existing user has been made ADMIN");

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", admin.role);
    console.log("================================");

    process.exit(0);

  } catch (error) {
    console.error("Error creating admin:");
    console.error(error);

    process.exit(1);
  }
};

createAdmin();