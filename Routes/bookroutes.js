const express = require('express');
const router = express.Router();
const Book = require('../Models/book');

router.post('/', async (req, res) => {
    try {
        const { title, author, category } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }
        if (!author || !category) {
            return res.status(400).json({
                message: "Author and category are required"
            });
        }

        const book = new Book({
            title,
            author,
            category
        });

        await book.save();

        res.status(201).json({
            message: "Book added successfully",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding book",
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 10)
        );

        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments();

        res.status(200).json({
            currentPage: page,
            totalRecords: total,
            totalPages: Math.ceil(total / limit),
            books
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting books",
        });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        if (typeof availability !== 'boolean') {
            return res.status(400).json({
                message: "Availability must be true or false"
            });
        }

        const book = await Book.findByIdAndUpdate(
            id,
            { availability },
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: 'Book not found',
                error:error.message
            });
        }

        res.status(200).json({
            message: 'Book availability updated successfully',
            book
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating book',
            error: error.message
        });
    }
});

module.exports = router;