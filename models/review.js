import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewId: {
        type: String,
        required: true,
        unique: true
    }
})