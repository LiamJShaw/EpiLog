require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const tvRoutes = require('./routes/tvRoutes');
const filmRoutes = require('./routes/filmRoutes');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

// Use routes
app.use('/api/tv', tvRoutes);
app.use('/api/film', filmRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
