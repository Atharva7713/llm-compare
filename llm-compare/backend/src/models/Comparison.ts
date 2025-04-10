import mongoose from 'mongoose'

const comparisonSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  selectedModels: [{
    type: String,
    required: true,
  }],
  results: [{
    modelId: String,
    response: String,
    tokens: Number,
    time: Number,
    feedback: {
      rating: {
        type: String,
        enum: ['good', 'bad', 'average'],
      },
      comment: String,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Comparison = mongoose.model('Comparison', comparisonSchema) 