const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

const logger = pino();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /register
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();
        // Task 2: Access users collection
        const collection = db.collection("users");
        // Task 3: Check if email already exists
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }
        // Task 4: Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        // Task 5: Insert new user
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
        // Task 6: Create JWT token
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        // Task 7: Log success
        logger.info('User registered successfully');
        // Task 8: Return email and token
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});


// POST /login
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();
        // Task 2: Access users collection
        const collection = db.collection("users");
        // Task 3: Find user by email
        const theUser = await collection.findOne({ email: req.body.email });
        // Task 7: Send 404 if user not found
        if (!theUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Task 4: Compare password with hashed password
        const passwordMatch = await bcryptjs.compare(req.body.password, theUser.password);
        if (!passwordMatch) {
            logger.error('Passwords do not match');
            return res.status(400).json({ error: 'Wrong password. Please try again.' });
        }
        // Task 5: Fetch user details
        const userName = theUser.firstName;
        const userEmail = theUser.email;
        // Task 6: Create JWT token
        const payload = {
            user: {
                id: theUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({ authtoken, userName, userEmail });
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});


// PUT /update
router.put('/update', [
    // Task 1: Validate input
    body('name').notEmpty().withMessage('Name is required'),
], async (req, res) => {
    // Task 2: Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Task 3: Check email in header
        const email = req.headers.email;
        if (!email) {
            logger.error('Email not found in the request headers');
            return res.status(400).json({ error: 'Email not found in the request headers' });
        }
        // Task 4: Connect to MongoDB and access users collection
        const db = await connectToDatabase();
        const collection = db.collection("users");
        // Task 5: Find user by email
        const existingUser = await collection.findOne({ email });
        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        // Update fields
        existingUser.firstName = req.body.name;
        existingUser.updatedAt = new Date();
        // Task 6: Update user in database
        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );
        // Task 7: Create new JWT token
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');
        res.json({ authtoken });
    } catch (error) {
        logger.error(error);
        return res.status(500).send('Internal Server Error');
    }
});


module.exports = router;