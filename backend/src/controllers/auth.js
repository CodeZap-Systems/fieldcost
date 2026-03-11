const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, phone, password, role = 'CUSTOMER' } = req.body;

    // Validate required fields
    if (!name || !phone || !password) {
      return res.status(400).json({
        error: 'Name, phone, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User with this phone number already exists'
      });
    }

    // Hash password with salt rounds of 10
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role
      }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    // Validate required fields
    if (!phone || !password) {
      return res.status(400).json({
        error: 'Phone and password are required'
      });
    }

    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { phone }
    });

    // Return 401 if user not found
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    // Return 401 if password invalid
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token (expires in 7 days)
    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
