const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const bookRoutes = require('./Routes/bookroutes');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Library Book Management API is running');
});

app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('DB Connected Successfully');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed');
    });