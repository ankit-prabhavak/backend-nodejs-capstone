/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const {loadData} = require("./util/import-mongo/index");

const app = express();
app.use("*", cors());
const port = 3060;

// Connect to MongoDB once at startup
connectToDatabase().then(() => {
    pinoLogger.info('Connected to DB');
}).catch((e) => console.error('Failed to connect to DB', e));

app.use(express.json());

// Route files
// authRoutes — Module 3 (placeholder)
const authRoutes = require('./routes/authRoutes');

// Items API Task 1: import secondChanceItemsRoutes
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');

// Search API Task 1: import searchRoutes
const searchRoutes = require('./routes/searchRoutes');

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
// authRoutes — Module 3 (placeholder)
app.use('/api/secondchance/auth', authRoutes);

// Items API Task 2: wire secondChanceItemsRoutes
app.use('/api/secondchance/items', secondChanceItemsRoutes);

// Search API Task 2: wire searchRoutes
app.use('/api/secondchance', searchRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

app.get("/", (req, res) => {
    res.send("Inside the server")
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});