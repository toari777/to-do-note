//PATH: backend\models\task.model.js

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  // [추가] User 모델의 ObjectId를 저장할 필드
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 'User' 모델을 참조합니다.
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Task = mongoose.model('Task', taskSchema);