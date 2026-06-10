const express = require('express')
const multer = require('multer')
const router = express.Router()
const connectToDatabase = require('../models/db')
const logger = require('../logger')

// Define the upload directory path
const directoryPath = 'public/images'

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

// Get all secondChanceItems
router.get('/', async (req, res, next) => {
  logger.info('/ called')
  try {
    // Task 1: Connect to MongoDB
    const db = await connectToDatabase()
    // Task 2: Access the secondChanceItems collection
    const collection = db.collection('secondChanceItems')
    // Task 3: Fetch all items
    const secondChanceItems = await collection.find({}).toArray()
    // Task 4: Return the items
    res.json(secondChanceItems)
  } catch (e) {
    logger.error('oops something went wrong', e)
    next(e)
  }
})

// Get a single secondChanceItem by ID
router.get('/:id', async (req, res, next) => {
  try {
    // Task 1: Connect to MongoDB
    const db = await connectToDatabase()
    // Task 2: Access the collection
    const collection = db.collection('secondChanceItems')
    // Task 3: Find item by id field (note: id is a string, not ObjectId)
    const secondChanceItem = await collection.findOne({ id: req.params.id })
    // Task 4: Return item or 404
    if (!secondChanceItem) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(secondChanceItem)
  } catch (e) {
    next(e)
  }
})

// Add a new item
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    // Task 1: Connect to MongoDB
    const db = await connectToDatabase()
    // Task 2: Access the collection
    const collection = db.collection('secondChanceItems')
    // Task 3: Create new item from request body
    const secondChanceItem = req.body
    // Task 4: Get last id, increment by 1, assign to new item
    const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray()
    secondChanceItem.id = lastItem.length > 0
      ? String(parseInt(lastItem[0].id) + 1)
      : '1'
    // Task 5: Set date_added to current date
    secondChanceItem.date_added = Math.floor(new Date().getTime() / 1000)
    // Task 6: Upload image if provided
    if (req.file) {
      secondChanceItem.image = `/images/${req.file.originalname}`
    }
    // Insert and return new item
    const result = await collection.insertOne(secondChanceItem)
    res.status(201).json({
      ...secondChanceItem,
      _id: result.insertedId
    })
  } catch (e) {
    next(e)
  }
})

// Update an existing item
router.put('/:id', async (req, res, next) => {
  try {
    // Task 1: Connect to MongoDB
    const db = await connectToDatabase()
    // Task 2: Access the collection
    const collection = db.collection('secondChanceItems')
    // Task 3: Check if item exists
    const existingItem = await collection.findOne({ id: req.params.id })
    if (!existingItem) {
      return res.status(404).json({ error: 'Item not found' })
    }
    // Task 4: Update allowed fields
    const updateFields = {
      category: req.body.category || existingItem.category,
      condition: req.body.condition || existingItem.condition,
      age_days: req.body.age_days || existingItem.age_days,
      description: req.body.description || existingItem.description,
      age_years: Number(
        (req.body.age_days / 365).toFixed(1)
      ) || existingItem.age_years,
      updatedAt: new Date()
    }
    // Task 5: Save and confirm
    await collection.updateOne(
      { id: req.params.id },
      { $set: updateFields }
    )
    res.json({ message: 'Item updated successfully', id: req.params.id })
  } catch (e) {
    next(e)
  }
})

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
  try {
    // Task 1: Connect to MongoDB
    const db = await connectToDatabase()
    // Task 2: Access the collection
    const collection = db.collection('secondChanceItems')
    // Task 3: Find item, return 404 if not found
    const secondChanceItem = await collection.findOne({ id: req.params.id })
    if (!secondChanceItem) {
      return res.status(404).json({ error: 'Item not found' })
    }
    // Task 4: Delete and confirm
    await collection.deleteOne({ id: req.params.id })
    res.json({ message: 'Item deleted successfully', id: req.params.id })
  } catch (e) {
    next(e)
  }
})

module.exports = router
