const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for secondChanceItems
router.get('/search', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        const collection = db.collection("secondChanceItems");

        // Initialize the query object
        let query = {};

        // Task 2: Add name filter only if name parameter exists and is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" };
        }

        // Task 3: Add other filters to the query
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: "i" };
        }
        if (req.query.condition) {
            query.condition = { $regex: req.query.condition, $options: "i" };
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseFloat(req.query.age_years) };
        }

        // Task 4: Fetch filtered items
        const secondChanceItems = await collection.find(query).toArray();

        res.json(secondChanceItems);
    } catch (e) {
        next(e);
    }
});

module.exports = router;