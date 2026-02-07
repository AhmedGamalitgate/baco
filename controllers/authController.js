const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, rePassword } = req.body;

    if (!name || !email || !phone || !password || !rePassword) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    if (password !== rePassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        msg: "User registered successfully"
      });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } 
      );

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: token,
        msg: "Login successful"
      });
      
    } else {
      res.status(401).json({ msg: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};